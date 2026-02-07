"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Loader2, Check, ArrowLeft } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Password Validation Logic
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasLength = password.length >= 8;

    const isPasswordValid = hasUpperCase && hasLowerCase && hasNumber && hasSymbol && hasLength;
    const passwordsMatch = password === confirmPassword && password !== "";

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isPasswordValid) {
            setError("Please meet all password requirements.");
            return;
        }

        if (!passwordsMatch) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await api.post("/auth/signup", { username, email, password });
            router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Signup failed. Please try again.");
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
                        <h2 className="text-3xl font-bold tracking-tight text-white">Your personal coach is ready.</h2>
                        <p className="text-muted-foreground text-lg">
                            "I&apos;m here to help you practice, not to judge. Let&apos;s get started."
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
                            <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
                            <p className="text-muted-foreground">Start your journey to fluency today.</p>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullname">Full Name</Label>
                                    <Input
                                        id="fullname"
                                        placeholder="Jane Doe"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="bg-white/5 border-white/10 focus:border-primary/50"
                                    />
                                </div>
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
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-white/5 border-white/10 focus:border-primary/50"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Strong passwords protect your conversations.</p>

                                    {/* Password Strength Checklist */}
                                    <div className="grid grid-cols-2 gap-2 mt-3 p-3 bg-white/5 rounded-md border border-white/5">
                                        <Requirement label="8+ chars" met={hasLength} />
                                        <Requirement label="Uppercase" met={hasUpperCase} />
                                        <Requirement label="Lowercase" met={hasLowerCase} />
                                        <Requirement label="Number" met={hasNumber} />
                                        <Requirement label="Symbol" met={hasSymbol} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`bg-white/5 border-white/10 focus:border-primary/50 ${confirmPassword && !passwordsMatch ? 'border-red-500/50' : ''}`}
                                    />
                                    {confirmPassword && !passwordsMatch && (
                                        <p className="text-xs text-red-400">Passwords do not match</p>
                                    )}
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
                                disabled={loading || !isPasswordValid || !passwordsMatch}
                            >
                                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Create Account"}
                            </Button>
                        </form>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-primary hover:underline font-medium">
                                Log in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Requirement({ label, met }: { label: string, met: boolean }) {
    return (
        <div className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${met ? "text-emerald-400" : "text-muted-foreground/60"}`}>
            {met ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current opacity-40"></div>}
            <span>{label}</span>
        </div>
    )
}
