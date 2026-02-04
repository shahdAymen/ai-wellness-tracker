import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  Utensils,
  Activity,
  TrendingUp,
} from "lucide-react";
import { Button } from "../../components/UI/Button";
import { Card } from "../../components/UI/Card";
import { ThemeToggle } from "../../components/UI/ThemeToggle";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              VitalityAI
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/register")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full mb-6 border border-emerald-200 dark:border-emerald-800">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-semibold">
                AI-POWERED WELLNESS V2.0
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Shape Your{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                Future Self
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              The only platform that adapts to your biology. Smart meal plans, reactive workouts,
              and real-time analytics powered by next-gen AI.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/register")}
                className="shadow-xl shadow-emerald-500/20"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate("/admin/login")}
              >
                Admin Access
              </Button>
            </div>
          </div>

          {/* Stats Card */}
          <Card className="p-8 shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Daily Goals
                </h3>
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  84% COMPLETE
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <Progress
                icon={<Utensils className="w-5 h-5 text-orange-500" />}
                label="Calories"
                value="1,450 / 2,100 kcal"
                percent={69}
                color="orange"
              />

              <Progress
                icon={<Activity className="w-5 h-5 text-blue-500" />}
                label="Hydration"
                value="1.5L / 3.0L"
                percent={50}
                color="blue"
              />

              <Progress
                icon={<TrendingUp className="w-5 h-5 text-red-500" />}
                label="Cardio"
                value="44 / 50 mins"
                percent={88}
                color="red"
              />
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Comprehensive wellness tracking powered by artificial intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Utensils className="w-7 h-7 text-white" />}
              title="Smart Meal Plans"
              description="AI-generated nutrition plans tailored to your goals, preferences, and biology"
              gradient="from-emerald-400 to-emerald-600"
            />

            <FeatureCard
              icon={<Activity className="w-7 h-7 text-white" />}
              title="Reactive Workouts"
              description="Dynamic exercise programs that adapt based on your performance and recovery"
              gradient="from-blue-400 to-blue-600"
            />

            <FeatureCard
              icon={<TrendingUp className="w-7 h-7 text-white" />}
              title="Real-Time Analytics"
              description="Track progress with detailed charts, insights, and personalized recommendations"
              gradient="from-purple-400 to-purple-600"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-emerald-500 to-blue-500 text-white transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Life?</h2>
          <p className="text-xl mb-8 text-emerald-50">
            Join thousands of users achieving their wellness goals with AI
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/register")}
            className="bg-sky-400 text-emerald-600 hover:bg-gray-200 shadow-xl"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-gray-600 dark:text-gray-400 bg-white dark:bg-slate-900 transition-colors duration-300">
        <p className="font-medium">&copy; 2025 VitalityAI. All rights reserved.</p>
      </footer>
    </div>
  );
}

/* Reusable Progress Component */
function Progress({ icon, label, value, percent, color }) {
  const colorMap = {
    orange: "from-orange-400 to-orange-500 dark:from-orange-600 dark:to-orange-500",
    blue: "from-blue-400 to-blue-500 dark:from-blue-600 dark:to-blue-500",
    red: "from-red-400 to-red-500 dark:from-red-600 dark:to-red-500",
    emerald: "from-emerald-400 to-emerald-500 dark:from-emerald-600 dark:to-emerald-500",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {label}
            </p>
            <p className="text-gray-900 dark:text-white font-semibold">{value}</p>
          </div>
        </div>
        <span className={`text-sm font-bold text-${color}-600 dark:text-${color}-400`}>
          {percent}%
        </span>
      </div>

      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${colorMap[color]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/* Reusable FeatureCard Component */
function FeatureCard({ icon, title, description, gradient }) {
  return (
    <Card className={`hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700`}>
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    </Card>
  );
}
      