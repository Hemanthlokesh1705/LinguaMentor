"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", response.data.token);
            router.push("/chat");
        } catch (err: any) {
            setError(err.response?.data?.detail || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row text-foreground overflow-hidden">

            {/* --- LEFT COLUMN: AVATAR / MENTOR --- */}
            <div className="hidden md:flex w-1/2 bg-[#0F1115] relative items-center justify-center p-12 border-r border-white/5">
                <div className="max-w-lg w-full space-y-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full aspect-square max-w-[500px] mx-auto"
                    >
                        <Image
                            src="/robo_mentor.png"
                            alt="Your AI English Coach"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </motion.div>
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back.</h2>
                        <p className="text-muted-foreground text-lg">
                            "Ready to continue where we left off?"
                        </p>
                    </div>
                </div>

                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            {/* --- RIGHT COLUMN: FORM --- */}
            <div className="w-full md:w-1/2 flex flex-col relative bg-background">
                <div className="absolute top-6 left-6 z-20">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24 overflow-y-auto">
                    <div className="w-full max-w-sm space-y-8">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
                            <p className="text-muted-foreground">Your conversations stay private.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="jane@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-white/5 border-white/10 focus:border-primary/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-white/5 border-white/10 focus:border-primary/50"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11 font-medium text-base"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Continue"}
                            </Button>
                        </form>

                        <div className="text-center text-sm text-muted-foreground">
                            New here?{" "}
                            <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                                Create an account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
