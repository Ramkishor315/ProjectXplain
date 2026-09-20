import { ArrowRightIcon } from './Icons';

function StatCard({
  title,
  count = 0,
  icon,
  label,
  description,
  accentColor = 'red',
  onClick,
  className = '',
}) {
  const colorThemes = {
    red: {
      number: 'text-red-600',
      iconBox: 'bg-red-50 text-red-600 border-red-100',
      hoverBorder: 'hover:border-red-300',
      link: 'text-red-600',
      topBar: 'bg-red-600',
    },
    orange: {
      number: 'text-orange-600',
      iconBox: 'bg-orange-50 text-orange-600 border-orange-100',
      hoverBorder: 'hover:border-orange-300',
      link: 'text-orange-600',
      topBar: 'bg-orange-600',
    },
    grey: {
      number: 'text-stone-800',
      iconBox: 'bg-stone-100 text-stone-700 border-stone-200',
      hoverBorder: 'hover:border-stone-400',
      link: 'text-stone-700',
      topBar: 'bg-stone-700',
    },
    rust: {
      number: 'text-amber-800',
      iconBox: 'bg-amber-50 text-amber-800 border-amber-200',
      hoverBorder: 'hover:border-amber-400',
      link: 'text-amber-800',
      topBar: 'bg-amber-800',
    },
  };

  const theme = colorThemes[accentColor] || colorThemes.red;

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`bg-white border border-stone-200 rounded-lg p-5 flex flex-col justify-between transition-all duration-150 ${theme.hoverBorder} ${
        onClick ? 'cursor-pointer hover:shadow-xs hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      <div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              {title}
            </p>
            <p className={`text-3xl font-extrabold ${theme.number} mt-1.5 leading-none`}>
              {count}
            </p>
          </div>
          {icon && (
            <div className={`p-2 rounded-md border ${theme.iconBox}`}>
              {icon}
            </div>
          )}
        </div>

        {(description || label) && (
          <p className="text-xs text-stone-500 mt-3 leading-relaxed">
            {description || label}
          </p>
        )}
      </div>

      {onClick && (
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
          <span className="text-stone-400 text-[11px]">Click to view</span>
          <span className={`font-semibold flex items-center gap-1 ${theme.link}`}>
            Explore <ArrowRightIcon className="w-3.5 h-3.5" />
          </span>
        </div>
      )}
    </div>
  );
}

export default StatCard;
