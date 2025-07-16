'use client';

import { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addMessage, setTyping } from '@/lib/slices/chatSlice';
import Image from 'next/image';
import { Plus, Image as ImageIcon, Send, X } from 'lucide-react';

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
    <div className="p-4 sm:p-6 border-t border-border">
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
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center hover:bg-destructive/90 transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-card rounded-3xl border border-border p-1 flex items-center gap-2">
            <button
              type="button"
              className="p-3 hover:bg-accent rounded-full transition-colors"
              title="Add to chat"
            >
              <Plus className="w-5 h-5 text-muted-foreground" />
            </button>
            
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Gemini"
              className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground text-base sm:text-lg py-3"
              disabled={isTyping || !activeChatroomId}
            />

            <div className="flex items-center gap-1 sm:gap-2 mr-1 sm:mr-2">

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
                className="p-2 hover:bg-accent rounded-full transition-colors"
                title="Upload image"
              >
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              </button>


              {/* Send button */}
              <button
                type="submit"
                disabled={(!inputValue.trim() && !selectedImage) || isTyping || !activeChatroomId}
                className={`p-2 rounded-full transition-colors ${
                  (!inputValue.trim() && !selectedImage) || isTyping || !activeChatroomId
                    ? 'text-muted-foreground/50 cursor-not-allowed'
                    : 'text-primary hover:bg-accent'
                }`}
                title="Send message"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 