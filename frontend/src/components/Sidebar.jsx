import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
    // Fixed: destructuring matches state name 'isUsersLoading'
    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
    const { onlineUsers } = useAuthStore();
    
    useEffect(() => {
        getUsers();
    }, [getUsers]);

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="h-full w-full flex flex-col transition-all duration-200">
            {/* Sidebar Header Container */}
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    {/* Fixed: "Contacts" text is now visible across all mobile layouts */}
                    <span className="font-medium">Contacts</span>
                </div>
                {/* Todo: Online filter toggle */}
            </div>

            {/* Users Display Selection List */}
            <div className='overflow-y-auto w-full py-3'>
                {/* Fallback empty message layout */}
                {users.length === 0 && (
                    <div className="text-center text-zinc-500 py-8 text-sm">
                        No contacts found
                    </div>
                )}

                {users.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`
                        w-full p-3 flex items-center gap-3
                        hover:bg-base-300 transition-colors
                        ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                        `}
                    >
                        {/* Avatar Image Container wrapper */}
                        <div className='relative shrink-0'>
                            <img 
                                src={user.profilePic || "/avatar.png"}
                                alt={user.fullName}
                                className='size-12 object-cover rounded-full' 
                            />
                            {onlineUsers.includes(user._id) && (
                                <span className='absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900' />
                            )}
                        </div>

                        {/* User Metadata Information Container */}
                        {/* Fixed: Replaced 'hidden lg:block' with a clean, fluid spacing layout */}
                        <div className='text-left min-w-0 flex-1'>
                            <div className='font-medium truncate'>
                                {user.fullName}
                            </div>
                            <div className='text-sm text-zinc-400'>
                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </aside>
    )
}

export default Sidebar;