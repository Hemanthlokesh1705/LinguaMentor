"use client";

import Link from "next/link";
import { Plus, MessageSquare, Settings, LogOut, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

type Conversation = {
    conversation_id: string;
    title: string;
    updated_at: string;
};

export function ChatSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    const [userProfile, setUserProfile] = useState<{ username: string, plan: string }>({ username: "Learner", plan: "Free Plan" });

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await api.get("/chat/list");
                setConversations(res.data);
            } catch (error) {
                console.error("Failed to fetch conversations:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUserProfile = async () => {
            try {
                const res = await api.get("/auth/me");
                setUserProfile({
                    username: res.data.username || "Learner",
                    plan: res.data.plan || "Free Plan"
                });
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
            }
        };

        fetchConversations();
        fetchUserProfile();

        // Listen for updates from other components
        const handleUpdate = () => fetchConversations();
        window.addEventListener('chat-updated', handleUpdate);

        return () => window.removeEventListener('chat-updated', handleUpdate);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/auth/login");
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm("Are you sure you want to delete this conversation?")) return;

        try {
            await api.delete(`/chat/${id}`);
            setConversations(prev => prev.filter(c => c.conversation_id !== id));
            if (pathname === `/chat/${id}`) {
                router.push("/chat");
            }
        } catch (error) {
            console.error("Failed to delete conversation:", error);
        }
    };

    return (
        <div className="w-64 flex flex-col h-full bg-[#0b0d17] border-r border-white/5 text-slate-300">
            {/* Header / New Chat */}
            {/* ... */}

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
                {/* ... existing list ... */}
                {/* Place existing list rendering logic here unchanged, limiting scope of edit */}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Recent Sessions
                </div>

                {loading ? (
                    <div className="px-4 py-2 text-sm text-muted-foreground animate-pulse">Loading...</div>
                ) : conversations.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-muted-foreground">No sessions yet.</div>
                ) : (
                    conversations.map((chat) => (
                        <Link key={chat.conversation_id} href={`/chat/${chat.conversation_id}`}>
                            <div className={cn(
                                "group flex items-center justify-between gap-2 p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer",
                                pathname === `/chat/${chat.conversation_id}` ? "bg-white/5 text-white" : "text-slate-400"
                            )}>
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <MessageSquare className="w-3.5 h-3.5 opacity-70 group-hover:text-primary transition-colors shrink-0" />
                                    <span className="text-sm font-medium truncate">{chat.title || "Untitled Session"}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                                    onClick={(e) => handleDelete(e, chat.conversation_id)}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* User / Footer */}
            <div className="p-4 border-t border-white/5 space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
                        <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{userProfile.username}</span>
                        <span className="text-xs text-muted-foreground">{userProfile.plan}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-1 pt-2">
                    <Button variant="ghost" size="sm" className="justify-start gap-2 text-xs h-8 text-muted-foreground hover:text-white">
                        <Settings className="w-3.5 h-3.5" /> Settings
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start gap-2 text-xs h-8 text-muted-foreground hover:text-white w-full"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </Button>
                </div>
            </div>
        </div>
    );
}
