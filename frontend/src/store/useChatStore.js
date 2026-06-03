
import {create} from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import {useAuthStore} from './useAuthStore';

export const useChatStore = create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    isSending: false,

    getUsers: async ()=>{
        set({isUsersLoading:true});
        try {
           const res = await axiosInstance.get('/messages/users');
           set({users:res.data});
        } catch (error) {
           toast.error(error.response.data.message);
        }finally{
            set({isUsersLoading:false});
        }
    },

    getMessages: async (userId)=>{
        set({isMessagesLoading:true});
        try {
           const res = await axiosInstance.get(`/messages/${userId}`);
           set({messages:res.data});
        } catch (error) {
           toast.error(error.response.data.message);
        }finally{
            set({isMessagesLoading:false});
        }
    },

    sendMessage: async (messageData)=>{
        const {selectedUser,messages} = get();
        set({ isSending: true });
        try {
           const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
           set({messages:[...messages,res.data]});
        } catch (error) {
           toast.error(error.response.data.message);
        }finally {
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

    // 1. New Edit Message Action
    editMessage: async (messageId, newText) => {
        try {
            const res = await axiosInstance.put(`/messages/edit/${messageId}`, { text: newText });
            
            // Instantly update the message locally for the sender
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

    subscribeToMessages: ()=>{
        const {selectedUser} = get();
        if(!selectedUser)return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage",(newMessage)=>{
            if(newMessage.senderId !== selectedUser._id)return;
            set({
                messages: [...get().messages,newMessage],
            });
        });

        // Listen for real-time deletions from the other user
        socket.on("messageDeleted", (updatedMessage) => {
            if (updatedMessage.senderId !== selectedUser._id && updatedMessage.receiverId !== selectedUser._id) return;

            set((state) => ({
                messages: state.messages.map((msg) =>
                    msg._id === updatedMessage._id ? updatedMessage : msg
                ),
            }));
        });

        // 2. Listen for real-time edits from the other user
        socket.on("messageEdited", (updatedMessage) => {
            // Security check: ensure message belongs to current conversation thread
            if (updatedMessage.senderId !== selectedUser._id && updatedMessage.receiverId !== selectedUser._id) return;

            set((state) => ({
                messages: state.messages.map((msg) =>
                    msg._id === updatedMessage._id ? updatedMessage : msg
                ),
            }));
        });
    },

    unsubscribeToMessages: ()=>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
        socket.off("messageDeleted");
        socket.off("messageEdited"); // 3. Clean up listener
    },

    setSelectedUser: (selectedUser)=>set({selectedUser}),
}));