import React, { useState } from 'react';
import { Search, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import Button from '../../components/UI/Button';

export default function ManageUsers() {
  const [searchQuery, setSearchQuery] = useState('');

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', plan: 'Premium', joined: '2024-01-15' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', status: 'Active', plan: 'Free', joined: '2024-02-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'Inactive', plan: 'Premium', joined: '2023-11-05' },
    { id: 4, name: 'Emma Wilson', email: 'emma@example.com', status: 'Active', plan: 'Basic', joined: '2024-03-10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-white mb-2">Manage Users</h2>
          <p className="text-gray-600 dark:text-gray-400">View and manage user accounts</p>
        </div>
        <Button>Add New User</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase text-gray-600 dark:text-gray-300">User</th>
                <th className="px-6 py-3 text-left text-xs uppercase text-gray-600 dark:text-gray-300">Email</th>
                <th className="px-6 py-3 text-left text-xs uppercase text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-6 py-3 text-left text-xs uppercase text-gray-600 dark:text-gray-300">Plan</th>
                <th className="px-6 py-3 text-left text-xs uppercase text-gray-600 dark:text-gray-300">Joined</th>
                <th className="px-6 py-3 text-left text-xs uppercase text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4">
                    <p className="text-gray-900 dark:text-white">{user.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        user.status === 'Active'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                          : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900 dark:text-white">{user.plan}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600 dark:text-gray-400">{user.joined}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <Edit className="w-4 h-4 text-blue-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        {user.status === 'Active' ? (
                          <UserX className="w-4 h-4 text-orange-500" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-emerald-500" />
                        )}
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
