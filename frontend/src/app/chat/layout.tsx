"use client";

import { ChatSidebar } from "@/components/ChatSidebar";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[#07080c] overflow-hidden">
            <ChatSidebar />
            <main className="flex-1 flex flex-col h-full relative min-w-0 bg-[#07080c]">
                {children}
            </main>
        </div>
    );
}
