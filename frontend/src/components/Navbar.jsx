import Button from './ui/Button';

function Navbar({ currentView, selectedProject, onBackToDashboard }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-stone-200">
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 md:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand + Project Breadcrumb */}
        <div className="flex items-center gap-3">
          <div
            onClick={onBackToDashboard}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            title="Go to Projects Dashboard"
          >
            <span className="w-7 h-7 rounded bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:bg-red-700 transition-colors">
              PX
            </span>
            <span className="font-bold text-base sm:text-lg text-stone-900 tracking-tight">
              ProjectXplain
            </span>
          </div>

          {currentView === 'detail' && selectedProject && (
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-stone-300">/</span>
              <span className="font-semibold text-stone-800 bg-stone-100 px-2.5 py-0.5 rounded border border-stone-200 truncate max-w-[240px]">
                {selectedProject.name}
              </span>
            </div>
          )}
        </div>

        {/* Right: Actions & User Info */}
        <div className="flex items-center gap-3">
          {currentView !== 'dashboard' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onBackToDashboard}
              className="text-xs"
            >
              &larr; All Projects
            </Button>
          )}

          <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
            <div className="w-7 h-7 rounded bg-stone-100 border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-700">
              U
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-stone-800 leading-tight">
                Student Developer
              </span>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider">
                CSE Workspace
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
