'use client';

import { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addMessage, setTyping } from '@/lib/slices/chatSlice';
import Image from 'next/image';

export default function MessageInput() {
  const dispatch = useAppDispatch();
  const { chatrooms, activeChatroomId } = useAppSelector(state => state.chat);
  const activeChatroom = chatrooms.find(room => room.id === activeChatroomId);
  const isTyping = activeChatroom?.isTyping || false;
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulated AI responses
  const aiResponses = [
    "I understand your question. Let me help you with that.",
    "That's an interesting point. Here's what I think about it:",
    "Based on what you've shared, I'd recommend considering these aspects:",
    "Great question! This is a topic I can definitely help you explore.",
    "I see what you're getting at. Let me break this down for you:",
    "That's a common question, and I'm happy to provide some insights.",
    "Excellent topic! Here's my perspective on this:",
    "I can help you understand this better. Let me explain:",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() && !selectedImage) return;
    if (!activeChatroomId) return;

    // Add user message
    dispatch(addMessage({
      content: inputValue || 'Shared an image',
      isUser: true,
      image: selectedImage || undefined,
      chatroomId: activeChatroomId || '',
    }));

    // Clear input
    setInputValue('');
    setSelectedImage(null);

    // Show typing indicator
    dispatch(setTyping({ 
      chatroomId: activeChatroomId || '', 
      isTyping: true 
    }));

    // Simulate AI response with delay (1-3 seconds)
    const delay = Math.random() * 2000 + 1000;
    setTimeout(() => {
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      dispatch(addMessage({
        content: randomResponse,
        isUser: false,
        chatroomId: activeChatroomId || '',
      }));
      dispatch(setTyping({ 
        chatroomId: activeChatroomId || '', 
        isTyping: false 
      }));
    }, delay);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-4 sm:p-6 border-t border-[#3a3a3a]">
      <div className="max-w-4xl mx-auto">
        
        {/* Image preview */}
        {selectedImage && (
          <div className="mb-4 relative inline-block">
            <Image
              src={selectedImage}
              alt="Selected image"
              width={150}
              height={150}
              className="rounded-lg object-cover"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-[#2a2a2a] rounded-3xl border border-[#3a3a3a] p-1 flex items-center gap-2">
            <button
              type="button"
              className="p-3 hover:bg-[#3a3a3a] rounded-full transition-colors"
              title="Add to chat"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Gemini"
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-base sm:text-lg py-3"
              disabled={isTyping || !activeChatroomId}
            />

                        <div className="flex items-center gap-1 sm:gap-2 mr-1 sm:mr-2">
              {/* Image upload button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-[#3a3a3a] rounded-full transition-colors"
                title="Upload image"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>

              {/* Voice input button */}
              <button
                type="button"
                className="p-2 hover:bg-[#3a3a3a] rounded-full transition-colors"
                title="Voice input"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>

              {/* Send button */}
              <button
                type="submit"
                disabled={(!inputValue.trim() && !selectedImage) || isTyping || !activeChatroomId}
                className={`p-2 rounded-full transition-colors ${
                  (!inputValue.trim() && !selectedImage) || isTyping || !activeChatroomId
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-blue-400 hover:bg-[#3a3a3a]'
                }`}
                title="Send message"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 