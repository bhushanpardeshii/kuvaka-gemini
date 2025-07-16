'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  createChatroom, 
  deleteChatroom, 
  setActiveChatroom, 
  initializeWithDummyMessages,
  clearChatroomMessages 
} from '@/lib/slices/chatSlice';
import { toast } from 'sonner';
import ChatroomSkeleton from './ChatroomSkeleton';
import { Plus, Search, X, MessageCircle, Trash2 } from 'lucide-react';

interface ChatroomListProps {
  onChatroomSelect?: () => void;
}

export default function ChatroomList({ onChatroomSelect }: ChatroomListProps) {
  const dispatch = useAppDispatch();
  const { chatrooms, activeChatroomId } = useAppSelector(state => state.chat);
  const [isCreating, setIsCreating] = useState(false);
  const [newChatroomName, setNewChatroomName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter chatrooms based on search query
  const filteredChatrooms = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return chatrooms;
    }
    
    return chatrooms.filter(chatroom =>
      chatroom.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [chatrooms, debouncedSearchQuery]);

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
    // Close mobile sidebar when chatroom is selected
    onChatroomSelect?.();
  };

  const handleLoadSampleChat = (chatroomId: string) => {
    dispatch(initializeWithDummyMessages(chatroomId));
    toast.success('Sample conversation loaded!');
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

  // Generate skeleton chatrooms
  const generateSkeletonChatrooms = () => {
    return Array.from({ length: 4 }, (_, index) => (
      <ChatroomSkeleton key={index} />
    ));
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Chatrooms</h3>
        <button
          onClick={handleCreateChatroom}
          className="p-1 hover:bg-sidebar-accent rounded text-muted-foreground hover:text-foreground transition-colors"
          title="Create new chatroom"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chatrooms..."
            className="w-full bg-sidebar-accent text-foreground text-sm outline-none rounded-lg px-3 py-2 pr-8 placeholder-muted-foreground"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          {!searchQuery && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              <Search className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>

      {/* Create new chatroom input */}
      {isCreating && (
        <div className="mb-2 p-2 bg-sidebar-accent rounded-lg">
          <input
            type="text"
            value={newChatroomName}
            onChange={(e) => setNewChatroomName(e.target.value)}
            placeholder="Enter chatroom name..."
            className="w-full bg-transparent text-foreground text-sm outline-none mb-2"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateChatroom();
              if (e.key === 'Escape') handleCancelCreate();
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateChatroom}
              className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-colors"
            >
              Create
            </button>
            <button
              onClick={handleCancelCreate}
              className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded hover:bg-secondary/90 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search results info */}
      {debouncedSearchQuery && (
        <div className="mb-2 text-xs text-muted-foreground">
          {filteredChatrooms.length === 0 ? (
            <span>No chatrooms found for "{debouncedSearchQuery}"</span>
          ) : (
            <span>{filteredChatrooms.length} chatroom{filteredChatrooms.length !== 1 ? 's' : ''} found</span>
          )}
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-1">
          {generateSkeletonChatrooms()}
        </div>
      )}

      {/* Chatroom list */}
      {!isLoading && (
        <div className="space-y-1">
          {filteredChatrooms.map((chatroom) => (
            <div
              key={chatroom.id}
              className={`group relative p-2 rounded-lg cursor-pointer transition-colors ${
                chatroom.id === activeChatroomId 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'hover:bg-sidebar-accent text-sidebar-foreground hover:text-foreground'
              }`}
              onClick={() => handleSelectChatroom(chatroom.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{chatroom.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>{chatroom.totalMessages} messages</span>
                    <span>•</span>
                    <span>{formatLastActivity(chatroom.lastActivity)}</span>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center gap-1 ">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoadSampleChat(chatroom.id);
                    }}
                    className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors"
                    title="Load sample conversation"
                  >
                    <MessageCircle className="w-3 h-3" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChatroom(chatroom.id, chatroom.name);
                    }}
                    className="p-1 hover:bg-destructive rounded text-muted-foreground hover:text-destructive-foreground transition-colors"
                    title="Delete chatroom"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && chatrooms.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No chatrooms yet</p>
          <p className="text-xs">Click + to create your first chatroom</p>
        </div>
      )}

      {/* No search results state */}
      {!isLoading && debouncedSearchQuery && filteredChatrooms.length === 0 && chatrooms.length > 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No chatrooms found</p>
          <p className="text-xs">Try a different search term</p>
        </div>
      )}
    </div>
  );
} 