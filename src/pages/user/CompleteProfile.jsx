import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { GeneratePlanModal } from '../../components/Modals/GeneratePlanModal.JSX';

export default function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlight, setHighlight] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Shahd',
    age: 22,
    gender: 'Female',
    height: 165,
    weight: 60,
    goal: 'Gain Muscle',
    calories: 2200,
    activity: 'Moderate',
  });

  // ✅ update + highlight UI
  const handleUpdateProfile = (data) => {
    setProfile((prev) => ({
      ...prev,
      ...data,
    }));

    setHighlight(true);
    setTimeout(() => setHighlight(false), 1200);
  };

  return (
    <div className="min-h-screen bg-[#070B18] text-white p-6">

      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-[#0E1627] rounded-3xl p-8 border border-white/10 flex items-center justify-between">

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#CCFF00] text-black flex items-center justify-center font-bold text-xl">
              {profile.name[0]}
            </div>

            <div>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-gray-400">AI Fitness Profile</p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#CCFF00] text-black px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition"
          >
            <Sparkles size={18} />
            Generate AI Plan
          </button>

        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-4">

          <Card label="Age" value={`${profile.age} years`} highlight={highlight} />
          <Card label="Gender" value={profile.gender} highlight={highlight} />
          <Card label="Height" value={`${profile.height} cm`} highlight={highlight} />

          <Card label="Weight" value={`${profile.weight} kg`} highlight={highlight} />
          <Card label="Goal" value={profile.goal} highlight={highlight} />
          <Card label="Calories" value={`${profile.calories} kcal`} highlight={highlight} />

          <Card label="Activity" value={profile.activity} highlight={highlight} />

        </div>

      </div>

      {/* MODAL */}
      <GeneratePlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={(data) => {
          handleUpdateProfile(data);
          setIsModalOpen(false); 
        }}
      />

    </div>
  );
}

/* CARD */
function Card({ label, value, highlight }) {
  return (
    <div
      className={`border rounded-2xl p-5 transition-all duration-500
      ${highlight
        ? 'bg-[#0B1220] border-[#CCFF00] shadow-lg shadow-[#CCFF00]/20 scale-[1.02]'
        : 'bg-[#0B1220] border-white/10'
      }`}
    >
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-lg font-bold mt-2">{value}</p>
    </div>
  );
}