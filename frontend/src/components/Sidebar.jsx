import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, X } from "lucide-react"; 

const Sidebar = () => {
  // 1. Destructured lastMessageTimestamps alongside your existing values
  const { 
    getUsers, 
    users, 
    selectedUser, 
    setSelectedUser, 
    isUsersLoading, 
    unreadCounts, 
    lastMessageTimestamps // 🔥 Added tracking reference
  } = useChatStore();
  
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // 🔥 Filter out search matches, then sort by the absolute newest message timestamp!
  const filteredUsers = users
    .filter((user) => {
      const matchesOnline = !showOnlineOnly || onlineUsers.includes(user._id);
      const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesOnline && matchesSearch;
    })
    .sort((a, b) => {
      // 2. Extract timestamps (Default to 0 if no messages have ever been exchanged)
      const timeA = lastMessageTimestamps[a._id] || 0;
      const timeB = lastMessageTimestamps[b._id] || 0;

      // 3. Sort descending (The largest timestamp/newest conversation moves to top)
      if (timeB !== timeA) {
        return timeB - timeA;
      }

      // 4. Secondary Fallback: If neither user has messages, keep online statuses ranked higher
      const isOnlineA = onlineUsers.includes(a._id) ? 1 : 0;
      const isOnlineB = onlineUsers.includes(b._id) ? 1 : 0;
      return isOnlineB - isOnlineA;
    });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className={`h-full border-r border-base-300 flex flex-col transition-all duration-200 
      ${selectedUser ? "hidden md:flex md:w-20 lg:w-72" : "w-full md:w-20 lg:w-72"}`}
    > 
      <div className="border-b border-base-300 w-full p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium block md:hidden lg:block">Contacts</span>
        </div>
        
        <div className="relative block md:hidden lg:block w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="size-4 text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered input-sm w-full pl-9 pr-8 bg-base-200 focus:outline-none focus:border-primary text-sm rounded-lg"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-500 hover:text-base-content transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        
        <div className="flex md:hidden lg:flex items-center gap-2 mt-1">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3 flex-1">
        {filteredUsers.length === 0 ? (
          <div className="text-center text-zinc-500 text-sm py-8 block md:hidden lg:block">
            No contacts found
          </div>
        ) : (
          filteredUsers.map((user) => {
            const unreadCount = unreadCounts[user._id] || 0;

            return (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`
                  w-full p-3 flex items-center gap-3
                  hover:bg-base-300 transition-colors relative
                  ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                `}
              >
                <div className="relative mx-auto md:mx-0">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                    className="size-12 object-cover rounded-full"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                  )}
                  
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 size-4 bg-error text-[10px] text-error-content rounded-full flex items-center justify-center font-bold md:block lg:hidden animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </div>

                <div className="block md:hidden lg:block text-left min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className={`font-medium truncate ${unreadCount > 0 ? "text-base-content font-bold" : ""}`}>
                      {user.fullName}
                    </div>

                    {unreadCount > 0 && (
                      <span className="bg-error text-error-content text-[11px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </div>

                  <div className={`text-sm truncate ${unreadCount > 0 ? "text-primary font-medium" : "text-zinc-400"}`}>
                    {unreadCount > 0 ? "New message..." : onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default Sidebar;