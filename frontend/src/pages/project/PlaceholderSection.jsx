import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';

function PlaceholderSection({ title, subtitle, icon, description }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        subtitle={subtitle}
        badge={<Badge variant="soon">Coming Soon</Badge>}
      />

      <div className="bg-[#fdfcf9] border border-stone-200 border-l-4 border-l-stone-500 rounded-lg p-10 sm:p-14 text-center max-w-2xl mx-auto my-8 flex flex-col items-center justify-center shadow-xs">
        <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 text-stone-700 mb-3">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-stone-900">{title}</h3>
        <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed max-w-md">
          {description ||
            'This architecture section is part of the ProjectXplain learning roadmap and will be released in an upcoming milestone.'}
        </p>
        <div className="mt-5">
          <Badge variant="soon" size="md">
            Under Active Development
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default PlaceholderSection;
