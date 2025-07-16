'use client';

import { useState } from 'react';
import { Message } from '@/lib/slices/chatSlice';
import Image from 'next/image';
import { Copy, Check } from 'lucide-react';

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const [showCopyButton, setShowCopyButton] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div 
      className={`${message.isUser ? 'flex flex-col items-end' : 'flex flex-col items-start'} sm:flex-row sm:items-start ${message.isUser ? 'sm:flex-row-reverse' : ''} sm:gap-3`}
    
    >
      {/* Avatar - Above message on small screens, beside on larger screens */}
      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-1 sm:mb-0 ${
        message.isUser 
          ? 'bg-secondary text-secondary-foreground' 
          : 'bg-gradient-to-br from-blue-500 to-purple-600'
      }`}>
        <span className="text-xs font-bold">
          {message.isUser ? 'B' : 'G'}
        </span>
      </div>

      {/* Message content */}
      <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} w-full sm:w-auto`}>
        <div className={`relative group inline-block min-w-[60px] max-w-[85%] sm:max-w-md ${
          message.isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-card border border-border'
        } rounded-2xl p-3 ${message.isUser ? 'rounded-br-sm sm:rounded-br-2xl' : 'rounded-bl-sm sm:rounded-bl-2xl'} ${message.isUser ? 'sm:rounded-br-sm' : 'sm:rounded-bl-sm'}`}>
          
          {/* Copy button */}
            <button
              onClick={handleCopy}
              className={`absolute bottom-2 ${message.isUser ? 'left-2' : 'right-2'} 
                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                p-1 rounded hover:bg-accent z-10`}
              title="Copy message"
            >
              {copySuccess ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
        

          {/* Image preview */}
          {message.image && (
            <div className="mb-3">
              <Image
                src={message.image}
                alt="Uploaded image"
                width={250}
                height={200}
                className="rounded-lg max-w-full h-auto"
              />
            </div>
          )}

          {/* Message text */}
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </p>

          {/* Timestamp */}
          <div className={`text-xs opacity-70 mt-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
} 