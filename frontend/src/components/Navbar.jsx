import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, MessageSquare, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-md antialiased">
      <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between">
          
          {/* Left Side: Brand Logo */}
          <div className="flex items-center min-w-0">
            <Link 
              to="/" 
              className="flex items-center gap-2.5 group transition-opacity hover:opacity-90"
            >
              <div className="w-9 h-9 rounded-xl bg-neutral-950 flex items-center justify-center text-white shadow-sm shrink-0">
                <MessageSquare className="w-4 h-4 stroke-[2]" />
              </div>
              <h1 className="text-base font-semibold tracking-tight text-neutral-950 truncate">
                Konnect
              </h1>
            </Link>
          </div>

          {/* Right Side: Responsive Actions Container */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Settings Action */}
            <Link
              to="/settings"
              className="inline-flex items-center justify-center gap-2 px-3 py-2.5 sm:py-2 text-sm font-medium text-neutral-600 rounded-lg transition-all active:scale-[0.98] hover:bg-neutral-100 hover:text-neutral-900"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4 stroke-[1.75]" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {/* Conditional Authentication Menu */}
            {authUser && (
              <>
                {/* Profile Action */}
                <Link 
                  to="/profile"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2.5 sm:py-2 text-sm font-medium text-neutral-600 rounded-lg transition-all active:scale-[0.98] hover:bg-neutral-100 hover:text-neutral-900"
                  aria-label="Profile"
                >
                  <User className="w-4 h-4 stroke-[1.75]" />
                  <span className="hidden sm:inline">Profile</span> 
                </Link> 

                {/* Vertical Separator — only shows up on desktop sizes */}
                <span className="hidden sm:block h-4 w-[1px] bg-neutral-200 mx-1" />

                {/* Logout Action */}
                <button 
                  onClick={logout}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2.5 sm:py-2 text-sm font-medium text-red-600 rounded-lg transition-all active:scale-[0.98] hover:bg-red-50 hover:text-red-700"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4 stroke-[1.75]" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
            
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;