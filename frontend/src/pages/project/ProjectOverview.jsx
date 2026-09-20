import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import {
  RequirementsIcon,
  UserStoriesIcon,
  DatabaseIcon,
  ApiIcon,
  ArrowRightIcon,
  ActivityIcon,
  CalendarIcon,
} from '../../components/ui/Icons';

function ProjectOverview({
  project,
  formatDate = (d) => d || 'N/A',
  progressModules = [],
  counts = {},
  onNavigate,
}) {
  if (!project) return null;

  const safeModules = Array.isArray(progressModules) ? progressModules : [];
  const safeFormatDate = typeof formatDate === 'function' ? formatDate : (d) => d || 'N/A';
  const safeCounts = counts || {};

  // Calculate dynamic progress percentage based on roadmap
  const completedCount = safeModules.filter((m) => m.completed).length;
  const progressPercent =
    safeModules.length > 0 ? Math.round((completedCount / safeModules.length) * 100) : 0;

  const statCards = [
    {
      title: 'Requirements',
      count: safeCounts.requirements || 0,
      icon: <RequirementsIcon className="w-5 h-5 text-red-600" />,
      accentColor: 'red',
      section: 'requirements',
      description: 'Functional features & engineering specifications',
    },
    {
      title: 'User Stories',
      count: safeCounts.userStories || 0,
      icon: <UserStoriesIcon className="w-5 h-5 text-orange-600" />,
      accentColor: 'orange',
      section: 'user-stories',
      description: 'Agile use cases & end-user expectations',
    },
    {
      title: 'Database Entities',
      count: safeCounts.entities || 0,
      icon: <DatabaseIcon className="w-5 h-5 text-stone-700" />,
      accentColor: 'grey',
      section: 'database-design',
      description: 'Relational schemas, attributes & foreign keys',
    },
    {
      title: 'API Designs',
      count: safeCounts.apis || 0,
      icon: <ApiIcon className="w-5 h-5 text-amber-800" />,
      accentColor: 'rust',
      section: 'api-design',
      description: 'REST endpoints, HTTP contracts & JSON payloads',
    },
  ];

  return (
    <div className="space-y-6 max-w-full">
      {/* 1. PROJECT HERO */}
      <div className="bg-[#fdfcf9] border border-stone-200 border-l-4 border-l-red-600 rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            PROJECT OVERVIEW
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {project.name}
          </h1>
          <p className="text-sm text-stone-600 max-w-3xl leading-relaxed mt-1 font-sans">
            {project.idea}
          </p>

          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-2.5 mt-3 pt-3 border-t border-stone-200/70 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-stone-200 rounded text-stone-700 font-medium">
              <span className="text-stone-400">Type:</span>
              <span className="font-semibold text-stone-900">Full-Stack Web App</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-stone-200 rounded text-stone-700 font-medium">
              <CalendarIcon className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-stone-400">Created:</span>
              <span className="font-semibold text-stone-900">{safeFormatDate(project.created_at)}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-stone-200 rounded text-stone-700 font-medium">
              <span className="text-stone-400">Team:</span>
              <span className="font-semibold text-stone-900">Solo / Team Project</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded text-red-700 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block"></span>
              <span>Active Development</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROJECT PROGRESS */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between gap-4 mb-2.5">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Project Progress
            </h2>
            <span className="text-xs text-stone-500 font-medium">
              ({completedCount} of {progressModules.length} stages)
            </span>
          </div>
          <span className="text-sm font-extrabold text-red-600 font-mono">
            {progressPercent}% Completed
          </span>
        </div>

        {/* Red Progress Bar */}
        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200/80">
          <div
            className="h-full bg-red-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
          <span className="flex items-center gap-1 text-stone-700 font-medium">
            Next Step <ArrowRightIcon className="w-3.5 h-3.5 text-red-600" />{' '}
            <span className="text-red-700 font-semibold">
              {safeModules.find((m) => !m.completed)?.name || 'All Milestones Complete'}
            </span>
          </span>
          <span className="text-stone-400 text-[11px]">
            {(() => {
              const nextMod = safeModules.find((m) => !m.completed);
              return nextMod ? `Milestone ${nextMod.id} in progress` : '100% Ready';
            })()}
          </span>
        </div>
      </div>

      {/* 3. DESIGN METRICS (4 Dedicated Single-Accent Cards) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700">
            Design Metrics
          </h2>
          <span className="text-xs text-stone-400">
            Click any card to jump to section
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              count={stat.count}
              icon={stat.icon}
              description={stat.description}
              accentColor={stat.accentColor}
              onClick={() => onNavigate(stat.section)}
            />
          ))}
        </div>
      </div>

      {/* 4. PROJECT DETAILS + QUICK ACTIONS */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-5">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 pb-2 border-b border-stone-100">
            Project Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 mt-4 text-xs">
            <div>
              <span className="text-stone-400 font-medium uppercase tracking-wider text-[10px] block">
                Project Name
              </span>
              <p className="text-sm font-bold text-stone-900 mt-0.5">
                {project.name}
              </p>
            </div>

            <div>
              <span className="text-stone-400 font-medium uppercase tracking-wider text-[10px] block">
                Domain
              </span>
              <p className="text-sm font-semibold text-stone-800 mt-0.5">
                Sports / Real-time Application
              </p>
            </div>

            <div>
              <span className="text-stone-400 font-medium uppercase tracking-wider text-[10px] block">
                Technology Stack
              </span>
              <p className="text-sm font-mono text-stone-800 mt-0.5 font-medium">
                React, Node.js, Express, MySQL, Socket.io
              </p>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <span className="text-stone-400 font-medium uppercase tracking-wider text-[10px] block">
                Project Idea & Description
              </span>
              <p className="text-xs sm:text-sm text-stone-700 mt-1 leading-relaxed bg-stone-50 p-3 rounded border border-stone-200/60 font-sans">
                {project.idea}
              </p>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS HORIZONTAL BUTTONS */}
        <div className="pt-4 border-t border-stone-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2.5">
            Quick Actions
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('requirements')}
            >
              View / Edit Requirements
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('user-stories')}
            >
              Manage User Stories
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('database-design')}
            >
              View Database Design
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('api-design')}
            >
              View API Design
            </Button>
          </div>
        </div>
      </div>

      {/* 5. RECENT ACTIVITY (Horizontal Stream) */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <ActivityIcon className="w-4 h-4 text-stone-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-800">
              Recent Activity
            </h2>
          </div>
          <span className="text-[11px] text-stone-400 font-medium">
            System Log
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 bg-[#fdfcf9] border border-stone-200 border-l-2 border-l-red-600 rounded">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 block">
              Requirement Added
            </span>
            <p className="text-xs font-semibold text-stone-900 mt-1 truncate">
              Live Score Broadcast Engine
            </p>
            <span className="text-[10px] text-stone-400 mt-0.5 block">High Priority</span>
          </div>

          <div className="p-3 bg-[#fdfcf9] border border-stone-200 border-l-2 border-l-orange-500 rounded">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 block">
              User Story Updated
            </span>
            <p className="text-xs font-semibold text-stone-900 mt-1 truncate">
              Live Spectator Scoreboard
            </p>
            <span className="text-[10px] text-stone-400 mt-0.5 block">Spectator Role</span>
          </div>

          <div className="p-3 bg-[#fdfcf9] border border-stone-200 border-l-2 border-l-stone-600 rounded">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 block">
              Database Schema Updated
            </span>
            <p className="text-xs font-semibold text-stone-900 mt-1 truncate font-mono">
              matches & players tables
            </p>
            <span className="text-[10px] text-stone-400 mt-0.5 block">ER Constraints Defined</span>
          </div>

          <div className="p-3 bg-[#fdfcf9] border border-stone-200 border-l-2 border-l-amber-800 rounded">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
              API Contract Documented
            </span>
            <p className="text-xs font-semibold text-stone-900 mt-1 truncate font-mono">
              GET /api/matches/:id
            </p>
            <span className="text-[10px] text-stone-400 mt-0.5 block">REST Endpoint</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectOverview;
