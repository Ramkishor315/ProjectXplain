import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { PlusIcon, TrashIcon } from '../../components/ui/Icons';

function Requirements({
  requirements,
  loadingRequirements,
  showAddReqForm,
  setShowAddReqForm,
  reqTitle,
  setReqTitle,
  reqDescription,
  setReqDescription,
  reqPriority,
  setReqPriority,
  isSavingReq,
  reqMessage,
  setReqMessage,
  isReqError,
  handleCreateRequirement,
  handleDeleteRequirement,
  userStoriesMap,
  showStoryFormMap,
  setShowStoryFormMap,
  storyInputMap,
  setStoryInputMap,
  storyLoadingMap,
  storySavingMap,
  storyErrorMap,
  handleCreateUserStory,
  handleDeleteUserStory,
}) {
  const priorityBadgeVariant = {
    High: 'red',
    Medium: 'orange',
    Low: 'grey',
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Requirements Management"
        subtitle="Define high-level functional and non-functional requirements for the project."
        action={
          <Button
            variant={showAddReqForm ? 'secondary' : 'primary'}
            onClick={() => {
              setShowAddReqForm(!showAddReqForm);
              setReqMessage('');
            }}
          >
            {showAddReqForm ? 'Close Form' : '+ Add Requirement'}
          </Button>
        }
      />

      {/* Add Requirement Form - Red Accent */}
      {showAddReqForm && (
        <Card className="border-stone-200 border-l-4 border-l-red-600 bg-[#fdfcf9]">
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              New Requirement
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Specify what the system must do and assign an implementation priority.
            </p>
          </div>

          {reqMessage && (
            <div
              className={`p-3 rounded text-xs mb-4 ${
                isReqError
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-stone-100 text-stone-800 border border-stone-300'
              }`}
            >
              {reqMessage}
            </div>
          )}

          <form onSubmit={handleCreateRequirement} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Input
                  id="reqTitle"
                  label="Requirement Title"
                  required
                  placeholder="e.g. Real-time Live Score Updates"
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  disabled={isSavingReq}
                />
              </div>

              <div>
                <Select
                  id="reqPriority"
                  label="Priority"
                  value={reqPriority}
                  onChange={(e) => setReqPriority(e.target.value)}
                  disabled={isSavingReq}
                  options={[
                    { value: 'High', label: 'High Priority' },
                    { value: 'Medium', label: 'Medium Priority' },
                    { value: 'Low', label: 'Low Priority' },
                  ]}
                />
              </div>
            </div>

            <Textarea
              id="reqDescription"
              label="Description"
              required
              rows={3}
              placeholder="e.g. The system should broadcast ball-by-ball score updates within 2 seconds of the event using WebSockets."
              value={reqDescription}
              onChange={(e) => setReqDescription(e.target.value)}
              disabled={isSavingReq}
            />

            <div className="flex items-center gap-2.5 pt-1">
              <Button type="submit" disabled={isSavingReq}>
                {isSavingReq ? 'Saving...' : 'Save Requirement'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowAddReqForm(false);
                  setReqMessage('');
                }}
                disabled={isSavingReq}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Requirements List */}
      {loadingRequirements ? (
        <div className="p-12 text-center text-xs text-stone-500 bg-white border border-stone-200 rounded-lg">
          Loading requirements...
        </div>
      ) : requirements.length === 0 ? (
        <EmptyState
          title="No requirements added yet"
          message="Document your system's functional requirements to begin planning architecture and user stories."
          action={
            !showAddReqForm && (
              <Button onClick={() => setShowAddReqForm(true)}>
                + Add Requirement
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-4">
          {requirements.map((req) => {
            const stories = userStoriesMap[req.id] || [];
            const isStoryFormOpen = showStoryFormMap[req.id];
            const isSavingStory = storySavingMap[req.id];
            const storyError = storyErrorMap[req.id];
            const currentStoryInput = storyInputMap[req.id] || {};

            return (
              <Card
                key={req.id}
                padding="p-5"
                className="border-stone-200 border-l-4 border-l-red-600 hover:border-stone-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-start gap-2.5">
                    <Badge variant={priorityBadgeVariant[req.priority] || 'default'}>
                      {req.priority}
                    </Badge>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                        {req.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteRequirement(req.id)}
                      className="text-xs"
                    >
                      <TrashIcon className="w-3.5 h-3.5 mr-1 text-red-600" />
                      Delete
                    </Button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 mt-3 leading-relaxed">
                  {req.description}
                </p>

                {/* Inline User Stories Section */}
                <div className="mt-4 pt-3 border-t border-stone-100 bg-stone-50/80 -mx-5 -mb-5 p-4 rounded-b-lg">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      Linked User Stories ({stories.length})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setShowStoryFormMap((prev) => ({
                          ...prev,
                          [req.id]: !prev[req.id],
                        }))
                      }
                      className="text-red-700 hover:text-red-900 text-xs font-semibold hover:underline flex items-center gap-1"
                    >
                      <PlusIcon className="w-3 h-3" />
                      {isStoryFormOpen ? 'Close Story Form' : 'Add User Story'}
                    </button>
                  </div>

                  {/* Inline Add Story Form */}
                  {isStoryFormOpen && (
                    <div className="p-3.5 bg-white border border-stone-200 rounded mb-3 shadow-2xs">
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-2">
                        Add User Story for this Requirement
                      </h5>
                      {storyError && (
                        <div className="p-2 rounded bg-red-50 text-red-700 text-xs mb-2 border border-red-200">
                          {storyError}
                        </div>
                      )}
                      <form
                        onSubmit={(e) => handleCreateUserStory(e, req.id)}
                        className="space-y-2.5"
                      >
                        <Input
                          placeholder="Story Title (e.g. Match Live Ticker)"
                          value={currentStoryInput.title || ''}
                          onChange={(e) =>
                            setStoryInputMap((prev) => ({
                              ...prev,
                              [req.id]: {
                                ...(prev[req.id] || {}),
                                title: e.target.value,
                              },
                            }))
                          }
                          disabled={isSavingStory}
                          required
                        />
                        <Textarea
                          rows={2}
                          placeholder="As a [user], I want [action] so that [benefit]..."
                          value={currentStoryInput.description || ''}
                          onChange={(e) =>
                            setStoryInputMap((prev) => ({
                              ...prev,
                              [req.id]: {
                                ...(prev[req.id] || {}),
                                description: e.target.value,
                              },
                            }))
                          }
                          disabled={isSavingStory}
                          required
                        />
                        <div className="flex items-center gap-2">
                          <Button size="sm" type="submit" disabled={isSavingStory}>
                            {isSavingStory ? 'Saving...' : 'Save Story'}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            type="button"
                            onClick={() =>
                              setShowStoryFormMap((prev) => ({
                                ...prev,
                                [req.id]: false,
                              }))
                            }
                            disabled={isSavingStory}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* List of stories */}
                  {stories.length === 0 ? (
                    <p className="text-xs text-stone-400 italic">
                      No user stories linked to this requirement yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {stories.map((story) => (
                        <div
                          key={story.id}
                          className="p-3 bg-white border border-stone-200 rounded flex flex-col justify-between shadow-2xs"
                        >
                          <div>
                            <span className="text-xs font-semibold text-stone-900 block">
                              {story.title}
                            </span>
                            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                              {story.description}
                            </p>
                          </div>
                          <div className="mt-2.5 pt-2 border-t border-stone-100 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleDeleteUserStory(story.id, req.id)}
                              className="text-[11px] font-semibold text-red-600 hover:text-red-800 hover:underline flex items-center gap-1"
                            >
                              <TrashIcon className="w-3 h-3" />
                              Delete
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
      )}
    </div>
  );
}

export default Requirements;
