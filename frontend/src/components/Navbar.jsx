import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, MessageSquare, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    /* 1. Changed bg-white/80 to bg-base-100/80 and border-neutral-200 to border-base-300 */
    <header className="sticky top-0 z-40 w-full border-b border-base-300 bg-base-100/80 backdrop-blur-md antialiased">
      <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between">
          
          {/* Left Side: Brand Logo */}
          <div className="flex items-center min-w-0">
            <Link 
              to="/" 
              className="flex items-center gap-2.5 group transition-opacity hover:opacity-90"
            >
              {/* 2. Swapped hardcoded dark background for the theme's core primary accent */}
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-content shadow-sm shrink-0">
                <MessageSquare className="w-4 h-4 stroke-[2]" />
              </div>
              {/* 3. Changed text color from text-neutral-950 to text-base-content */}
              <h1 className="text-base font-semibold tracking-tight text-base-content truncate">
                Konnect
              </h1>
            </Link>
          </div>

          {/* Right Side: Responsive Actions Container */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Settings Action */}
            {/* 4. Converted strict hover colors to DaisyUI's 'btn-ghost' behavior */}
            <Link
              to="/settings"
              className="btn btn-ghost btn-sm normal-case inline-flex items-center justify-center gap-2 px-3 text-sm font-medium text-base-content/80 hover:text-base-content"
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
                  className="btn btn-ghost btn-sm normal-case inline-flex items-center justify-center gap-2 px-3 text-sm font-medium text-base-content/80 hover:text-base-content"
                  aria-label="Profile"
                >
                  <User className="w-4 h-4 stroke-[1.75]" />
                  <span className="hidden sm:inline">Profile</span> 
                </Link> 

                {/* Vertical Separator */}
                {/* 5. Changed separator color to match theme border system */}
                <span className="hidden sm:block h-4 w-[1px] bg-base-300 mx-1" />

                {/* Logout Action */}
                {/* 6. Styled using DaisyUI's semantic error/red text button option */}
                <button 
                  onClick={logout}
                  className="btn btn-ghost btn-sm text-error hover:bg-error/10 normal-case inline-flex items-center justify-center gap-2 px-3 text-sm font-medium"
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