function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs rounded',
    md: 'px-3.5 py-2 text-sm rounded-md',
    lg: 'px-4 py-2.5 text-base rounded-md',
  };

  const variantStyles = {
    primary:
      'bg-red-600 hover:bg-red-700 text-white shadow-xs focus:ring-red-500',
    secondary:
      'bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 shadow-xs focus:ring-stone-400',
    danger:
      'bg-white hover:bg-red-50 text-red-600 border border-red-200 focus:ring-red-400',
    'danger-solid':
      'bg-red-600 hover:bg-red-700 text-white shadow-xs focus:ring-red-500',
    ghost:
      'text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:ring-stone-400',
    orange:
      'bg-orange-600 hover:bg-orange-700 text-white shadow-xs focus:ring-orange-500',
    rust:
      'bg-amber-800 hover:bg-amber-900 text-white shadow-xs focus:ring-amber-600',
    neutral:
      'bg-stone-800 hover:bg-stone-900 text-white shadow-xs focus:ring-stone-500',
    maroon:
      'bg-rose-900 hover:bg-rose-950 text-white shadow-xs focus:ring-rose-800',
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
    variantStyles[variant] || variantStyles.primary
  } ${className}`;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
