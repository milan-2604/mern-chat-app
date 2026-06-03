import React from 'react';
import toast from 'react-hot-toast';

const NotificationToast = ({ t, newMessage, senderUser, setSelectedUser }) => {
  const senderName = senderUser ? senderUser.fullName : "Someone";
  const senderPic = senderUser?.profilePic || "/avatar.png";

  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-sm w-full bg-base-200 shadow-2xl rounded-xl pointer-events-auto flex ring-1 ring-base-content/10 p-3.5 border-l-4 border-primary cursor-pointer transition-all`}
      onClick={() => {
        if (senderUser) setSelectedUser(senderUser);
        toast.dismiss(t.id);
      }}
    >
      <div className="flex-1 w-0">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <img 
              className="h-10 w-10 rounded-full object-cover border border-base-content/10" 
              src={senderPic} 
              alt="sender profile" 
            />
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-semibold text-base-content truncate">{senderName}</p>
            <p className="mt-0.5 text-xs text-zinc-400 truncate">
              {newMessage.text || "📷 Sent an attachment"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex pl-3 ml-2 border-l border-base-content/10">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Avoid triggering open chat handler on click dismiss
            toast.dismiss(t.id);
          }}
          className="text-xs font-semibold text-zinc-400 hover:text-base-content transition-colors focus:outline-none"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;