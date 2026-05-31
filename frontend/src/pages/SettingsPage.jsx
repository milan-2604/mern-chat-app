import React from 'react';
import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    /* 1. Changed fixed h-screen to min-h-screen to fix text overflow & breaking layouts */
    <div className="min-h-screen bg-base-200 container mx-auto px-4 py-24 max-w-5xl antialiased">
      {/* Main card panel matching structural container style */}
      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-md p-6 sm:p-8 space-y-6">
        
        {/* Title Group */}
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-base-content tracking-tight">Theme</h2>
          <p className="text-sm opacity-70">Choose a theme for your chat interface</p>
        </div>

        {/* Responsive Grid System */}
        {/* Adjusted grid breakpoints so text/previews never overflow smaller devices */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 border text-left
                ${theme === t 
                  ? "bg-base-200 border-primary/40 shadow-sm" 
                  : "border-transparent bg-base-200/40 hover:bg-base-200"
                }
              `}
              onClick={() => setTheme(t)}
            >
              {/* Individual Miniature Swatch Previews */}
              <div className="relative h-8 w-full rounded-lg overflow-hidden shadow-inner" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1 bg-base-100">
                  <div className="rounded-sm bg-primary"></div>
                  <div className="rounded-sm bg-secondary"></div>
                  <div className="rounded-sm bg-accent"></div>
                  <div className="rounded-sm bg-neutral"></div>
                </div>
              </div>
              <span className="text-[11px] font-semibold truncate w-full text-center tracking-wide text-base-content/90">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Dynamic Live Preview Section */}
        <div className="space-y-3 pt-4 border-t border-base-300">
          <h3 className="text-lg font-semibold text-base-content tracking-tight">Preview</h3>
          <div className="rounded-xl border border-base-300 overflow-hidden bg-base-200/50 p-4 sm:p-6 flex justify-center">
            <div className="w-full max-w-md">
              
              {/* Mock Chat UI */}
              <div className="bg-base-100 rounded-2xl shadow-md border border-base-300 overflow-hidden">
                {/* Chat Header */}
                <div className="px-4 py-3.5 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-semibold text-xs shadow-sm">
                      J
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-base-content">John Doe</h3>
                      <p className="text-[11px] text-success font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                        Online
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages Panel */}
                <div className="p-4 space-y-4 h-[220px] overflow-y-auto bg-base-100/50">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm border
                          ${message.isSent 
                            ? "bg-primary border-primary text-primary-content" 
                            : "bg-base-100 border-base-300 text-base-content"
                          }
                        `}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p
                          className={`
                            text-[9px] mt-1.5 text-right font-mono
                            ${message.isSent ? "opacity-75" : "opacity-50"}
                          `}
                        >
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input Deck */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10 bg-base-200/50 focus:bg-base-100"
                      placeholder="Type a message..."
                      value="This is a live preview"
                      readOnly
                    />
                    <button className="btn btn-primary h-10 min-h-0 px-3.5 shadow-sm">
                      <Send size={16} />
                    </button>
                  </div>
                </div>

              </div>
              {/* End Mock Chat */}
              
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;