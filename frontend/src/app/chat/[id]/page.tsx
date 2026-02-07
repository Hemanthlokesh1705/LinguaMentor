"use client";

import { useState, useRef, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Send, Mic, Edit2, RotateCcw, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import "regenerator-runtime/runtime";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
    role: "user" | "system" | "model"; // Backend returns "model" or "user"
    content: string;
    time: string;
    correction?: { // Optional for now, logic to extract this later
        original: string;
        improved: string;
        explanation: string;
    };
};



// Helper to parse the LLM response (Pure function)
const parseResponse = (text: string): { content: string, correction?: Message['correction'] } => {
    let content = text || "";
    let correction = undefined;

    // 1. Extract Correction block (case insensitive, multiline)
    const correctionMatch = content.match(/\[Correction\]([\s\S]*?)\[\/Correction\]/i);

    if (correctionMatch) {
        try {
            let jsonStr = correctionMatch[1].trim();
            // Remove potential markdown code blocks
            jsonStr = jsonStr.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/, "").trim();

            correction = JSON.parse(jsonStr);

            // Remove the ENTIRE correction block from the content
            content = content.replace(correctionMatch[0], "");
        } catch (e) {
            console.error("Failed to parse correction JSON. String was:", correctionMatch[1]);
        }
    }

    // 2. Remove Conversation tags and any specific artifacts
    content = content.replace(/\[\/?Conversation\]/gi, "");

    // Also remove any leading/trailing whitespace after tag removal
    content = content.trim();

    return { content, correction };
};

export default function ChatSessionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [title, setTitle] = useState("Practice Session");

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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

    const handleMicClick = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true });
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [input]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Load Chat History
    useEffect(() => {
        const loadChat = async () => {
            try {
                const res = await api.get(`/chat/${id}`);

                // Parse messages to handle raw content from DB
                const parsedMessages = res.data.messages.map((msg: Message) => {
                    if (msg.role === 'model' || msg.role === 'system') {
                        const { content, correction } = parseResponse(msg.content);
                        return { ...msg, content, correction };
                    }
                    return msg;
                });

                setMessages(parsedMessages);
                setTitle(res.data.title || "Practice Session");
            } catch (error) {
                console.error("Failed to load chat:", error);
            } finally {
                setLoading(false);
            }
        }
        loadChat();
    }, [id]);

    useEffect(() => {
        if (!loading) scrollToBottom();
    }, [messages, loading]);


    // Helper to parse the LLM response
    // parseResponse moved outside


    const handleSend = async () => {
        if (!input.trim() || sending) return;

        const userMsg: Message = { role: "user", content: input, time: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setSending(true);

        try {
            const res = await api.post(`/chat/${id}/send`, { message: userMsg.content });

            const rawReply = res.data.reply;
            const { content, correction } = parseResponse(rawReply);

            const modelMsg: Message = {
                role: "model",
                content: content,
                correction: correction,
                time: new Date().toISOString()
            };
            setMessages(prev => [...prev, modelMsg]);

        } catch (error) {
            console.error("Failed to send message:", error);
            // Revert optimistic update or show error
        } finally {
            setSending(false);
        }
    };


    if (loading) {
        return <div className="flex h-full items-center justify-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading session...</div>
    }

    return (
        <div className="flex flex-col h-full bg-[#07080c]">
            {/* Session Header */}
            <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0b0d17]/50 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <h2 className="text-sm font-medium text-white tracking-wide">{title}</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-white">
                        <RotateCcw className="w-3 h-3 mr-2" /> Restart
                    </Button>
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[60%] flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

                            {/* Avatar (Icon) */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-primary text-white" : "bg-[#1f293a] text-blue-400"}`}>
                                {msg.role === "user" ? "You" : "LM"}
                            </div>

                            {/* Message Bubble */}
                            <div className="flex flex-col gap-2">
                                <div className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.role === "user"
                                    ? "bg-primary text-white rounded-tr-sm"
                                    : "bg-[#13151c] border border-white/5 text-slate-200 rounded-tl-sm whitespace-pre-wrap"
                                    }`}>
                                    <div className="prose prose-sm prose-invert max-w-none break-words dark:prose-invert">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>

                                    {/* Correction Section (Only if parsed/present) */}
                                    {msg.correction && (
                                        <div className="mt-4 pt-3 border-t border-white/10">
                                            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 mb-2 uppercase tracking-wider">
                                                <Edit2 className="w-3 h-3" /> Coach Suggestion
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-muted-foreground line-through opacity-60 text-xs">
                                                        "{msg.correction.original}"
                                                    </span>
                                                    <span className="text-emerald-400 font-medium">
                                                        "{msg.correction.improved}"
                                                    </span>
                                                </div>
                                                <p className="text-slate-400 text-xs leading-relaxed italic border-l-2 border-white/10 pl-3 py-1">
                                                    {msg.correction.explanation}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {sending && (
                    <div className="flex justify-start w-full">
                        <div className="max-w-[60%] flex gap-4 flex-row">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#1f293a] text-blue-400">LM</div>
                            <div className="bg-[#13151c] border border-white/5 px-5 py-3.5 rounded-2xl rounded-tl-sm">
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 sm:p-6 bg-[#07080c] z-20">
                <div className={cn(
                    "max-w-4xl mx-auto relative bg-[#13151c] border rounded-2xl shadow-xl overflow-hidden transition-all",
                    listening ? "border-primary ring-1 ring-primary/20" : "border-white/10 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20"
                )}>
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            if (listening) {
                                resetTranscript();
                                SpeechRecognition.stopListening();
                            }
                        }}
                        placeholder={listening ? "Listening..." : "Say it the way you would in real life..."}
                        className="w-full bg-transparent border-none text-white placeholder:text-muted-foreground/50 text-base px-5 py-4 min-h-[56px] max-h-[200px] resize-none focus:ring-0 focus:outline-none scrollbar-hide"
                        rows={1}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />

                    <div className="flex items-center justify-between px-3 pb-3 pt-2">
                        <div className="flex gap-1">
                            {browserSupportsSpeechRecognition ? (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className={cn("h-8 w-8 rounded-full transition-colors", listening ? "text-red-500 hover:text-red-400 bg-red-500/10" : "text-muted-foreground hover:text-white")}
                                    onClick={handleMicClick}
                                >
                                    <Mic className={cn("w-4 h-4", listening && "animate-pulse")} />
                                </Button>
                            ) : null}
                        </div>
                        <Button
                            size="sm"
                            className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full transition-all disabled:opacity-50"
                            disabled={!input.trim() || sending}
                            onClick={handleSend}
                        >
                            {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Send className="w-3.5 h-3.5 mr-2" /> Send</>}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
