

import { X, ArrowLeft } from "lucide-react"; // Imported ArrowLeft icon
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          {/* Fixed: Responsive Navigation Back Arrow Target Container Trigger for Mobile screens */}
          <button 
            onClick={() => setSelectedUser(null)} 
            className="md:hidden p-1 hover:bg-base-200 rounded-full transition-colors text-base-content/70"
          >
            <ArrowLeft className="size-5" />
          </button>

          {/* Avatar frame */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User status labels */}
          <div>
            <h3 className="font-medium text-sm sm:text-base">{selectedUser.fullName}</h3>
            <p className="text-xs sm:text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Fixed: Hide close mark on mobile layouts, show only on desktop frames */}
        <button 
          onClick={() => setSelectedUser(null)}
          className="hidden md:block p-1 hover:bg-base-200 rounded-full transition-colors text-base-content/70"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;