"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/lib/api";
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await forgotPassword(email);
            setSubmitted(true);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to send reset email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background overflow-hidden relative">
            {/* Ambient Background */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="glass-card border-white/10 shadow-2xl">
                    <CardHeader className="space-y-2 text-center">
                        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            {submitted ? <CheckCircle2 className="w-6 h-6 text-primary" /> : <Mail className="w-6 h-6 text-primary" />}
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            {submitted ? "Check your email" : "Forgot Password?"}
                        </CardTitle>
                        <CardDescription className="text-base">
                            {submitted
                                ? "We've sent a password reset link to your email."
                                : "Enter your email address to reset your password."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-black/20 border-white/10 focus:border-primary/50 h-11"
                                    />
                                </div>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="text-sm text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-lg"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Link"}
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center">
                                <p className="text-muted-foreground mb-6 text-sm">
                                    Did not receive the email? Check your spam folder or try another email address.
                                </p>
                                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" onClick={() => setSubmitted(false)}>
                                    Try another email
                                </Button>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="justify-center border-t border-white/5 pt-6 mt-2">
                        <Link
                            href="/auth/login"
                            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Link>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
