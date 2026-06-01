import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 18 }
  }
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-canvas dark:bg-canvas-night text-ink dark:text-on-dark transition-colors duration-300 font-sans">
      {/* Header */}
      <header className="px-6 py-4 border-b border-hairline dark:border-hairline-strong bg-canvas/80 dark:bg-canvas-night/80 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-ink dark:bg-on-dark flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight text-ink dark:text-on-dark">
              Vitality<span className="text-primary font-medium">AI</span>
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
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full mb-6"
            >
              <Zap className="w-3.5 h-3.5 fill-primary" />
              <span className="text-xs font-semibold tracking-wider uppercase">
                AI-Powered Wellness v2.0
              </span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="display-xl md:display-xxl text-ink dark:text-on-dark mb-6 tracking-tighter"
            >
              Shape Your{" "}
              <span className="text-primary font-medium relative inline-block">
                Future Self
                <span className="absolute bottom-1 left-0 w-full h-[3px] bg-primary/20 rounded" />
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg text-ink-mute dark:text-ink-mute-2 mb-8 leading-relaxed max-w-xl"
            >
              The only platform that adapts to your biology. Smart meal plans, reactive workouts,
              and real-time analytics powered by next-gen AI.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                onClick={() => navigate("/register")}
                className="shadow-sm"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate("/admin/login")}
              >
                Admin Access
              </Button>
            </motion.div>
          </motion.div>

          {/* Composited Product UI Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
          >
            <Card className="p-8 shadow-md border border-hairline dark:border-hairline-strong transition-colors duration-300 relative overflow-hidden bg-canvas dark:bg-canvas-night max-w-lg mx-auto">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-primary" />
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-canvas-soft dark:bg-canvas-night-soft border border-hairline dark:border-hairline-strong flex items-center justify-center">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink dark:text-on-dark uppercase tracking-wider">
                      Daily Activity Tracker
                    </h3>
                    <p className="text-xs text-primary font-medium uppercase tracking-wide">
                      84% Complete
                    </p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-hairline dark:bg-hairline-strong" />
                  <span className="w-2 h-2 rounded-full bg-hairline dark:bg-hairline-strong" />
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </div>
              </div>

              <div className="space-y-6">
                <Progress
                  icon={<Utensils className="w-4 h-4 text-primary" />}
                  label="Calories"
                  value="1,450 / 2,100 kcal"
                  percent={69}
                  color="emerald"
                />

                <Progress
                  icon={<Activity className="w-4 h-4 text-primary" />}
                  label="Hydration"
                  value="1.5L / 3.0L"
                  percent={50}
                  color="emerald"
                />

                <Progress
                  icon={<TrendingUp className="w-4 h-4 text-primary" />}
                  label="Cardio"
                  value="44 / 50 mins"
                  percent={88}
                  color="emerald"
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 bg-canvas-soft dark:bg-canvas-night-soft border-y border-hairline dark:border-hairline-strong transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="display-md text-ink dark:text-on-dark mb-4 tracking-tight">
              Everything You Need
            </h2>
            <p className="text-base text-ink-mute dark:text-ink-mute-2 max-w-xl mx-auto">
              Comprehensive wellness tracking powered by artificial intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Utensils className="w-6 h-6 text-primary" />}
              title="Smart Meal Plans"
              description="AI-generated nutrition plans tailored to your goals, preferences, and biology."
            />

            <FeatureCard
              icon={<Activity className="w-6 h-6 text-primary" />}
              title="Reactive Workouts"
              description="Dynamic exercise programs that adapt based on your performance and recovery."
            />

            <FeatureCard
              icon={<TrendingUp className="w-6 h-6 text-primary" />}
              title="Real-Time Analytics"
              description="Track progress with detailed charts, insights, and personalized recommendations."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 bg-canvas dark:bg-canvas-night text-center transition-colors duration-300">
        <div className="max-w-3xl mx-auto border border-hairline dark:border-hairline-strong p-12 rounded-lg bg-canvas-soft dark:bg-canvas-night-soft shadow-sm">
          <h2 className="display-md text-ink dark:text-on-dark mb-4 tracking-tight">Ready to Transform Your Life?</h2>
          <p className="text-base text-ink-mute dark:text-ink-mute-2 mb-8 max-w-lg mx-auto">
            Join thousands of users achieving their wellness goals with AI.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/register")}
            className="shadow-sm"
          >
            Start Your Journey
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 border-t border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night text-center text-ink-mute dark:text-ink-mute-2 transition-colors duration-300">
        <p className="text-sm font-medium">&copy; 2025 VitalityAI. All rights reserved.</p>
      </footer>
    </div>
  );
}

/* Reusable Progress Component */
function Progress({ icon, label, value, percent, color }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-canvas-soft dark:bg-canvas-night-soft border border-hairline dark:border-hairline-strong flex items-center justify-center">
            {icon}
          </div>
          <div>
            <p className="text-xs text-ink-mute dark:text-ink-mute-2 font-medium">
              {label}
            </p>
            <p className="text-xs text-ink dark:text-on-dark font-semibold">{value}</p>
          </div>
        </div>
        <span className="text-xs font-bold text-primary">
          {percent}%
        </span>
      </div>

      <div className="w-full h-1.5 bg-hairline dark:bg-hairline-strong rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.2 }}
          className="h-full rounded-full bg-primary"
        />
      </div>
    </div>
  );
}

/* Reusable FeatureCard Component */
function FeatureCard({ icon, title, description }) {
  return (
    <Card className="hover:border-hairline-strong dark:hover:border-on-dark transition-all duration-300 bg-canvas dark:bg-canvas-night border border-hairline dark:border-hairline-strong">
      <div className="w-12 h-12 rounded-sm bg-canvas-soft dark:bg-canvas-night-soft border border-hairline dark:border-hairline-strong flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-ink dark:text-on-dark mb-2">{title}</h3>
      <p className="text-sm text-ink-mute dark:text-ink-mute-2 leading-relaxed">{description}</p>
    </Card>
  );
}

      