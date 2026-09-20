import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { PlusIcon, TrashIcon, ArrowRightIcon } from '../../components/ui/Icons';

const METHOD_OPTIONS = [
  { value: 'GET', label: 'GET (HTTP Query)' },
  { value: 'POST', label: 'POST (HTTP Mutation)' },
  { value: 'PUT', label: 'PUT (HTTP Replace)' },
  { value: 'PATCH', label: 'PATCH (HTTP Modify)' },
  { value: 'DELETE', label: 'DELETE (HTTP Remove)' },
  { value: 'SQL', label: 'SQL (Database Query / Exec)' },
  { value: 'JSON', label: 'JSON (Data Payload Return)' },
  { value: 'INTERNAL', label: 'INTERNAL (In-Memory / Function Call)' },
  { value: 'OTHER', label: 'OTHER (Custom Protocol)' },
];

const COMPONENT_BADGE_VARIANTS = {
  Frontend: 'red',
  Backend: 'rust',
  Database: 'grey',
  API: 'orange',
  'External Service': 'maroon',
  Other: 'default',
};

function DataFlow({
  dataFlowSteps = [],
  loadingDataFlowSteps = false,
  showAddStepForm = false,
  setShowAddStepForm,
  stepNumber = 1,
  setStepNumber,
  flowFromCompId = '',
  setFlowFromCompId,
  flowToCompId = '',
  setFlowToCompId,
  flowApiId = '',
  setFlowApiId,
  flowAction = '',
  setFlowAction,
  flowMethod = 'POST',
  setFlowMethod,
  flowDescription = '',
  setFlowDescription,
  isSavingStep = false,
  flowMessage = '',
  setFlowMessage,
  isFlowError = false,
  handleCreateDataFlowStep,
  handleDeleteDataFlowStep,
  components = [],
  apiEndpoints = [],
  onNavigate,
}) {
  // Guard if fewer than 2 components exist in current project
  if (components.length < 2) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Request / Data Flow"
          subtitle="Define how requests and data move between the components of your project."
        />
        <EmptyState
          title="Architecture components required"
          message="A data flow documents communication between components (e.g. Frontend → Backend → Database). Please define at least two architecture components first."
          action={
            <Button
              variant="primary"
              onClick={() => onNavigate && onNavigate('architecture')}
            >
              Go to System Architecture &rarr;
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-6">
        <PageHeader
          title="Request / Data Flow"
          subtitle="Define how requests and data move between the components of your project."
          action={
            <Button
              variant={showAddStepForm ? 'secondary' : 'primary'}
              onClick={() => {
                setShowAddStepForm(!showAddStepForm);
                if (setFlowMessage) setFlowMessage('');
                if (!showAddStepForm && setStepNumber) {
                  // Default step number to next in sequence
                  setStepNumber(dataFlowSteps.length + 1);
                }
              }}
            >
              {showAddStepForm ? 'Close Form' : '+ Add Flow Step'}
            </Button>
          }
        />

        {/* Add Flow Step Form */}
        {showAddStepForm && (
          <Card className="border-stone-200 border-l-4 border-l-red-600 bg-[#fdfcf9]">
            <div className="mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                New Request / Data Flow Step
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Document a discrete step in a request lifecycle from source to destination.
              </p>
            </div>

            {flowMessage && (
              <div
                className={`p-3 rounded text-xs mb-4 ${
                  isFlowError
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-stone-100 text-stone-800 border border-stone-300'
                }`}
              >
                {flowMessage}
              </div>
            )}

            <form onSubmit={handleCreateDataFlowStep} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Step Number */}
                <div>
                  <Input
                    id="stepNumber"
                    label="Step Number (Sequence)"
                    type="number"
                    min="1"
                    required
                    value={stepNumber}
                    onChange={(e) => setStepNumber(e.target.value)}
                    disabled={isSavingStep}
                  />
                </div>

                {/* From Component */}
                <div>
                  <Select
                    id="flowFromComp"
                    label="From Component (Source)"
                    required
                    value={flowFromCompId}
                    onChange={(e) => setFlowFromCompId(e.target.value)}
                    disabled={isSavingStep}
                    options={[
                      { value: '', label: '-- Select Source Component --' },
                      ...components.map((c) => ({
                        value: c.id,
                        label: `${c.name} (${c.type})`,
                      })),
                    ]}
                  />
                </div>

                {/* To Component */}
                <div>
                  <Select
                    id="flowToComp"
                    label="To Component (Destination)"
                    required
                    value={flowToCompId}
                    onChange={(e) => setFlowToCompId(e.target.value)}
                    disabled={isSavingStep}
                    options={[
                      { value: '', label: '-- Select Target Component --' },
                      ...components.map((c) => ({
                        value: c.id,
                        label: `${c.name} (${c.type})`,
                      })),
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Action */}
                <div className="sm:col-span-1">
                  <Input
                    id="flowAction"
                    label="Action"
                    required
                    placeholder="e.g. Send login request, Query user table"
                    value={flowAction}
                    onChange={(e) => setFlowAction(e.target.value)}
                    disabled={isSavingStep}
                  />
                </div>

                {/* Method */}
                <div>
                  <Select
                    id="flowMethod"
                    label="Method / Protocol"
                    value={flowMethod}
                    onChange={(e) => setFlowMethod(e.target.value)}
                    disabled={isSavingStep}
                    options={METHOD_OPTIONS}
                  />
                </div>

                {/* Linked API (Optional) */}
                <div>
                  <Select
                    id="flowApi"
                    label="Linked API Design (Optional)"
                    value={flowApiId}
                    onChange={(e) => setFlowApiId(e.target.value)}
                    disabled={isSavingStep}
                    options={[
                      { value: '', label: '-- No API / Not applicable --' },
                      ...apiEndpoints.map((api) => ({
                        value: api.id,
                        label: `${api.method} ${api.endpoint} (${api.name})`,
                      })),
                    ]}
                  />
                </div>
              </div>

              {/* Description */}
              <Textarea
                id="flowDescription"
                label="Step Description"
                rows={2}
                placeholder="e.g. Client passes email and hashed password in JSON body; server validates JWT or returns 401 on mismatch."
                value={flowDescription}
                onChange={(e) => setFlowDescription(e.target.value)}
                disabled={isSavingStep}
              />

              <div className="flex items-center gap-2.5 pt-1">
                <Button type="submit" disabled={isSavingStep}>
                  {isSavingStep ? 'Saving Step...' : 'Save Flow Step'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowAddStepForm(false);
                    if (setFlowMessage) setFlowMessage('');
                  }}
                  disabled={isSavingStep}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Flow Visualization (Sequential Chain) */}
        {dataFlowSteps.length > 0 && (
          <div className="bg-[#fdfcf9] border border-stone-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Request Lifecycle Flowchart
                </h3>
                <span className="text-[11px] text-stone-500 font-mono">
                  ({dataFlowSteps.length} ordered {dataFlowSteps.length === 1 ? 'step' : 'steps'})
                </span>
              </div>
              <span className="text-xs text-stone-400 font-sans">
                Sequential End-to-End Trace
              </span>
            </div>

            {/* Linear flowchart chain */}
            <div className="flex flex-col gap-3">
              {dataFlowSteps.map((step, idx) => {
                const fromType = step.from_component_type || 'Component';
                const toType = step.to_component_type || 'Component';
                const fromName = step.from_component_name || `Comp #${step.from_component_id}`;
                const toName = step.to_component_name || `Comp #${step.to_component_id}`;

                return (
                  <div key={step.id} className="flex flex-col">
                    {/* Node row */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 bg-white border border-stone-200 rounded-md p-3 shadow-2xs">
                      {/* Step index badge */}
                      <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                        {step.step_number}
                      </span>

                      {/* Source component pill */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-50 border border-stone-200 rounded shrink-0">
                        <Badge variant={COMPONENT_BADGE_VARIANTS[fromType] || 'default'} size="sm">
                          {fromType}
                        </Badge>
                        <span className="text-xs font-bold text-stone-800">{fromName}</span>
                      </div>

                      {/* Transition indicator */}
                      <div className="flex items-center gap-1.5 text-stone-400 font-bold shrink-0 px-1">
                        <ArrowRightIcon className="w-3.5 h-3.5 text-red-600" />
                      </div>

                      {/* Target component pill */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-50 border border-stone-200 rounded shrink-0">
                        <Badge variant={COMPONENT_BADGE_VARIANTS[toType] || 'default'} size="sm">
                          {toType}
                        </Badge>
                        <span className="text-xs font-bold text-stone-800">{toName}</span>
                      </div>

                      {/* Action & Protocol Details */}
                      <div className="flex flex-wrap items-center gap-2 sm:ml-auto pt-1 sm:pt-0">
                        <Badge variant={step.method ? step.method.toLowerCase() : 'internal'} size="sm">
                          {step.method || 'INTERNAL'}
                        </Badge>
                        <span className="text-xs font-semibold text-stone-900">
                          {step.action}
                        </span>
                        {step.api_endpoint && (
                          <span className="text-[11px] font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                            {step.api_endpoint}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Connecting vertical connector between steps */}
                    {idx < dataFlowSteps.length - 1 && (
                      <div className="flex items-center justify-center py-1 text-stone-300">
                        <span className="text-sm font-bold text-stone-400">&darr;</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Ordered Step Cards */}
        {loadingDataFlowSteps ? (
          <div className="p-12 text-center text-xs text-stone-500 bg-white border border-stone-200 rounded-lg">
            Loading request flow steps...
          </div>
        ) : dataFlowSteps.length === 0 ? (
          <EmptyState
            title="No request / data flow steps defined"
            message="Document how requests travel through your architecture step-by-step (e.g. Step 1: Frontend → Backend with POST /api/login, Step 2: Backend → Database with SQL)."
            action={
              !showAddStepForm && (
                <Button onClick={() => setShowAddStepForm(true)}>
                  + Add Flow Step
                </Button>
              )
            }
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Detailed Flow Steps ({dataFlowSteps.length})
              </h4>
              <span className="text-xs text-stone-400">
                Ordered by Step Sequence
              </span>
            </div>

            {dataFlowSteps.map((step) => {
              const fromType = step.from_component_type || 'Component';
              const toType = step.to_component_type || 'Component';
              const fromName = step.from_component_name || `Component #${step.from_component_id}`;
              const toName = step.to_component_name || `Component #${step.to_component_id}`;

              return (
                <Card
                  key={step.id}
                  padding="p-4 sm:p-5"
                  className="border-stone-200 border-l-4 border-l-stone-700 hover:border-stone-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-100">
                    {/* Step badge & Action */}
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded bg-stone-900 text-white flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                        {step.step_number}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                            {step.action}
                          </h4>
                          <Badge variant={step.method ? step.method.toLowerCase() : 'internal'} size="sm">
                            {step.method || 'INTERNAL'}
                          </Badge>
                          {step.api_name && (
                            <span className="text-[11px] font-mono text-stone-700 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
                              API: {step.api_name} ({step.api_endpoint})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteDataFlowStep(step.id)}
                        className="text-xs"
                      >
                        <TrashIcon className="w-3.5 h-3.5 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* Flow endpoints: From Component ↓ To Component */}
                  <div className="mt-3 bg-stone-50 border border-stone-200 rounded p-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                          FROM:
                        </span>
                        <Badge variant={COMPONENT_BADGE_VARIANTS[fromType] || 'default'} size="sm">
                          {fromType}
                        </Badge>
                        <span className="font-bold text-stone-900">{fromName}</span>
                      </div>

                      <div className="hidden sm:flex items-center text-red-600 font-bold px-2">
                        &rarr;
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                          TO:
                        </span>
                        <Badge variant={COMPONENT_BADGE_VARIANTS[toType] || 'default'} size="sm">
                          {toType}
                        </Badge>
                        <span className="font-bold text-stone-900">{toName}</span>
                      </div>
                    </div>
                  </div>

                  {step.description && (
                    <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                      <span className="font-semibold text-stone-700">Details: </span>
                      {step.description}
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default DataFlow;
