const Badge = ({ status }) => {
  const styles = {
    'Todo': 'bg-slate-700 text-slate-300',
    'In Progress': 'bg-yellow-500/20 text-yellow-400',
    'Completed': 'bg-green-500/20 text-green-400',
    'Overdue': 'bg-red-500/20 text-red-400',
    'Admin': 'bg-indigo-500/20 text-indigo-400',
    'Member': 'bg-slate-600/50 text-slate-300',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-700 text-slate-300'}`}>
      {status}
    </span>
  );
};

export default Badge;
