'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  createChatroom, 
  deleteChatroom, 
  setActiveChatroom, 
  initializeWithDummyMessages,
  clearChatroomMessages 
} from '@/lib/slices/chatSlice';
import { toast } from 'sonner';

export default function ChatroomList() {
  const dispatch = useAppDispatch();
  const { chatrooms, activeChatroomId } = useAppSelector(state => state.chat);
  const [isCreating, setIsCreating] = useState(false);
  const [newChatroomName, setNewChatroomName] = useState('');

  const handleCreateChatroom = () => {
    if (isCreating) {
      if (newChatroomName.trim()) {
        dispatch(createChatroom({ name: newChatroomName.trim() }));
        toast.success(`Chatroom "${newChatroomName.trim()}" created successfully!`);
        setNewChatroomName('');
        setIsCreating(false);
      } else {
        toast.error('Please enter a chatroom name');
      }
    } else {
      setIsCreating(true);
    }
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewChatroomName('');
  };

  const handleDeleteChatroom = (chatroomId: string, chatroomName: string) => {
    if (chatrooms.length <= 1) {
      toast.error('Cannot delete the last chatroom');
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete "${chatroomName}"?`);
    if (confirmDelete) {
      dispatch(deleteChatroom(chatroomId));
      toast.success(`Chatroom "${chatroomName}" deleted successfully!`);
    }
  };

  const handleSelectChatroom = (chatroomId: string) => {
    if (chatroomId !== activeChatroomId) {
      dispatch(setActiveChatroom(chatroomId));
      const chatroom = chatrooms.find(room => room.id === chatroomId);
      if (chatroom) {
        toast.info(`Switched to "${chatroom.name}"`);
      }
    }
  };

  const handleLoadSampleChat = (chatroomId: string) => {
    dispatch(initializeWithDummyMessages(chatroomId));
    toast.success('Sample conversation loaded!');
  };

  const handleClearChat = (chatroomId: string, chatroomName: string) => {
    const confirmClear = window.confirm(`Are you sure you want to clear all messages in "${chatroomName}"?`);
    if (confirmClear) {
      dispatch(clearChatroomMessages(chatroomId));
      toast.success(`Messages cleared from "${chatroomName}"`);
    }
  };

  const formatLastActivity = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Chatrooms</h3>
        <button
          onClick={handleCreateChatroom}
          className="p-1 hover:bg-[#3a3a3a] rounded text-gray-400 hover:text-white transition-colors"
          title="Create new chatroom"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Create new chatroom input */}
      {isCreating && (
        <div className="mb-2 p-2 bg-[#3a3a3a] rounded-lg">
          <input
            type="text"
            value={newChatroomName}
            onChange={(e) => setNewChatroomName(e.target.value)}
            placeholder="Enter chatroom name..."
            className="w-full bg-transparent text-white text-sm outline-none mb-2"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateChatroom();
              if (e.key === 'Escape') handleCancelCreate();
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateChatroom}
              className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
            >
              Create
            </button>
            <button
              onClick={handleCancelCreate}
              className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Chatroom list */}
      <div className="space-y-1">
        {chatrooms.map((chatroom) => (
          <div
            key={chatroom.id}
            className={`group relative p-2 rounded-lg cursor-pointer transition-colors ${
              chatroom.id === activeChatroomId 
                ? 'bg-[#4a4a4a] text-white' 
                : 'hover:bg-[#3a3a3a] text-gray-300 hover:text-white'
            }`}
            onClick={() => handleSelectChatroom(chatroom.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{chatroom.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>{chatroom.totalMessages} messages</span>
                  <span>•</span>
                  <span>{formatLastActivity(chatroom.lastActivity)}</span>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadSampleChat(chatroom.id);
                  }}
                  className="p-1 hover:bg-[#5a5a5a] rounded text-gray-400 hover:text-white transition-colors"
                  title="Load sample conversation"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.477 8-10 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.477-8 10-8s10 3.582 10 8z" />
                  </svg>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearChat(chatroom.id, chatroom.name);
                  }}
                  className="p-1 hover:bg-[#5a5a5a] rounded text-gray-400 hover:text-white transition-colors"
                  title="Clear messages"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChatroom(chatroom.id, chatroom.name);
                  }}
                  className="p-1 hover:bg-red-600 rounded text-gray-400 hover:text-white transition-colors"
                  title="Delete chatroom"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {chatrooms.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.477 8-10 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.477-8 10-8s10 3.582 10 8z" />
          </svg>
          <p className="text-sm">No chatrooms yet</p>
          <p className="text-xs">Click + to create your first chatroom</p>
        </div>
      )}
    </div>
  );
} 