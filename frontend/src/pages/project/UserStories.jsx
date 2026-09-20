import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import { FilterIcon, TrashIcon, ArrowRightIcon } from '../../components/ui/Icons';

function UserStories({
  requirements,
  userStoriesMap,
  storyInputMap,
  setStoryInputMap,
  storySavingMap,
  storyErrorMap,
  handleCreateUserStory,
  handleDeleteUserStory,
  onNavigate,
}) {
  const [selectedReqFilter, setSelectedReqFilter] = useState('ALL');
  const [activeAddReqId, setActiveAddReqId] = useState(
    requirements && requirements.length > 0 ? requirements[0].id : ''
  );
  const [showGlobalAddForm, setShowGlobalAddForm] = useState(false);

  // If no requirements exist yet
  if (!requirements || requirements.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="User Stories & Use Cases"
          subtitle="Capture user-centric requirements and real-world system interactions."
        />
        <EmptyState
          title="No requirements found"
          message="User stories must be linked to a project requirement. Create your first requirement to get started."
          action={
            <Button
              variant="primary"
              onClick={() => onNavigate && onNavigate('requirements')}
            >
              Go to Requirements &rarr;
            </Button>
          }
        />
      </div>
    );
  }

  const effectiveReqId = activeAddReqId || requirements[0].id;
  const filteredRequirements =
    selectedReqFilter === 'ALL'
      ? requirements
      : requirements.filter((r) => String(r.id) === String(selectedReqFilter));

  const totalStories = Object.values(userStoriesMap || {}).reduce(
    (acc, list) => acc + (Array.isArray(list) ? list.length : 0),
    0
  );

  const currentStoryError = storyErrorMap && storyErrorMap[effectiveReqId];
  const isSavingStory = Boolean(storySavingMap && storySavingMap[effectiveReqId]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Stories & Use Cases"
        subtitle={`Capture requirements from the perspective of an end user (${totalStories} total stories across ${requirements.length} requirements).`}
        action={
          <Button
            variant={showGlobalAddForm ? 'secondary' : 'orange'}
            onClick={() => setShowGlobalAddForm(!showGlobalAddForm)}
          >
            {showGlobalAddForm ? 'Close Form' : '+ Add User Story'}
          </Button>
        }
      />

      {/* Global Add Story Form - Orange Accent */}
      {showGlobalAddForm && (
        <Card className="border-stone-200 border-l-4 border-l-orange-500 bg-[#fdfcf9]">
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              New User Story
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Formulate user stories using the standard agile format: "As a [role], I want [action] so that [benefit]".
            </p>
          </div>

          {currentStoryError && (
            <div className="p-3 rounded text-xs mb-4 bg-orange-50 text-orange-800 border border-orange-200">
              {currentStoryError}
            </div>
          )}

          <form
            onSubmit={(e) => handleCreateUserStory(e, effectiveReqId)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Select
                  id="reqSelector"
                  label="Linked Requirement"
                  required
                  value={effectiveReqId}
                  onChange={(e) => setActiveAddReqId(Number(e.target.value))}
                  disabled={isSavingStory}
                  options={requirements.map((r) => ({
                    value: r.id,
                    label: `${r.title} (${r.priority})`,
                  }))}
                />
              </div>

              <div>
                <Input
                  id="globalStoryTitle"
                  label="Story Title"
                  required
                  placeholder="e.g. Real-time Score Updates"
                  value={(storyInputMap[effectiveReqId] || {}).title || ''}
                  onChange={(e) =>
                    setStoryInputMap((prev) => ({
                      ...prev,
                      [effectiveReqId]: {
                        ...(prev[effectiveReqId] || {}),
                        title: e.target.value,
                      },
                    }))
                  }
                  disabled={isSavingStory}
                />
              </div>
            </div>

            <Textarea
              id="globalStoryDesc"
              label="Description (User Story / Use Case)"
              required
              rows={3}
              placeholder="e.g. As a spectator, I want to receive ball-by-ball updates without refreshing the browser so that I can follow the match live."
              value={(storyInputMap[effectiveReqId] || {}).description || ''}
              onChange={(e) =>
                setStoryInputMap((prev) => ({
                  ...prev,
                  [effectiveReqId]: {
                    ...(prev[effectiveReqId] || {}),
                    description: e.target.value,
                  },
                }))
              }
              disabled={isSavingStory}
            />

            <div className="flex items-center gap-2.5 pt-1">
              <Button
                variant="orange"
                type="submit"
                disabled={isSavingStory}
              >
                {isSavingStory ? 'Saving...' : 'Save User Story'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowGlobalAddForm(false)}
                disabled={isSavingStory}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white border border-stone-200 rounded p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-600">
          <FilterIcon className="w-3.5 h-3.5 text-stone-400" />
          <span>Filter by Requirement:</span>
        </div>
        <div className="w-full sm:w-80">
          <Select
            id="filterReq"
            value={selectedReqFilter}
            onChange={(e) => setSelectedReqFilter(e.target.value)}
            className="text-xs py-1.5"
            options={[
              { value: 'ALL', label: `All Requirements (${requirements.length})` },
              ...requirements.map((r) => ({
                value: r.id,
                label: r.title,
              })),
            ]}
          />
        </div>
      </div>

      {/* Grouped Stories List */}
      <div className="space-y-4">
        {filteredRequirements.map((req) => {
          const stories = userStoriesMap[req.id] || [];

          return (
            <Card
              key={req.id}
              padding="p-5"
              className="border-stone-200 border-l-4 border-l-orange-500 hover:border-stone-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Requirement
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-stone-900">
                    {req.title}
                  </h4>
                </div>
                <span className="text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-200 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                  {stories.length} {stories.length === 1 ? 'story' : 'stories'}
                </span>
              </div>

              <p className="text-xs text-stone-600 mt-2 leading-relaxed italic">
                {req.description}
              </p>

              <div className="mt-4">
                {stories.length === 0 ? (
                  <p className="text-xs text-stone-400 italic py-2">
                    No user stories for this requirement yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {stories.map((story) => (
                      <div
                        key={story.id}
                        className="p-3.5 bg-stone-50 border border-stone-200 rounded flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-stone-900 block">
                            {story.title}
                          </span>
                          <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                            {story.description}
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-stone-200/60 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleDeleteUserStory(story.id, req.id)}
                            className="text-[11px] font-semibold text-red-600 hover:text-red-800 hover:underline flex items-center gap-1"
                          >
                            <TrashIcon className="w-3 h-3" />
                            Delete Story
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default UserStories;
