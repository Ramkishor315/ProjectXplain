function Card({
  children,
  className = '',
  header,
  footer,
  padding = 'p-5 sm:p-6',
  ...props
}) {
  return (
    <div
      className={`bg-white border border-stone-200 rounded-lg shadow-xs ${className}`}
      {...props}
    >
      {header && (
        <div className="px-5 sm:px-6 py-3.5 border-b border-stone-100 flex items-center justify-between gap-4">
          {header}
        </div>
      )}
      <div className={padding}>{children}</div>
      {footer && (
        <div className="px-5 sm:px-6 py-3 bg-stone-50 border-t border-stone-100 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
