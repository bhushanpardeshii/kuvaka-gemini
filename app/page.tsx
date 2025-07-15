'use client';

import Sidebar from '@/components/Sidebar';
import ChatArea from '@/components/ChatArea';

export default function Home() {
  return (
    <div className="h-screen flex bg-[#1a1a1a] text-white">
      <Sidebar />
      <ChatArea />
    </div>
  );
}
