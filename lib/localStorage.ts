// Simple localStorage utilities for auth and chat data

// Helper to check if we're on the client side
const isClient = typeof window !== 'undefined';

// Auth data
export const saveAuthData = (phone: string, countryCode: string) => {
  if (!isClient) return;
  
  localStorage.setItem('auth', JSON.stringify({
    phone,
    countryCode,
    isAuthenticated: true,
    timestamp: Date.now()
  }));
};

export const getAuthData = () => {
  if (!isClient) return null;
  
  const data = localStorage.getItem('auth');
  return data ? JSON.parse(data) : null;
};

export const clearAuthData = () => {
  if (!isClient) return;
  
  localStorage.removeItem('auth');
};

export const isAuthenticated = () => {
  if (!isClient) return false;
  
  const auth = getAuthData();
  return auth?.isAuthenticated || false;
};

// Chat data
export const saveChatData = (chatrooms: any[]) => {
  if (!isClient) return;
  
  localStorage.setItem('chatData', JSON.stringify({
    chatrooms,
    timestamp: Date.now()
  }));
};

export const getChatData = () => {
  if (!isClient) return null;
  
  const data = localStorage.getItem('chatData');
  return data ? JSON.parse(data) : null;
};

export const clearChatData = () => {
  if (!isClient) return;
  
  localStorage.removeItem('chatData');
}; 