"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-white/10"
        >
            <div className="flex items-center space-x-2">
                <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                    LinguaMentor
                </Link>
            </div>
            <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                    <Button variant="ghost" className="hover:bg-primary/20 hover:text-primary transition-colors">
                        Login
                    </Button>
                </Link>
                <Link href="/auth/signup">
                    <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                        Get Started
                    </Button>
                </Link>
            </div>
        </motion.nav>
    );
}
