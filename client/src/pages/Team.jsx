import { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import Badge from '../components/ui/Badge';
import { getUsers } from '../services/userService';
import { toast } from 'react-toastify';
import { Users } from 'lucide-react';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Team Members</h1>
        <p className="text-slate-400 text-sm mt-1">{users.length} registered users</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20">
          <Users size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No users found.</p>
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="hidden md:grid grid-cols-12 px-5 py-3 border-b border-slate-700 text-slate-400 text-xs font-medium uppercase tracking-wider">
            <div className="col-span-5">User</div>
            <div className="col-span-4">Email</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-1">Joined</div>
          </div>
          <div className="divide-y divide-slate-700">
            {users.map((u) => (
              <div key={u._id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 hover:bg-slate-700/30 transition-all">
                <div className="md:col-span-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white font-medium">{u.name}</span>
                </div>
                <div className="md:col-span-4 flex items-center">
                  <span className="text-slate-300 text-sm">{u.email}</span>
                </div>
                <div className="md:col-span-2 flex items-center">
                  <Badge status={u.role} />
                </div>
                <div className="md:col-span-1 flex items-center">
                  <span className="text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Team;
