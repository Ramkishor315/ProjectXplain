import { LayersIcon } from './Icons';

function EmptyState({
  icon,
  title = 'No items found',
  message,
  action,
  className = '',
}) {
  return (
    <div
      className={`bg-[#fdfcf9] border border-dashed border-stone-300 rounded-lg p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-6 ${className}`}
    >
      <div className="p-3 bg-stone-100 rounded-lg text-stone-500 mb-3 border border-stone-200">
        {icon || <LayersIcon className="w-6 h-6" />}
      </div>
      <h3 className="text-sm sm:text-base font-bold text-stone-900">{title}</h3>
      {message && (
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-sm leading-relaxed">
          {message}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;
