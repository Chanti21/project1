import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../services/taskService';
import { getProjects } from '../services/projectService';
import { getTasks } from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import Badge from '../components/ui/Badge';
import {
  CheckSquare, Clock, AlertTriangle, ListTodo,
  FolderKanban, ArrowRight,
} from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className={`bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-start gap-4 hover:border-slate-600 transition-all`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-3xl font-bold text-white mt-0.5">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, todo: 0, overdue: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, t, p] = await Promise.all([
          getStats(),
          getTasks(),
          getProjects(),
        ]);
        setStats(s);
        setRecentTasks(t.slice(0, 5));
        setProjects(p.slice(0, 4));
      } catch (_) {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  const isOverdue = (task) =>
    task.status !== 'Completed' && new Date(task.dueDate) < new Date();

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Tasks" value={stats.total} icon={ListTodo} color="bg-indigo-600" />
        <StatCard label="Completed" value={stats.completed} icon={CheckSquare} color="bg-green-600" />
        <StatCard label="In Progress" value={stats.inProgress} icon={Clock} color="bg-yellow-600" />
        <StatCard label="Overdue" value={stats.overdue} icon={AlertTriangle} color="bg-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Recent Tasks</h2>
            <Link to="/tasks" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {recentTasks.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No tasks yet.</p>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-all">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{task.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {task.project?.name} • Due {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <Badge status={isOverdue(task) ? 'Overdue' : task.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Projects</h2>
            <Link to="/projects" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {projects.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No projects yet.</p>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project._id} className="p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/30 flex items-center justify-center">
                      <FolderKanban size={16} className="text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{project.name}</p>
                      <p className="text-slate-400 text-xs">{project.members?.length || 0} members</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
