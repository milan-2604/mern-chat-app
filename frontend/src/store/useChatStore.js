import { create } from 'zustand';
import toast from 'react-hot-toast';
import React from 'react'; // Added to use React.createElement
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';
import NotificationToast from '../components/NotificationToast'; // Import the new component

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSending: false,
    unreadCounts: {}, // Tracks unread counts map like { userId: count }
    lastMessageTimestamps: {}, // 🔥 Tracks last message timestamp for each user { userId: timestamp }

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/messages/users');
            set({ users: res.data });

            // 🔥 Pre-seed timestamps if backend populates lastMessage metadata in the user array
            const initialTimestamps = {};
            res.data.forEach((user) => {
                if (user.lastMessage?.createdAt) {
                    initialTimestamps[user._id] = new Date(user.lastMessage.createdAt).getTime();
                } else if (user.updatedAt) {
                    // Fallback to user document updates if custom message subdocuments aren't present yet
                    initialTimestamps[user._id] = new Date(user.updatedAt).getTime();
                }
            });

            if (Object.keys(initialTimestamps).length > 0) {
                set((state) => ({
                    lastMessageTimestamps: { ...state.lastMessageTimestamps, ...initialTimestamps }
                }));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load users");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
            
            // Clear unread count for this specific user when their chat thread loads
            set((state) => ({
                unreadCounts: { ...state.unreadCounts, [userId]: 0 }
            }));

            // 🔥 Sync timestamp map with the actual last message in the conversation logs
            if (res.data.length > 0) {
                const latestMsg = res.data[res.data.length - 1];
                set((state) => ({
                    lastMessageTimestamps: {
                        ...state.lastMessageTimestamps,
                        [userId]: new Date(latestMsg.createdAt).getTime()
                    }
                }));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        set({ isSending: true });
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });

            // 🔥 Update timestamp instantly when YOU send a new message
            set((state) => ({
                lastMessageTimestamps: {
                    ...state.lastMessageTimestamps,
                    [selectedUser._id]: new Date(res.data.createdAt).getTime()
                }
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
        } finally {
            set({ isSending: false }); 
        }
    },

    // Delete Message Action
    deleteMessage: async (messageId) => {
        try {
            const res = await axiosInstance.delete(`/messages/delete/${messageId}`);
            
            set((state) => ({
                messages: state.messages.map((msg) =>
                    msg._id === messageId ? res.data : msg
                ),
            }));
            
            toast.success("Message deleted");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete message");
        }
    },

    // Edit Message Action
    editMessage: async (messageId, newText) => {
        try {
            const res = await axiosInstance.put(`/messages/edit/${messageId}`, { text: newText });
            
            set((state) => ({
                messages: state.messages.map((msg) => 
                    msg._id === messageId ? res.data : msg
                ),
            }));
            
            toast.success("Message updated");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to edit message");
        }
    },

    subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("newMessage");

        socket.on("newMessage", (newMessage) => {
            const currentSelectedUser = get().selectedUser;
            const msgTime = new Date(newMessage.createdAt).getTime();
            
            // 🔥 Dynamically locate who we need to associate this message with (Sender vs Receiver fallback)
            const chatPartnerId = newMessage.senderId === useAuthStore.getState().user?._id 
                ? newMessage.receiverId 
                : newMessage.senderId;

            // 🔥 Update timestamp state map instantly when an incoming socket packet drops
            set((state) => ({
                lastMessageTimestamps: {
                    ...state.lastMessageTimestamps,
                    [chatPartnerId]: msgTime
                }
            }));

            // If actively chatting with the sender, just append it locally and skip notifications
            if (currentSelectedUser && newMessage.senderId === currentSelectedUser._id) {
                set({
                    messages: [...get().messages, newMessage],
                });
                return;
            }

            // --- GLOBAL BACKGROUND NOTIFICATIONS ---
            
            // 1. Increment unread counters for the sender
            set((state) => {
                const currentUnread = state.unreadCounts[newMessage.senderId] || 0;
                return {
                    unreadCounts: {
                        ...state.unreadCounts,
                        [newMessage.senderId]: currentUnread + 1
                    }
                };
            });

            // 2. Resolve sender profile details for the banner template
            const senderUser = get().users.find(u => u._id === newMessage.senderId);

            // 3. Trigger Toast safely using standard JavaScript function execution
            toast.custom(
                (t) => React.createElement(NotificationToast, {
                    t,
                    newMessage,
                    senderUser,
                    setSelectedUser: get().setSelectedUser
                }), 
                { position: 'top-right', duration: 4000 }
            );
        });

        // Listen for real-time deletions from the other user
        socket.on("messageDeleted", (updatedMessage) => {
            const currentSelectedUser = get().selectedUser;
            if (!currentSelectedUser) return;
            if (updatedMessage.senderId !== currentSelectedUser._id && updatedMessage.receiverId !== currentSelectedUser._id) return;

            set((state) => ({
                messages: state.messages.map((msg) =>
                    msg._id === updatedMessage._id ? updatedMessage : msg
                ),
            }));
        });

        // Listen for real-time edits from the other user
        socket.on("messageEdited", (updatedMessage) => {
            const currentSelectedUser = get().selectedUser;
            if (!currentSelectedUser) return;
            if (updatedMessage.senderId !== currentSelectedUser._id && updatedMessage.receiverId !== currentSelectedUser._id) return;

            set((state) => ({
                messages: state.messages.map((msg) =>
                    msg._id === updatedMessage._id ? updatedMessage : msg
                ),
            }));
        });
    },

    unsubscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off("newMessage");
        socket.off("messageDeleted");
        socket.off("messageEdited");
    },

    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
        if (selectedUser) {
            // Clear counter values when manual switching target focuses them
            set((state) => ({
                unreadCounts: { ...state.unreadCounts, [selectedUser._id]: 0 }
            }));
        }
    },
}));