import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    // Fixed: Swapped out min-h-[60vh] for h-full to keep dimensions perfectly constrained
    <div className="w-full flex-1 flex flex-col items-center justify-center p-6 sm:p-12 md:p-16 bg-base-100/50 h-full">
      <div className="max-w-sm sm:max-w-md text-center space-y-4 sm:space-y-6 px-4">
        
        {/* Icon Display */}
        <div className="flex justify-center mb-2 sm:mb-4">
          <div className="relative">
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center
              justify-center animate-bounce"
            >
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Welcome Text Content */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-base-content">
            Welcome to Konnect!
          </h2>
          <p className="text-sm sm:text-base text-base-content/60 max-w-xs sm:max-w-none mx-auto">
            Select a conversation from the sidebar to start chatting
          </p>
        </div>

      </div>
    </div>
  );
};

export default NoChatSelected;