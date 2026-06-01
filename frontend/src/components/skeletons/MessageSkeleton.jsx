const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, idx) => {
        const isMe = idx % 2 !== 0;
        return (
          <div key={idx} className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
            {/* Avatar Placeholder */}
            <div className="chat-image avatar">
              <div className="size-10 rounded-full">
                <div className="skeleton w-full h-full rounded-full" />
              </div>
            </div>

            {/* Header Placeholder - alternating lengths */}
            <div className="chat-header mb-1">
              <div className={`skeleton h-4 ${idx % 3 === 0 ? "w-12" : "w-20"}`} />
            </div>

            {/* Bubble Placeholder - alternating widths/heights for natural text flow */}
            <div className="chat-bubble bg-transparent p-0">
              <div 
                className={`skeleton rounded-2xl
                  ${idx % 3 === 0 ? "h-10 w-[140px]" : idx % 3 === 1 ? "h-16 w-[240px]" : "h-12 w-[180px]"}
                `} 
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageSkeleton;