import {
  OverviewIcon,
  RequirementsIcon,
  UserStoriesIcon,
  DatabaseIcon,
  ApiIcon,
  ArchitectureIcon,
  DataFlowIcon,
  ConceptsIcon,
  MentorIcon,
} from './ui/Icons';

function ProjectSidebar({ activeSection, onSelectSection, counts }) {
  const mainDesignItems = [
    {
      id: 'requirements',
      name: 'Requirements',
      icon: <RequirementsIcon className="w-4 h-4 shrink-0" />,
      count: counts?.requirements,
      countColor: 'bg-red-100 text-red-700',
    },
    {
      id: 'user-stories',
      name: 'User Stories / Use Cases',
      icon: <UserStoriesIcon className="w-4 h-4 shrink-0" />,
      count: counts?.userStories,
      countColor: 'bg-orange-100 text-orange-700',
    },
    {
      id: 'database-design',
      name: 'Database Design',
      icon: <DatabaseIcon className="w-4 h-4 shrink-0" />,
      count: counts?.entities,
      countColor: 'bg-stone-200 text-stone-700',
    },
    {
      id: 'api-design',
      name: 'API Design',
      icon: <ApiIcon className="w-4 h-4 shrink-0" />,
      count: counts?.apis,
      countColor: 'bg-amber-100 text-amber-900',
    },
    {
      id: 'architecture',
      name: 'System Architecture',
      icon: <ArchitectureIcon className="w-4 h-4 shrink-0" />,
      count: counts?.components,
      countColor: 'bg-rose-100 text-rose-800',
    },
    {
      id: 'data-flow',
      name: 'Request / Data Flow',
      icon: <DataFlowIcon className="w-4 h-4 shrink-0" />,
      count: counts?.dataFlow,
      countColor: 'bg-stone-200 text-stone-800',
    },
    {
      id: 'cse-concepts',
      name: 'CSE Concepts',
      icon: <ConceptsIcon className="w-4 h-4 shrink-0" />,
      count: counts?.cseConcepts,
      countColor: 'bg-red-100 text-red-700',
    },
    {
      id: 'ai-mentor',
      name: 'AI Mentor',
      icon: <MentorIcon className="w-4 h-4 shrink-0" />,
      count: 'AI',
      countColor: 'bg-red-50 text-red-700 border border-red-200 font-bold',
    },
  ];

  const futureDesignItems = [];

  const renderNavButton = (item) => {
    const isActive = activeSection === item.id;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => onSelectSection(item.id)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs sm:text-sm font-medium transition-colors text-left ${
          isActive
            ? 'bg-red-50 text-red-700 font-semibold border-r-2 border-red-600'
            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <span className={isActive ? 'text-red-600' : 'text-stone-400'}>
            {item.icon}
          </span>
          <span className="truncate">{item.name}</span>
        </div>

        {item.count !== undefined && (
          <span
            className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded shrink-0 ${
              item.countColor || 'bg-stone-100 text-stone-600'
            }`}
          >
            {item.count}
          </span>
        )}

        {item.isPlaceholder && (
          <span className="text-[9px] font-semibold uppercase tracking-wider text-stone-400 border border-stone-200 px-1 py-0.2 rounded bg-stone-50">
            Soon
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-full md:w-60 bg-white border-b md:border-b-0 md:border-r border-stone-200 p-3 sm:p-4 shrink-0 flex flex-col gap-4">
      {/* Group 1: PROJECT */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 pb-1">
          PROJECT
        </span>
        <nav className="flex flex-col gap-0.5">
          {renderNavButton({
            id: 'overview',
            name: 'Overview',
            icon: <OverviewIcon className="w-4 h-4 shrink-0" />,
          })}
        </nav>
      </div>

      {/* Group 2: DESIGN (Active Features) */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 pb-1">
          DESIGN & MENTOR
        </span>
        <nav className="flex flex-col gap-0.5">
          {mainDesignItems.map(renderNavButton)}
        </nav>
      </div>

      {/* Group 3: FUTURE DESIGN (if any) */}
      {futureDesignItems.length > 0 && (
        <>
          <hr className="border-t border-stone-200 my-1 mx-2" />
          <div className="flex flex-col gap-1">
            <nav className="flex flex-col gap-0.5">
              {futureDesignItems.map(renderNavButton)}
            </nav>
          </div>
        </>
      )}
    </aside>
  );
}

export default ProjectSidebar;
