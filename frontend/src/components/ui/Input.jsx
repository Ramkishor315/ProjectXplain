function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  helperText,
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
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2 text-xs sm:text-sm bg-white border ${
          error
            ? 'border-red-400 focus:ring-red-100'
            : 'border-stone-300 focus:border-red-500 focus:ring-red-100'
        } rounded text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 disabled:bg-stone-100 disabled:text-stone-500 transition-colors ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-stone-500 mt-0.5">{helperText}</p>
      )}
    </div>
  );
}

export default Input;
