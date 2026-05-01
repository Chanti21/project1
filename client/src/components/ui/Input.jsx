const Input = ({ label, id, error, className = '', ...rest }) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-3 py-2.5 rounded-lg bg-slate-700 border ${
          error ? 'border-red-500' : 'border-slate-600'
        } text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${className}`}
        {...rest}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
};

export default Input;
