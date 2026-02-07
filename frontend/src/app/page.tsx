"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Terminal, Shield, GitBranch, Cpu, Activity, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent text-foreground font-sans selection:bg-primary/20">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-6 max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/30 border border-white/5 text-xs font-mono text-muted-foreground tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SYSTEM OPERATIONAL
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-white">
            The bridge between <br className="hidden md:block" />
            <span className="text-muted-foreground">knowing</span> English and <span className="text-primary">speaking</span> it.
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed font-light">
            You read documentation perfectly. You write emails without error. <br className="hidden md:block" />
            But in meetings, you freeze. We fix that gap.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/auth/signup">
              <Button className="h-12 px-8 rounded-md bg-primary hover:bg-primary/90 text-white font-medium text-base shadow-sm transition-all hover:translate-y-[-1px]">
                Start Coaching Session
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="ghost" className="h-12 px-8 rounded-md text-muted-foreground hover:text-white font-medium text-base">
                How it works
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* --- DIFFERENTIATION / "NOT A CHATBOT" SECTION --- */}
      <section className="py-24 px-6 border-y border-white/5 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Not another wrapper.</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Most "AI tutors" are just ChatGPT with a prompt. They ramble, they hallucinate, and they don't track your actual progress.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                LinguaMentor is an opinionated coaching engine. It enforces structure, drills your specific weak points, and shuts up when you need to think.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FeatureCard
                icon={<GitBranch className="w-6 h-6 text-blue-400" />}
                title="Structured Flows"
                desc="No aimless chatting. Guided scenarios designed to force output."
              />
              <FeatureCard
                icon={<Activity className="w-6 h-6 text-emerald-400" />}
                title="Active Correction"
                desc="Immediate, ruthless, and private correction of your grammar."
              />
              <FeatureCard
                icon={<Lock className="w-6 h-6 text-orange-400" />}
                title="Local & Private"
                desc="Your voice data helps YOU improve. It doesn't train often-public models."
              />
              <FeatureCard
                icon={<Cpu className="w-6 h-6 text-purple-400" />}
                title="Context Aware"
                desc="It remembers that you struggle with prepositions. It will check them."
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (NO FLUFF) --- */}
      <section id="how-it-works" className="py-32 px-6 bg-gradient-to-b from-transparent to-black/40">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Engineered for fluency.</h2>
            <p className="text-muted-foreground text-lg">A feedback loop that actually works.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <Step
              num="01"
              title="Input"
              text="You speak freely in a simulated high-stakes scenario (e.g., a standup update)."
            />
            <Step
              num="02"
              title="Analysis"
              text="The specific model analyzes syntax, tone, and hesitation markers in real-time."
            />
            <Step
              num="03"
              title="Refinement"
              text="You get the 'patched' version of your sentence instantly. You repeat it. You learn."
            />
          </div>
        </div>
      </section>

      {/* --- MOCK INTERFACE (VISUAL) --- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-[#0F1115] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
            <div className="text-xs text-muted-foreground font-mono ml-2">linguamentor-core — v2.1.0</div>
          </div>
          <div className="p-8 font-mono text-sm md:text-base space-y-6">
            <div className="flex gap-4 opacity-50">
              <span className="text-blue-400 shrink-0">AI:</span>
              <span className="text-muted-foreground">"Explain the bottleneck in the payment service."</span>
            </div>
            <div className="flex gap-4">
              <span className="text-emerald-400 shrink-0">YOU:</span>
              <span className="text-white">"So, the thing is that the database is... it is locking too much."</span>
            </div>
            <div className="pl-12 border-l-2 border-orange-500/30 py-2">
              <div className="flex items-center gap-2 text-orange-400 mb-1">
                <Terminal className="w-4 h-4" />
                <span className="font-bold">Optimization Suggestion</span>
              </div>
              <p className="text-muted-foreground mb-2">"Too vague. 'The thing is' is filler."</p>
              <div className="p-3 bg-white/5 rounded border border-white/5 text-emerald-300">
                "The payment service bottleneck is caused by excessive database locking."
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* --- FOOTER --- */}
      <footer className="py-12 px-6 border-t border-white/5 bg-[#05060a] text-sm text-muted-foreground">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-lg font-bold text-white">LinguaMentor</Link>
            <p className="max-w-xs">Built for engineers, by engineers.</p>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Manifesto</Link>
            <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/auth/login" className="hover:text-white transition-colors">Log In</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ num, title, text }: { num: string, title: string, text: string }) {
  return (
    <div className="border-t border-white/10 pt-6">
      <div className="text-3xl font-mono text-white/10 mb-4">{num}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}
