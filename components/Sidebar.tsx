'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { createChatroom, initializeDefaultChatroom, loadChatData } from '@/lib/slices/chatSlice';
import { toast } from 'sonner';
import ChatroomList from './ChatroomList';
import ThemeToggle from './ThemeToggle';
import { X, Menu, Settings, PenTool, LogOut } from 'lucide-react';
import { getChatData, clearAuthData, getAuthData } from '@/lib/localStorage';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { chatrooms, activeChatroomId } = useAppSelector(state => state.chat);
  const [authData, setAuthData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
    setAuthData(getAuthData());
  }, []);

  // Load chat data from localStorage on mount
  useEffect(() => {
    const savedChatData = getChatData();
    if (savedChatData && savedChatData.chatrooms) {
      dispatch(loadChatData(savedChatData.chatrooms));
    } else {
      dispatch(initializeDefaultChatroom());
    }
  }, [dispatch]);

  const handleNewChat = () => {
    dispatch(createChatroom({}));
    toast.success('New chat created!');
  };

  const handleLogout = () => {
    clearAuthData();
    toast.success('Logged out successfully!');
    router.push('/signup');
  };

  return (
    <div className={`w-64 bg-sidebar border-r border-sidebar-border flex flex-col md:flex md:relative md:translate-x-0 md:z-auto ${isOpen ? 'flex' : 'hidden'} md:block fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* Mobile close button */}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Desktop hamburger menu */}
            <button className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors hidden md:block">
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">G</span>
              </div>
              <h1 className="text-xl font-medium">Gemini</h1>
            </div>
          </div>
          
          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
        
        {/* User info - only render on client */}
        {isClient && authData && (
          <div className="text-sm text-muted-foreground">
            <div>+{authData.countryCode} {authData.phone}</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1 mb-6">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            <PenTool className="w-5 h-5" />
            <span className="text-sm">New chat</span>
          </button>
        </div>

        {/* Chatroom List */}
        <ChatroomList onChatroomSelect={onClose} />
      </div>

      {/* Settings & Logout */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-sidebar-accent rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-sm">Settings & help</span>
        </button>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 text-left hover:bg-sidebar-accent rounded-lg transition-colors text-red-500 hover:text-red-400"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
} 