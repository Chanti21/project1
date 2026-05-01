import { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import { getProjects } from '../services/projectService';
import { getUsers } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash2, CheckSquare, Filter } from 'lucide-react';

const statusOptions = ['Todo', 'In Progress', 'Completed'];

const Tasks = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterProject, setFilterProject] = useState('All');

  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', project: '', assignedTo: '',
    dueDate: '', status: 'Todo',
  });

  // Status-only update for members
  const [statusModal, setStatusModal] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [t, p, u] = await Promise.all([
        getTasks(),
        getProjects(),
        isAdmin ? getUsers() : Promise.resolve([]),
      ]);
      setTasks(t);
      setProjects(p);
      setAllUsers(u);
    } catch (_) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const isOverdue = (task) =>
    task.status !== 'Completed' && new Date(task.dueDate) < new Date();

  const openCreate = () => {
    setEditTask(null);
    setForm({ title: '', description: '', project: '', assignedTo: '', dueDate: '', status: 'Todo' });
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditTask(task);
    setForm({
      title: task.title,
      description: task.description,
      project: task.project?._id || '',
      assignedTo: task.assignedTo?._id || '',
      dueDate: task.dueDate?.slice(0, 10) || '',
      status: task.status,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.project || !form.assignedTo || !form.dueDate) {
      return toast.error('Please fill all fields');
    }
    setSaving(true);
    try {
      if (editTask) {
        const updated = await updateTask(editTask._id, form);
        setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
        toast.success('Task updated');
      } else {
        const created = await createTask(form);
        setTasks((prev) => [created, ...prev]);
        toast.success('Task created');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error saving task');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success('Task deleted');
    } catch (_) {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const updated = await updateTask(statusModal._id, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      setStatusModal(null);
      toast.success('Status updated');
    } catch (_) {
      toast.error('Failed to update status');
    }
  };

  const filtered = tasks.filter((t) => {
    const statusMatch = filterStatus === 'All' || t.status === filterStatus;
    const projectMatch = filterProject === 'All' || t.project?._id === filterProject;
    return statusMatch && projectMatch;
  });

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Tasks</h1>
          <p className="text-slate-400 text-sm mt-1">{filtered.length} tasks</p>
        </div>
        {isAdmin && (
          <Button onClick={openCreate}>
            <Plus size={16} /> New Task
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-slate-800 border border-slate-700 rounded-xl">
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-400" />
          <span className="text-slate-400 text-sm">Filter:</span>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Statuses</option>
          {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Projects</option>
          {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        {(filterStatus !== 'All' || filterProject !== 'All') && (
          <button
            onClick={() => { setFilterStatus('All'); setFilterProject('All'); }}
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <CheckSquare size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No tasks found.</p>
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-slate-700 text-slate-400 text-xs font-medium uppercase tracking-wider">
            <div className="col-span-4">Task</div>
            <div className="col-span-2">Project</div>
            <div className="col-span-2">Assigned To</div>
            <div className="col-span-1">Due Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-700">
            {filtered.map((task) => (
              <div key={task._id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 hover:bg-slate-700/30 transition-all">
                <div className="md:col-span-4">
                  <p className="text-white font-medium text-sm">{task.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{task.description}</p>
                </div>
                <div className="md:col-span-2 flex items-center">
                  <span className="text-slate-300 text-sm">{task.project?.name || '—'}</span>
                </div>
                <div className="md:col-span-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {task.assignedTo?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-300 text-sm truncate">{task.assignedTo?.name}</span>
                </div>
                <div className="md:col-span-1 flex items-center">
                  <span className={`text-xs ${isOverdue(task) ? 'text-red-400' : 'text-slate-400'}`}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="md:col-span-2 flex items-center">
                  <Badge status={isOverdue(task) ? 'Overdue' : task.status} />
                </div>
                <div className="md:col-span-1 flex items-center justify-end gap-1">
                  {isAdmin ? (
                    <>
                      <button onClick={() => openEdit(task)} className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-600">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(task._id)} className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10">
                        <Trash2 size={14} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { setStatusModal(task); setNewStatus(task.status); }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded hover:bg-slate-700"
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create/Edit Task Modal */}
      {showModal && (
        <Modal title={editTask ? 'Edit Task' : 'Create Task'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <Input id="task-title" label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Task title" />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Task description" className="w-full px-3 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Project</label>
              <select value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select project...</option>
                {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Assign To</label>
              <select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select user...</option>
                {allUsers.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
              </select>
            </div>
            <Input id="task-due" label="Due Date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving} className="flex-1 justify-center">{saving ? 'Saving...' : editTask ? 'Update' : 'Create'}</Button>
              <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1 justify-center">Cancel</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Member Status Update Modal */}
      {statusModal && (
        <Modal title="Update Task Status" onClose={() => setStatusModal(null)}>
          <div className="space-y-4">
            <p className="text-slate-300 text-sm">{statusModal.title}</p>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">New Status</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleStatusUpdate} className="flex-1 justify-center">Update</Button>
              <Button variant="ghost" onClick={() => setStatusModal(null)} className="flex-1 justify-center">Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
};

export default Tasks;
