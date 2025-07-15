'use client';

import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function ChatArea() {
  return (
    <div className="flex-1 flex flex-col">
      <MessageList />
      <MessageInput />
    </div>
  );
} 