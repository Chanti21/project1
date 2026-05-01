const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'bg-slate-700 hover:bg-slate-600 text-white',
  outline: 'border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white',
};

const Button = ({
  children, onClick, type = 'button', variant = 'primary',
  disabled = false, className = '', size = 'md', ...rest
}) => {
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm';
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${sizeClass} rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
