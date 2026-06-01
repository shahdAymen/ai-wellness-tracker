import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, UserX } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState, ErrorState, PageLoader } from '../../components/UI/StatusStates';
import { useToast } from '../../context/ToastContext';
import { userAPI } from '../../services/api';

export default function ManageUsers() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const value = query.toLowerCase();
    return users.filter((user) =>
      [user.fullName, user.email, user.role].filter(Boolean).some((field) => field.toLowerCase().includes(value))
    );
  }, [query, users]);

  const toggleDeleted = async (user) => {
    setBusyId(user.id);
    try {
      await userAPI.deleteUser(user.id);
      showToast({ type: 'success', title: 'User status updated' });
      await load();
    } catch (err) {
      showToast({ type: 'error', title: 'User update failed', message: err.message });
    } finally {
      setBusyId(null);
    }
  };

  const changeRole = async (user) => {
    const nextRole = user.role === 'Admin' ? 'User' : 'Admin';
    setBusyId(user.id);
    try {
      await userAPI.updateUserRole(user.id, nextRole);
      showToast({ type: 'success', title: `Role changed to ${nextRole}` });
      await load();
    } catch (err) {
      showToast({ type: 'error', title: 'Role update failed', message: err.message });
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <PageLoader label="Loading users..." />;
  if (error) return <ErrorState message={error.message} onRetry={load} />;

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="border-b border-hairline dark:border-hairline-strong pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">Manage Users</h1>
        <p className="mt-1 text-xs text-ink-mute dark:text-ink-mute-2">
          Uses admin user endpoints for listing, role changes, and delete/block toggles.
        </p>
      </div>

      {/* Search Bar */}
      <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute dark:text-ink-mute-2" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search users by name, email, or role..."
            className="w-full rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft py-2.5 pl-11 pr-4 text-sm text-ink dark:text-on-dark focus:border-primary focus:outline-none transition-colors duration-200"
          />
        </div>
      </Card>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        <Card className="overflow-hidden border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-0">
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No users found" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left border-collapse">
                <thead>
                  <tr className="bg-canvas-soft dark:bg-canvas-night-soft border-b border-hairline dark:border-hairline-strong">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">User</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">Email</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">Role</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline dark:divide-hairline-strong">
                  {filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-canvas-soft/50 dark:hover:bg-canvas-night-soft/30 transition-colors duration-150">
                      <td className="px-6 py-4 text-sm font-semibold tracking-tight text-ink dark:text-on-dark">
                        {user.fullName || 'Unnamed user'}
                      </td>
                      <td className="px-6 py-4 text-sm text-ink-mute dark:text-ink-mute-2">{user.email}</td>
                      <td className="px-6 py-4 text-sm font-mono text-ink dark:text-on-dark">{user.role}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          user.isDeleted
                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                            : 'bg-primary/10 text-primary border-primary/20'
                        }`}>
                          {user.isDeleted ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="secondary" onClick={() => changeRole(user)} disabled={busyId === user.id}>
                            <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                            Toggle role
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => toggleDeleted(user)} disabled={busyId === user.id}>
                            <UserX className="h-3.5 w-3.5 mr-1" />
                            {user.isDeleted ? 'Restore' : 'Block'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
