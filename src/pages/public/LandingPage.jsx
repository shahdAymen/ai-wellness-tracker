import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Utensils,
  Activity,
  TrendingUp,
  Flame,
  Droplet,
  Check,
  Circle,
  PieChart,
  Brain,
} from "lucide-react";
import { Button } from "../../components/UI/Button";
import { Card } from "../../components/UI/Card";
import { useAuth } from "../../context/AuthContext";



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
  const { isAuthenticated, isAdmin } = useAuth();

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
            {isAuthenticated ? (
              <Button onClick={() => navigate(isAdmin ? "/admin" : "/user")} className="flex items-center gap-1.5 shadow-sm">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/register")}>
                  Get Started
                </Button>
              </>
            )}
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
            className="w-full max-w-2xl mx-auto"
          >
            <HeroWidget />
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

/* Interactive HeroWidget Component */
export function HeroWidget() {
  // Meal tracker check states
  const [meals, setMeals] = useState([
    { id: 1, type: "Breakfast", name: "Avocado Toast", time: "8:30 AM", calories: 450, checked: true },
    { id: 2, type: "Lunch", name: "Salmon Salad", time: "12:45 PM", calories: 550, checked: true },
    { id: 3, type: "Dinner", name: "Grilled Chicken & Veggies", time: "7:00 PM", calories: 600, checked: false }
  ]);

  // Hydration state (in Liters)
  const [hydration, setHydration] = useState(1.5);
  const maxHydration = 3.0;

  // Cardio state (in minutes)
  const [cardio, setCardio] = useState(44);
  const maxCardio = 50;

  // Calculate dynamic calories
  const baseCalories = 450; // Baseline / Snacks
  const checkedCalories = meals
    .filter(m => m.checked)
    .reduce((sum, m) => sum + m.calories, 0);
  const targetCalories = baseCalories + checkedCalories;
  const maxCalories = 2100;

  // Calculate dynamic overall progress
  const caloriePercent = Math.min(targetCalories / maxCalories, 1);
  const hydrationPercent = Math.min(hydration / maxHydration, 1);
  const cardioPercent = Math.min(cardio / maxCardio, 1);
  
  // Custom baseline to match the mockup's 84% starting point
  // Calories (69%) + Hydration (50%) + Cardio (88%) doesn't equal 84%,
  // so we'll model the overall goals progress based on:
  // (Calorie% * 0.4 + Hydration% * 0.3 + Cardio% * 0.3) + a calibration offset
  const rawProgress = (caloriePercent * 0.4 + hydrationPercent * 0.3 + cardioPercent * 0.3) * 100;
  // Offset of +15% aligns 69%, 50%, 88% to exactly 84%
  const targetProgress = Math.min(Math.round(rawProgress + 15), 100);

  // Counter animations
  const [displayProgress, setDisplayProgress] = useState(0);
  const [displayCalories, setDisplayCalories] = useState(0);
  const [displayHydration, setDisplayHydration] = useState(0);
  const [displayCardio, setDisplayCardio] = useState(0);

  useEffect(() => {
    let start = displayProgress;
    const end = targetProgress;
    if (start === end) return;
    const duration = 800; 
    const stepTime = 20; 
    const steps = duration / stepTime;
    const increment = (end - start) / steps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      start += increment;
      setDisplayProgress(Math.round(start));
      if (currentStep >= steps) {
        setDisplayProgress(end);
        clearInterval(timer);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [targetProgress]);

  useEffect(() => {
    let start = displayCalories;
    const end = targetCalories;
    if (start === end) return;
    const duration = 800;
    const stepTime = 15;
    const steps = duration / stepTime;
    const increment = (end - start) / steps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      start += increment;
      setDisplayCalories(Math.round(start));
      if (currentStep >= steps) {
        setDisplayCalories(end);
        clearInterval(timer);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [targetCalories]);

  useEffect(() => {
    let start = displayHydration;
    const end = hydration;
    if (start === end) return;
    const duration = 800;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = (end - start) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      start += increment;
      setDisplayHydration(parseFloat(start.toFixed(1)));
      if (currentStep >= steps) {
        setDisplayHydration(end);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [hydration]);

  useEffect(() => {
    let start = displayCardio;
    const end = cardio;
    if (start === end) return;
    const duration = 800;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = (end - start) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      start += increment;
      setDisplayCardio(Math.round(start));
      if (currentStep >= steps) {
        setDisplayCardio(end);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [cardio]);

  // Toggle meal checklist
  const toggleMeal = (id) => {
    setMeals(prev => prev.map(m => m.id === id ? { ...m, checked: !m.checked } : m));
  };

  // Add water action
  const addWater = () => {
    setHydration(prev => Math.min(parseFloat((prev + 0.5).toFixed(1)), maxHydration));
  };

  // SVG Progress Ring calculations
  const radius = 70;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (targetProgress / 100) * circumference;

  return (
    <div className="w-full bg-canvas-soft dark:bg-canvas-night-soft border border-hairline dark:border-hairline-strong rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row transition-all duration-300">
      
      {/* Left Panel: Daily Activity */}
      <div className="flex-grow md:flex-1 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-hairline dark:border-hairline-strong transition-colors duration-300">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center">
            <PieChart className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold text-ink dark:text-on-dark">Daily Activity</span>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative flex justify-center items-center my-4">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 160 160">
            <defs>
              <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--primary-deep)" />
              </linearGradient>
            </defs>
            {/* Gray Track Ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              className="stroke-hairline dark:stroke-hairline-strong transition-colors duration-300"
              strokeWidth={strokeWidth}
            />
            {/* Active Emerald Ring */}
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="url(#emeraldGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ type: "spring", stiffness: 70, damping: 15, delay: 0.1 }}
              strokeLinecap="round"
            />
          </svg>
          {/* Inner Text */}
          <div className="absolute text-center flex flex-col items-center">
            <motion.span 
              key="goals-percent"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="text-4xl font-extrabold text-ink dark:text-on-dark tracking-tight"
            >
              {displayProgress}%
            </motion.span>
            <span className="text-[11px] text-ink-mute dark:text-ink-mute-2 font-semibold uppercase tracking-wider mt-1">
              {Math.round((displayProgress/100)*2500)} / 2,500
            </span>
            <span className="text-[10px] text-ink-mute dark:text-ink-mute-2 font-medium uppercase tracking-widest">
              Goals
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 mt-6">
          {/* Calories Metric */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 mb-1">
              <Flame className="w-3.5 h-3.5 text-ink-mute dark:text-ink-mute-2" />
              <span className="text-[11px] font-bold text-ink dark:text-on-dark">Calories:</span>
            </div>
            <span className="text-[11px] text-ink-mute dark:text-ink-mute-2 font-medium mb-1.5">{displayCalories} / {maxCalories}</span>
            <div className="w-full h-1.5 bg-hairline dark:bg-hairline-strong rounded-full overflow-hidden transition-colors duration-300">
              <motion.div 
                className="h-full bg-primary rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${(targetCalories / maxCalories) * 100}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.2 }}
              />
            </div>
          </div>

          {/* Hydration Metric */}
          <div 
            onClick={addWater}
            className="flex flex-col items-center cursor-pointer group"
            title="Click to drink 0.5L water"
          >
            <div className="flex items-center gap-1 mb-1 group-hover:scale-105 transition-transform duration-200">
              <Droplet className="w-3.5 h-3.5 text-ink-mute dark:text-ink-mute-2 group-hover:text-primary transition-colors duration-200" />
              <span className="text-[11px] font-bold text-ink dark:text-on-dark group-hover:text-primary transition-colors duration-200">Hydration:</span>
            </div>
            <span className="text-[11px] text-ink-mute dark:text-ink-mute-2 font-medium mb-1.5">{displayHydration}L / {maxHydration}L</span>
            <div className="w-full h-1.5 bg-hairline dark:bg-hairline-strong rounded-full overflow-hidden transition-colors duration-300">
              <motion.div 
                className="h-full bg-primary rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${(hydration / maxHydration) * 100}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.35 }}
              />
            </div>
          </div>

          {/* Cardio Metric */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 mb-1">
              <Activity className="w-3.5 h-3.5 text-ink-mute dark:text-ink-mute-2" />
              <span className="text-[11px] font-bold text-ink dark:text-on-dark">Cardio:</span>
            </div>
            <span className="text-[11px] text-ink-mute dark:text-ink-mute-2 font-medium mb-1.5">{displayCardio} / {maxCardio} mins</span>
            <div className="w-full h-1.5 bg-hairline dark:bg-hairline-strong rounded-full overflow-hidden transition-colors duration-300">
              <motion.div 
                className="h-full bg-primary rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${(cardio / maxCardio) * 100}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: AI Weekly Planner */}
      <div className="flex-grow md:flex-1 p-6 flex flex-col justify-between transition-colors duration-300">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold text-ink dark:text-on-dark">AI Weekly Planner</span>
        </div>

        {/* Timeline Content */}
        <div className="bg-canvas dark:bg-canvas-night border border-hairline dark:border-hairline-strong rounded-lg p-4 flex-grow transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-ink dark:text-on-dark tracking-wide uppercase">Today, October 26</span>
            <span className="text-[10px] bg-primary/20 text-primary font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">AI Optimal</span>
          </div>

          <div className="space-y-4">
            {meals.map(meal => (
              <div 
                key={meal.id}
                onClick={() => toggleMeal(meal.id)}
                className="flex items-start gap-3 cursor-pointer group"
              >
                {/* Custom Checkbox */}
                <div className="mt-0.5 relative flex items-center justify-center">
                  {meal.checked ? (
                    <motion.div 
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                    >
                      <Check className="w-3.5 h-3.5 text-canvas dark:text-canvas-night stroke-[3px]" />
                    </motion.div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-hairline dark:border-hairline-strong group-hover:border-primary transition-colors duration-200 flex items-center justify-center bg-canvas dark:bg-canvas-night" />
                  )}
                </div>

                {/* Meal Text */}
                <div className="flex-grow flex justify-between">
                  <div>
                    <span className={`text-xs font-bold transition-all duration-200 ${meal.checked ? "text-ink-mute dark:text-ink-mute-2 line-through opacity-75" : "text-ink dark:text-on-dark"}`}>
                      {meal.type}:
                    </span>
                    <p className={`text-xs transition-all duration-200 ${meal.checked ? "text-ink-mute dark:text-ink-mute-2 line-through opacity-75" : "text-ink dark:text-on-dark font-medium"}`}>
                      {meal.name}
                    </p>
                  </div>
                  <div className="text-right flex flex-col justify-center">
                    <span className="text-[10px] text-ink-mute dark:text-ink-mute-2 font-medium">{meal.time}</span>
                    <span className="text-[10px] text-ink-mute dark:text-ink-mute-2 font-semibold">{meal.calories} kcal</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestion tip */}
        <p className="text-[11px] text-ink-mute dark:text-ink-mute-2 italic mt-4 text-center">
          * Click items above to toggle completion and dynamically update targets.
        </p>
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

      