import { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { getProjects, createProject, updateProject, deleteProject, addMember, removeMember } from '../services/projectService';
import { getUsers } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash2, Users, FolderKanban, UserPlus, X } from 'lucide-react';

const Projects = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const [memberModal, setMemberModal] = useState(null); // project object
  const [selectedUserId, setSelectedUserId] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [p, u] = await Promise.all([getProjects(), isAdmin ? getUsers() : Promise.resolve([])]);
      setProjects(p);
      setAllUsers(u);
    } catch (_) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditProject(null);
    setForm({ name: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (proj) => {
    setEditProject(proj);
    setForm({ name: proj.name, description: proj.description });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description) return toast.error('All fields are required');
    setSaving(true);
    try {
      if (editProject) {
        const updated = await updateProject(editProject._id, form);
        setProjects((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
        toast.success('Project updated');
      } else {
        const created = await createProject(form);
        setProjects((prev) => [created, ...prev]);
        toast.success('Project created');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error saving project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success('Project deleted');
    } catch (_) {
      toast.error('Failed to delete project');
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    try {
      const updated = await addMember(memberModal._id, selectedUserId);
      setProjects((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      setMemberModal(updated);
      setSelectedUserId('');
      toast.success('Member added');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (projectId, userId) => {
    try {
      const updated = await removeMember(projectId, userId);
      setProjects((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      setMemberModal(updated);
      toast.success('Member removed');
    } catch (_) {
      toast.error('Failed to remove member');
    }
  };

  const availableUsers = allUsers.filter(
    (u) => !memberModal?.members?.some((m) => m._id === u._id)
  );

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 text-sm mt-1">{projects.length} total projects</p>
        </div>
        {isAdmin && (
          <Button onClick={openCreate}>
            <Plus size={16} /> New Project
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <FolderKanban size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No projects yet. {isAdmin && 'Create one to get started.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <div key={proj._id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                    <FolderKanban size={20} className="text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold truncate">{proj.name}</h3>
                    <p className="text-slate-400 text-xs truncate">{proj.description}</p>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(proj)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(proj._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10">
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-slate-400" />
                  <span className="text-slate-400 text-xs">{proj.members?.length || 0} members</span>
                  <div className="flex -space-x-2 ml-1">
                    {proj.members?.slice(0, 4).map((m) => (
                      <div key={m._id} title={m.name} className="w-6 h-6 rounded-full bg-indigo-600 border border-slate-800 flex items-center justify-center text-white text-xs font-bold">
                        {m.name?.charAt(0).toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => setMemberModal(proj)}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    <UserPlus size={13} /> Manage
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <Modal title={editProject ? 'Edit Project' : 'Create Project'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <Input id="proj-name" label="Project Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Website Redesign" />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Describe the project..."
                className="w-full px-3 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving} className="flex-1 justify-center">
                {saving ? 'Saving...' : editProject ? 'Update' : 'Create'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1 justify-center">Cancel</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Members Modal */}
      {memberModal && (
        <Modal title={`Manage Members — ${memberModal.name}`} onClose={() => setMemberModal(null)}>
          <div className="space-y-4">
            {/* Add member */}
            <div className="flex gap-2">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a user...</option>
                {availableUsers.map((u) => (
                  <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                ))}
              </select>
              <Button onClick={handleAddMember} size="sm">
                <UserPlus size={15} /> Add
              </Button>
            </div>

            {/* Current members */}
            <div className="space-y-2">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Current Members</p>
              {memberModal.members?.length === 0 ? (
                <p className="text-slate-500 text-sm">No members yet.</p>
              ) : (
                memberModal.members?.map((m) => (
                  <div key={m._id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-700/50">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {m.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm">{m.name}</p>
                        <Badge status={m.role} />
                      </div>
                    </div>
                    <button onClick={() => handleRemoveMember(memberModal._id, m._id)} className="p-1 text-slate-400 hover:text-red-400">
                      <X size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
};

export default Projects;
