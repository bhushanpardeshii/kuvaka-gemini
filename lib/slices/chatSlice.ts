import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { saveChatData } from '../localStorage';

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string; 
  image?: string;
}

export interface Chatroom {
  id: string;
  name: string;
  messages: Message[];
  lastActivity: string;
  isTyping: boolean;
  currentPage: number;
  hasMoreMessages: boolean;
  totalMessages: number;
}

export interface ChatState {
  chatrooms: Chatroom[];
  activeChatroomId: string | null;
  messagesPerPage: number;
}

const initialState: ChatState = {
  chatrooms: [],
  activeChatroomId: null,
  messagesPerPage: 20,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    createChatroom: (state, action: PayloadAction<{ name?: string }>) => {
      const newChatroom: Chatroom = {
        id: uuidv4(),
        name: action.payload.name || `Chat ${state.chatrooms.length + 1}`,
        messages: [],
        lastActivity: new Date().toISOString(),
        isTyping: false,
        currentPage: 1,
        hasMoreMessages: true,
        totalMessages: 0,
      };
      
      state.chatrooms.push(newChatroom);
      state.activeChatroomId = newChatroom.id;
      
      // Save to localStorage
      saveChatData(state.chatrooms);
    },
    
    deleteChatroom: (state, action: PayloadAction<string>) => {
      const chatroomId = action.payload;
      state.chatrooms = state.chatrooms.filter(room => room.id !== chatroomId);
      
      // If we deleted the active chatroom, select another one or set to null
      if (state.activeChatroomId === chatroomId) {
        state.activeChatroomId = state.chatrooms.length > 0 ? state.chatrooms[0].id : null;
      }
      
      // Save to localStorage
      saveChatData(state.chatrooms);
    },
    
    setActiveChatroom: (state, action: PayloadAction<string>) => {
      state.activeChatroomId = action.payload;
      
      // Save to localStorage
      saveChatData(state.chatrooms);
    },
    
    addMessage: (state, action: PayloadAction<Omit<Message, 'id' | 'timestamp'> & { chatroomId?: string }>) => {
      const chatroomId = action.payload.chatroomId || state.activeChatroomId;
      const chatroom = state.chatrooms.find(room => room.id === chatroomId);
      
      if (chatroom) {
        const newMessage: Message = {
          content: action.payload.content,
          isUser: action.payload.isUser,
          image: action.payload.image,
          id: uuidv4(),
          timestamp: new Date().toISOString(),
        };
        
        chatroom.messages.push(newMessage);
        chatroom.totalMessages = chatroom.messages.length;
        chatroom.lastActivity = new Date().toISOString();
        
        // Save to localStorage
        saveChatData(state.chatrooms);
      }
    },
    
    setTyping: (state, action: PayloadAction<{ chatroomId?: string; isTyping: boolean }>) => {
      const chatroomId = action.payload.chatroomId || state.activeChatroomId;
      const chatroom = state.chatrooms.find(room => room.id === chatroomId);
      
      if (chatroom) {
        chatroom.isTyping = action.payload.isTyping;
        
        // Save to localStorage
        saveChatData(state.chatrooms);
      }
    },
    
    loadOlderMessages: (state, action: PayloadAction<{ chatroomId?: string; messages: Message[] }>) => {
      const chatroomId = action.payload.chatroomId || state.activeChatroomId;
      const chatroom = state.chatrooms.find(room => room.id === chatroomId);
      
      if (chatroom) {
        chatroom.messages = [...action.payload.messages, ...chatroom.messages];
        chatroom.currentPage += 1;
        chatroom.totalMessages = chatroom.messages.length;
        
        // Simulate no more messages after page 5
        if (chatroom.currentPage >= 5) {
          chatroom.hasMoreMessages = false;
        }
        
        // Save to localStorage
        saveChatData(state.chatrooms);
      }
    },
    
    clearChatroomMessages: (state, action: PayloadAction<string>) => {
      const chatroom = state.chatrooms.find(room => room.id === action.payload);
      if (chatroom) {
        chatroom.messages = [];
        chatroom.currentPage = 1;
        chatroom.hasMoreMessages = true;
        chatroom.totalMessages = 0;
        chatroom.lastActivity = new Date().toISOString();
        
        // Save to localStorage
        saveChatData(state.chatrooms);
      }
    },
    
    initializeWithDummyMessages: (state, action: PayloadAction<string>) => {
      const chatroom = state.chatrooms.find(room => room.id === action.payload);
      if (chatroom) {
        const dummyMessages: Message[] = [
          {
            id: uuidv4(),
            content: "Hello! How can I help you today?",
            isUser: false,
            timestamp: new Date(Date.now() - 60000).toISOString(),
          },
          {
            id: uuidv4(),
            content: "Hi there! I'd like to know more about Next.js",
            isUser: true,
            timestamp: new Date(Date.now() - 30000).toISOString(),
          },
          {
            id: uuidv4(),
            content: "Next.js is a React framework that gives you building blocks to create web applications. It provides features like server-side rendering, static site generation, and API routes out of the box.",
            isUser: false,
            timestamp: new Date(Date.now() - 15000).toISOString(),
          },
        ];
        
        chatroom.messages = dummyMessages;
        chatroom.totalMessages = dummyMessages.length;
        chatroom.lastActivity = new Date().toISOString();
        
        // Save to localStorage
        saveChatData(state.chatrooms);
      }
    },
    
    initializeDefaultChatroom: (state) => {
      if (state.chatrooms.length === 0) {
        const defaultChatroom: Chatroom = {
          id: uuidv4(),
          name: "General Chat",
          messages: [],
          lastActivity: new Date().toISOString(),
          isTyping: false,
          currentPage: 1,
          hasMoreMessages: true,
          totalMessages: 0,
        };
        
        state.chatrooms.push(defaultChatroom);
        state.activeChatroomId = defaultChatroom.id;
        
        // Save to localStorage
        saveChatData(state.chatrooms);
      }
    },
    
    // Load chat data from localStorage
    loadChatData: (state, action: PayloadAction<Chatroom[]>) => {
      state.chatrooms = action.payload;
      if (action.payload.length > 0) {
        state.activeChatroomId = action.payload[0].id;
      }
    },
  },
});

export const { 
  createChatroom,
  deleteChatroom,
  setActiveChatroom,
  addMessage, 
  setTyping, 
  loadOlderMessages, 
  clearChatroomMessages, 
  initializeWithDummyMessages,
  initializeDefaultChatroom,
  loadChatData
} = chatSlice.actions;

export default chatSlice.reducer; 