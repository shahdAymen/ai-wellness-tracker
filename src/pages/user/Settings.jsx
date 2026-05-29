import React from 'react';
import { Link, LogOut, RefreshCw, Shield, User } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authAPI } from '../../services/api';

export default function Settings() {
  const { user, logout, refreshMe } = useAuth();
  const { showToast } = useToast();

  const handleRefresh = async () => {
    try {
      await refreshMe();
      showToast({ type: 'success', title: 'Profile refreshed' });
    } catch (err) {
      showToast({ type: 'error', title: 'Refresh failed', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">Settings</p>
        <h1 className="mt-2 text-3xl font-bold text-app">Account and integrations</h1>
        <p className="mt-2 text-sm text-app-muted">
          Only documented backend settings are active here. Unsupported notification and password
          update controls were removed.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-app">
          <div className="mb-5 flex items-center gap-3">
            <User className="h-6 w-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-app">Profile</h2>
          </div>
          <div className="mb-5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
            Profile fields are read-only right now because the live backend exposes profile setup and
            profile retrieval endpoints, but no profile update endpoint.
          </div>
          <div className="space-y-3">
            <InfoRow label="Name" value={user?.fullName || user?.name || 'Not set'} />
            <InfoRow label="Email" value={user?.email || 'Not set'} />
            <InfoRow label="Gender" value={user?.gender || 'Not set'} />
            <InfoRow label="Birth date" value={user?.birthDate ? new Date(user.birthDate).toLocaleDateString() : 'Not set'} />
            <InfoRow label="Height" value={user?.height ? `${user.height} cm` : 'Not set'} />
            <InfoRow label="Weight" value={user?.weight ? `${user.weight} kg` : 'Not set'} />
            <InfoRow label="Activity level" value={user?.activityLevel || 'Not set'} />
            <InfoRow label="Goal" value={user?.goal || 'Not set'} />
          </div>
          <Button className="mt-5" variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
            Refresh profile
          </Button>
        </Card>

        <Card className="border border-app">
          <div className="mb-5 flex items-center gap-3">
            <Shield className="h-6 w-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-app">Session</h2>
          </div>
          <p className="text-sm text-app-muted">
            Logout revokes the refresh token using the documented auth endpoint, then clears local
            session state.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={() => (window.location.href = authAPI.getGoogleLoginUrl())}>
              <Link className="h-4 w-4" />
              Connect Google
            </Button>
            <Button variant="danger" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-app pb-3">
      <span className="text-sm text-app-muted">{label}</span>
      <span className="text-right text-sm font-semibold text-app">{value}</span>
    </div>
  );
}
