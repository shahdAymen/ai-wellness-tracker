import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Utensils, Activity, TrendingUp } from "lucide-react";

import Button from "../../components/UI/Button";
import { Card } from "../../components/UI/Card";
import { ThemeToggle } from "../../components/UI/ThemeToggle";

import "../../styles/landing.css";


export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-root min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Activity className="w-8 h-8 text-emerald-500" />
          <span className="text-2xl text-gray-900 dark:text-white">VitalityAI</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
          <Button onClick={() => navigate("/register")}>Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-full mb-6">
              <Zap className="w-4 h-4" />
              <span className="text-sm">AI-POWERED WELLNESS V2.0</span>
            </div>

            <h1 className="text-gray-900 dark:text-white mb-6">
              Shape Your <span className="text-emerald-500">Future Self.</span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              The only platform that adapts to your biology.
              Smart meal plans, reactive workouts, and real-time analytics powered by next-gen AI.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => navigate("/register")}>
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate("/admin/login")}>
                Admin Access
              </Button>
            </div>
          </div>

          {/* Right Card */}
          <Card className="p-8">
            {/* Stats content هنا */}
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; 2025 VitalityAI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
