import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userAPI, lookupAPI } from '../../API';
export default function CompleteProfile() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [activityLevels, setActivityLevels] = useState([]);
  const [goals, setGoals] = useState([]);

  const [formData, setFormData] = useState({
    gender: '',
    birthDate: '',
    height: '',
    weight: '',
    activityLevelId: 0,
    goalId: 0,
  });

  const navigate = useNavigate();
  const { updateProfile } = useAuth();

  useEffect(() => {
    const fetchLookups = async () => {
      setLoading(true);

      try {
        const [levels, goalsList] = await Promise.allSettled([
          lookupAPI.getActivityLevels(),
          lookupAPI.getGoals(),
        ]);

        if (levels.status === 'fulfilled') {
          setActivityLevels(levels.value || []);
        }

        if (goalsList.status === 'fulfilled') {
          setGoals(goalsList.value || []);
        }
      } catch (err) {
        console.error('Lookup error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLookups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.gender ||
      !formData.birthDate ||
      !formData.height ||
      !formData.weight ||
      !formData.activityLevelId ||
      !formData.goalId
    ) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await userAPI.setupProfile({
        gender: formData.gender,
        birthDate: formData.birthDate,
        height: Number(formData.height),
        weight: Number(formData.weight),
        activityLevelId: formData.activityLevelId,
        goalId: formData.goalId,
      });

      updateProfile({
        gender: formData.gender,
        height: Number(formData.height),
        weight: Number(formData.weight),
      });

      navigate('/app');
    } catch (err) {
      setError(err?.message || 'Failed to save profile');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 border-2 border-gray-700 bg-[#151935] text-white focus:outline-none focus:border-[#CCFF00]';

  const selectBtnClass = (selected) =>
    `p-3 border-2 text-sm cursor-pointer transition-all ${
      selected
        ? 'border-[#CCFF00] bg-[#CCFF00]/10 text-[#CCFF00]'
        : 'border-gray-700 bg-[#151935] text-gray-400 hover:border-gray-500 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="mb-8">
          <div className="text-xs text-[#CCFF00] mb-2">
            STEP {step} OF 3
          </div>

          <h1 className="text-4xl font-black text-white">
            {step === 1 && 'YOUR BODY'}
            {step === 2 && 'ACTIVITY'}
            {step === 3 && 'YOUR GOAL'}
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            {step === 1 && 'Tell us about your physical stats'}
            {step === 2 && 'How active are you?'}
            {step === 3 && 'What do you want to achieve?'}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">

              {/* Gender */}
              <div className="grid grid-cols-2 gap-2">
                {['Male', 'Female'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={selectBtnClass(formData.gender === g)}
                  >
                    {g}
                  </button>
                ))}
              </div>

              {/* Birth Date */}
              <input
                type="date"
                className={inputClass}
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
              />

              {/* Height + Weight */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Height (cm)"
                  className={inputClass}
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                />

                <input
                  type="number"
                  placeholder="Weight (kg)"
                  className={inputClass}
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-2">

              {loading ? (
                <div className="text-gray-400 flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Loading...
                </div>
              ) : (
                (activityLevels.length ? activityLevels : [
                  { id: 1, name: 'Sedentary' },
                  { id: 2, name: 'Light' },
                  { id: 3, name: 'Moderate' },
                  { id: 4, name: 'Active' },
                ]).map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, activityLevelId: level.id })
                    }
                    className={`${selectBtnClass(
                      formData.activityLevelId === level.id
                    )} w-full`}
                  >
                    {level.name}
                  </button>
                ))
              )}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-2">

              {loading ? (
                <div className="text-gray-400 flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Loading...
                </div>
              ) : (
                (goals.length ? goals : [
                  { id: 1, name: 'Lose Weight' },
                  { id: 2, name: 'Gain Muscle' },
                  { id: 3, name: 'Maintain Weight' },
                ]).map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, goalId: goal.id })
                    }
                    className={`${selectBtnClass(
                      formData.goalId === goal.id
                    )} w-full`}
                  >
                    {goal.name}
                  </button>
                ))
              )}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="text-red-400 border border-red-500/40 p-3 text-sm">
              {error}
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex gap-3 pt-2">

            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 border border-gray-600 text-gray-300 py-3"
              >
                BACK
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex-1 bg-[#CCFF00] text-black py-3 flex items-center justify-center gap-2"
              >
                NEXT <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#CCFF00] text-black py-3"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" />
                    SAVING...
                  </span>
                ) : (
                  'START'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}