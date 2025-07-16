'use client';

import Sidebar from '@/components/Sidebar';
import ChatArea from '@/components/ChatArea';

export default function ChatPage() {
  return (
    <div className="h-screen flex bg-background text-foreground">
      <Sidebar />
      <ChatArea />
    </div>
  );
} 