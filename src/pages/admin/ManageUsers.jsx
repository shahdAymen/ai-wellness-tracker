import React, { useEffect, useMemo, useState } from 'react';
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Uses documented admin user endpoints for listing, role changes, and delete/block toggles.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search users by name, email, or role"
          className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>

      <Card className="overflow-hidden p-0">
        {filtered.length === 0 ? (
          <EmptyState title="No users found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500 dark:text-gray-300">User</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500 dark:text-gray-300">Email</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500 dark:text-gray-300">Role</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500 dark:text-gray-300">Status</th>
                  <th className="px-6 py-3 text-right text-xs uppercase text-gray-500 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {filtered.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {user.fullName || 'Unnamed user'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{user.role}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.isDeleted
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {user.isDeleted ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => changeRole(user)} disabled={busyId === user.id}>
                          <ShieldCheck className="h-4 w-4" />
                          Toggle role
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => toggleDeleted(user)} disabled={busyId === user.id}>
                          <UserX className="h-4 w-4" />
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
    </div>
  );
}
