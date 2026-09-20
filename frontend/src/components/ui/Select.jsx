function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  children,
  disabled = false,
  error,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-stone-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3 py-2 text-xs sm:text-sm bg-white border ${
          error
            ? 'border-red-400 focus:ring-red-100'
            : 'border-stone-300 focus:border-red-500 focus:ring-red-100'
        } rounded text-stone-900 focus:outline-none focus:ring-2 disabled:bg-stone-100 disabled:text-stone-500 transition-colors cursor-pointer ${className}`}
        {...props}
      >
        {options.length > 0
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
    </div>
  );
}

export default Select;
