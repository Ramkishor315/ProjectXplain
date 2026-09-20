function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
  };

  const variantStyles = {
    default: 'bg-stone-100 text-stone-700 border border-stone-200',
    grey: 'bg-stone-100 text-stone-700 border border-stone-200',
    red: 'bg-red-50 text-red-700 border border-red-200 font-semibold',
    orange: 'bg-orange-50 text-orange-700 border border-orange-200 font-semibold',
    rust: 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold',
    maroon: 'bg-rose-50 text-rose-900 border border-rose-200 font-semibold',
    soon: 'bg-stone-100 text-stone-600 border border-stone-200 font-bold',
    // HTTP Methods (strictly adhering to Red, Orange, Rust, Maroon, Grey)
    get: 'bg-stone-100 text-stone-800 border border-stone-300 font-mono font-bold tracking-wider',
    post: 'bg-orange-50 text-orange-800 border border-orange-300 font-mono font-bold tracking-wider',
    put: 'bg-amber-100 text-amber-900 border border-amber-300 font-mono font-bold tracking-wider',
    patch: 'bg-rose-50 text-rose-900 border border-rose-200 font-mono font-bold tracking-wider',
    delete: 'bg-red-50 text-red-700 border border-red-200 font-mono font-bold tracking-wider',
    sql: 'bg-stone-100 text-stone-800 border border-stone-300 font-mono font-bold tracking-wider',
    json: 'bg-amber-50 text-amber-900 border border-amber-200 font-mono font-bold tracking-wider',
    internal: 'bg-stone-50 text-stone-700 border border-stone-200 font-mono font-bold tracking-wider',
    other: 'bg-stone-100 text-stone-600 border border-stone-200 font-mono font-bold tracking-wider',
  };

  const chosenVariant = variantStyles[variant.toLowerCase()] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center font-medium rounded uppercase ${
        sizeStyles[size] || sizeStyles.md
      } ${chosenVariant} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
