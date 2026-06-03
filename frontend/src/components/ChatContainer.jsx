import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageSkeleton from './skeletons/MessageSkeleton';
import MessageInput from './MessageInput';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';
import { Trash2, Pencil, X, Check } from 'lucide-react'; 

const ChatContainer = () => {
  // 🌟 Cleaned up: Removed subscribeToMessages and unsubscribeToMessages to rely completely on App.jsx
  const { messages, getMessages, isMessagesLoading, selectedUser, deleteMessage, editMessage } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  
  const touchTimer = useRef(null);
  
  // State management for interactions
  const [messageToDelete, setMessageToDelete] = useState(null); 
  const [selectedMobileMessage, setSelectedMobileMessage] = useState(null); 
  const [editingMessageId, setEditingMessageId] = useState(null); 
  const [editText, setEditText] = useState(""); 

  useEffect(() => {
      getMessages(selectedUser._id);
  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, editingMessageId]); 

  // --- Mobile Long Press Handlers ---
  const handleTouchStart = (message) => {
    touchTimer.current = setTimeout(() => {
      setSelectedMobileMessage(message);
      document.getElementById('mobile_action_sheet').showModal();
    }, 600);
  };

  const handleTouchEnd = () => {
    if (touchTimer.current) clearTimeout(touchTimer.current);
  };

  const handleDeleteConfirm = () => {
    if (messageToDelete) {
      deleteMessage(messageToDelete);
      setMessageToDelete(null);
      document.getElementById('delete_modal').close();
    }
  };

  // --- Inline Edit Submission ---
  const handleEditSave = (messageId) => {
    if (!editText.trim()) return;
    editMessage(messageId, editText.trim());
    setEditingMessageId(null);
    setEditText("");
  };

  if (isMessagesLoading) return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput />
    </div>
  );

  return (
    <div className='flex-1 flex flex-col overflow-auto relative'>
      <ChatHeader />
      
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message) => (
          <div
            key={message._id} 
            className={`chat group ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img src={message.senderId === authUser._id ? authUser.profilePic || '/avatar.png'
                  : selectedUser.profilePic || '/avatar.png'
                } 
                alt="profile pic" />
              </div>
            </div>
            
            <div className='chat-header mb-1 flex items-center gap-2 max-w-full overflow-hidden'>
              <time className='text-xs opacity-50 ml-1 whitespace-nowrap'>
                {formatMessageTime(message.createdAt)}
              </time>

              {message.isEdited && !message.isDeleted && (
                <span className="text-[10px] opacity-40 italic select-none whitespace-nowrap">(edited)</span>
              )}
              
              {message.senderId === authUser._id && !message.isDeleted && editingMessageId !== message._id && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={() => {
                      setEditingMessageId(message._id);
                      setEditText(message.text || "");
                    }}
                    className="p-0.5 rounded hover:bg-base-300 text-zinc-400 hover:text-primary transition-colors"
                    title="Edit message"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => {
                      setMessageToDelete(message._id);
                      document.getElementById('delete_modal').showModal();
                    }}
                    className="p-0.5 rounded hover:bg-base-300 text-zinc-400 hover:text-error transition-colors"
                    title="Delete message"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>
            
            <div 
              className={`chat-bubble flex flex-col justify-center transition-all duration-100 
                ${editingMessageId === message._id ? 'bg-base-300 border border-base-content/10 text-base-content max-w-md w-full' : ''}
                ${editingMessageId !== message._id ? 'active:scale-[0.99] md:active:scale-100 select-none' : ''}`}
              onTouchStart={() => message.senderId === authUser._id && !message.isDeleted && editingMessageId !== message._id && handleTouchStart(message)}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchEnd}
            >
              {message.isDeleted ? (
                <span className="text-sm italic opacity-50 flex items-center gap-1 select-none py-1">
                  🚫 Message deleted
                </span>
              ) : editingMessageId === message._id ? (
                <div className="w-full flex flex-col gap-2 p-1">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="textarea textarea-bordered textarea-xs w-full bg-base-100 text-sm focus:outline-none focus:border-primary resize-none text-base-content min-h-[40px]"
                    rows={Math.min(4, editText.split('\n').length || 1)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleEditSave(message._id);
                      }
                    }}
                  />
                  <div className="flex justify-end gap-1.5 text-xs">
                    <button 
                      onClick={() => { setEditingMessageId(null); setEditText(""); }}
                      className="btn btn-xs btn-ghost gap-1 font-medium rounded"
                    >
                      <X size={12} /> Cancel
                    </button>
                    <button 
                      onClick={() => handleEditSave(message._id)}
                      disabled={!editText.trim() || editText.trim() === message.text}
                      className="btn btn-xs btn-primary gap-1 font-medium rounded text-white disabled:bg-base-200"
                    >
                      <Check size={12} /> Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {message.image && (
                    <img src={message.image} alt='Attachment' className='sm:max-w-[200px] rounded-md mb-2 pointer-events-none' />
                  )}
                  {message.text && <p className="select-none break-words whitespace-pre-wrap">{message.text}</p>}
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      
      <MessageInput />

      {/* Mobile Context Bottom Action Sheet Modal */}
      <dialog id="mobile_action_sheet" className="modal modal-bottom sm:hidden">
        <div className="modal-box bg-base-200 p-0 rounded-t-2xl shadow-2xl overflow-hidden">
          <div className="w-12 h-1 bg-zinc-600/30 rounded-full mx-auto my-3" />
          <div className="flex flex-col text-sm border-t border-base-300">
            <button 
              onClick={() => {
                if (selectedMobileMessage) {
                  setEditingMessageId(selectedMobileMessage._id);
                  setEditText(selectedMobileMessage.text || "");
                }
                document.getElementById('mobile_action_sheet').close();
              }}
              className="flex items-center gap-3 px-5 py-4 w-full hover:bg-base-300 text-base-content active:bg-base-300 transition-colors font-medium"
            >
              <Pencil size={18} className="text-primary" /> Edit Message
            </button>
            <button 
              onClick={() => {
                if (selectedMobileMessage) setMessageToDelete(selectedMobileMessage._id);
                document.getElementById('mobile_action_sheet').close();
                document.getElementById('delete_modal').showModal();
              }}
              className="flex items-center gap-3 px-5 py-4 w-full hover:bg-base-300 text-error active:bg-base-300 transition-colors border-t border-base-300 font-medium"
            >
              <Trash2 size={18} /> Delete Message
            </button>
            <form method="dialog" className="border-t border-base-300">
              <button className="py-4 w-full text-center text-zinc-400 font-medium active:bg-base-300 transition-colors">
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Modern Desktop DaisyUI Dialog Modal Overlay */}
      <dialog id="delete_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-sm border border-zinc-700/20 shadow-2xl">
          <h3 className="font-bold text-lg text-error flex items-center gap-2">
            <Trash2 size={20} /> Delete Message?
          </h3>
          <p className="py-4 text-sm opacity-80">
            This will permanently remove the message text and attachments for everyone in this conversation.
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2 w-full justify-end">
              <button onClick={() => setMessageToDelete(null)} className="btn btn-sm btn-ghost rounded-lg">
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleDeleteConfirm}
                className="btn btn-sm btn-error text-white rounded-lg px-4"
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ChatContainer;