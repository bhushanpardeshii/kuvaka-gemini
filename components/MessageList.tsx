'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loadOlderMessages } from '@/lib/slices/chatSlice';
import { Message } from '@/lib/slices/chatSlice';
import { v4 as uuidv4 } from 'uuid';
import MessageItem from './MessageItem';
import MessageSkeleton from './MessageSkeleton';


export default function MessageList() {
  const dispatch = useAppDispatch();
  const { chatrooms, activeChatroomId } = useAppSelector(state => state.chat);
  
  // Get active chatroom data
  const activeChatroom = chatrooms.find(room => room.id === activeChatroomId);
  const messages = activeChatroom?.messages || [];
  const isTyping = activeChatroom?.isTyping || false;
  const hasMoreMessages = activeChatroom?.hasMoreMessages || false;
  const currentPage = activeChatroom?.currentPage || 1;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isTyping]);

  // Generate dummy older messages for infinite scroll
  const generateDummyMessages = (page: number): Message[] => {
    const dummyMessages: Message[] = [];
    const baseTime = Date.now() - (page * 60000 * 10); // 10 minutes apart per page
    
    for (let i = 0; i < 10; i++) {
      dummyMessages.push({
        id: uuidv4(),
        content: `This is a dummy message from page ${page}, message ${i + 1}. This simulates older conversation history.`,
        isUser: i % 2 === 0,
        timestamp: new Date(baseTime - (i * 60000)).toISOString(), // 1 minute apart
      });
    }
    
    return dummyMessages;
  };

  // Handle scroll to load older messages
  const handleScroll = () => {
    if (!messagesContainerRef.current || isLoadingMore || !hasMoreMessages) return;

    const container = messagesContainerRef.current;
    if (container.scrollTop === 0) {
      setIsLoadingMore(true);
      
      // Simulate API delay
      setTimeout(() => {
        const olderMessages = generateDummyMessages(currentPage);
        dispatch(loadOlderMessages({ 
          chatroomId: activeChatroomId || '', 
          messages: olderMessages 
        }));
        setIsLoadingMore(false);
      }, 1000);
    }
  };

  // Generate skeleton messages for initial loading
  const generateSkeletonMessages = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <MessageSkeleton key={index} isUser={index % 2 === 0} />
    ));
  };

  return (
    <div 
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4 sm:p-6"
      onScroll={handleScroll}
    >
      {/* Loading indicator for older messages */}
      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}

      {/* No more messages indicator */}
      {!hasMoreMessages && messages.length > 0 && (
        <div className="text-center py-4">
          <span className="text-muted-foreground text-sm">No more messages</span>
        </div>
      )}

      {/* Initial loading skeletons */}
      {isInitialLoading && (
        <div className="space-y-3 sm:space-y-4">
          {generateSkeletonMessages()}
        </div>
      )}

      {/* Messages */}
      {!isInitialLoading && (
        <div className="space-y-3 sm:space-y-4">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </div>
      )}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex flex-col items-start sm:flex-row sm:items-start sm:gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-1 sm:mb-0">
            <span className="text-xs font-bold text-white">G</span>
          </div>
          <div className="w-full sm:w-auto">
            <div className="bg-card rounded-2xl rounded-bl-sm sm:rounded-bl-sm p-3 sm:p-4 border border-border inline-block">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">Gemini is typing...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isInitialLoading && messages.length === 0 && !isTyping && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">G</span>
            </div>
            <h2 className="text-5xl font-light text-foreground mb-2">Hello, Bhushan</h2>
            <p className="text-lg text-muted-foreground">How can I help you today?</p>
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
} 