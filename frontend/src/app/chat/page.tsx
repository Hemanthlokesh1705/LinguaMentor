"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Mic, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

import "regenerator-runtime/runtime";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function NewChatPage() {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const router = useRouter();

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    // Sync transcript with input when listening
    useEffect(() => {
        if (listening) {
            setInput(transcript);
        }
    }, [transcript, listening]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [input]);

    const handleStartChat = async () => {
        if (!input.trim()) return;
        setLoading(true);

        try {
            // 1. Create New Chat
            const newChatRes = await api.post("/chat/new");
            const conversationId = newChatRes.data.conversation_id;

            // 2. Send First Message
            await api.post(`/chat/${conversationId}/send`, { message: input });

            // Notify sidebar to update
            window.dispatchEvent(new Event('chat-updated'));

            // 3. Redirect to the new chat
            router.push(`/chat/${conversationId}`);
        } catch (error) {
            console.error("Failed to start chat:", error);
            // Handle error (show toast etc)
        } finally {
            setLoading(false);
        }
    };

    const handleMicClick = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true });
        }
    };

    return (
        <div className="flex flex-col h-full items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full space-y-8 text-center"
            >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">👋</span>
                </div>

                <h1 className="text-3xl font-semibold text-white tracking-tight">
                    Let&apos;s start a new practice session.
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    This is a safe space to practice. Don&apos;t worry about mistakes—we&apos;ll work through them together.
                </p>

                {/* Input Area */}
                <div className="relative mt-12 max-w-xl mx-auto w-full">
                    <div className={cn(
                        "relative bg-[#13151c] border rounded-2xl shadow-xl overflow-hidden transition-all",
                        listening ? "border-primary ring-1 ring-primary/20" : "border-white/10 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20"
                    )}>
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                if (listening) {
                                    resetTranscript(); // Stop overriding if user types manually
                                    SpeechRecognition.stopListening();
                                }
                            }}
                            placeholder={listening ? "Listening..." : "Type what's on your mind, or introduce yourself..."}
                            className="w-full bg-transparent border-none text-white placeholder:text-muted-foreground/50 text-lg px-5 py-4 min-h-[60px] max-h-[200px] resize-none focus:ring-0 focus:outline-none scrollbar-hide"
                            rows={1}
                            disabled={loading}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleStartChat();
                                }
                            }}
                        />

                        <div className="flex items-center justify-between px-3 pb-3 pt-2">
                            {browserSupportsSpeechRecognition ? (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className={cn("h-9 w-9 rounded-full transition-colors", listening ? "text-red-500 hover:text-red-400 bg-red-500/10" : "text-muted-foreground hover:text-white")}
                                    onClick={handleMicClick}
                                >
                                    <Mic className={cn("w-5 h-5", listening && "animate-pulse")} />
                                </Button>
                            ) : (
                                <div className="w-9" /> // spacer
                            )}

                            <Button
                                size="sm"
                                className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!input.trim() || loading}
                                onClick={handleStartChat}
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Start</>}
                            </Button>
                        </div>
                    </div>
                    <p className="text-xs text-center text-muted-foreground/40 mt-4">
                        Press Enter to send • LinguaMentor AI Coach
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
