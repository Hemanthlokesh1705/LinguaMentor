"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Navbar } from "@/components/Navbar";

function VerifyOtpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/auth/verify-otp", { email, otp });
            router.push("/auth/login");
        } catch (err: any) {
            setError(err.response?.data?.detail || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-2xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Verify Email</CardTitle>
                <CardDescription className="text-center">
                    Enter the OTP sent to {email}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleVerify} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="otp">One-Time Password</Label>
                        <Input
                            id="otp"
                            placeholder="123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="bg-background/50 text-center tracking-widest text-lg"
                        />
                    </div>
                    {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                        {loading ? "Verifying..." : "Verify OTP"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default function VerifyOtpPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center px-4 pt-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md"
                >
                    <Suspense fallback={<div>Loading...</div>}>
                        <VerifyOtpContent />
                    </Suspense>
                </motion.div>
            </div>
        </div>
    );
}
