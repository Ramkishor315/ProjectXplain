import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { PlusIcon, TrashIcon } from '../../components/ui/Icons';

const COMPONENT_TYPE_OPTIONS = [
  { value: 'Frontend', label: 'Frontend (UI / Client App)' },
  { value: 'Backend', label: 'Backend (Server / REST API)' },
  { value: 'Database', label: 'Database (SQL / NoSQL Data Store)' },
  { value: 'API', label: 'API (Internal / Gateway Interface)' },
  { value: 'External Service', label: 'External Service (3rd-Party / Cloud)' },
  { value: 'Other', label: 'Other (Utility / Worker / Cache)' },
];

const COMPONENT_BADGE_VARIANTS = {
  Frontend: 'red',
  Backend: 'rust',
  Database: 'grey',
  API: 'orange',
  'External Service': 'maroon',
  Other: 'default',
};

function SystemArchitecture({
  components = [],
  loadingComponents = false,
  showAddCompForm = false,
  setShowAddCompForm,
  compName = '',
  setCompName,
  compType = 'Frontend',
  setCompType,
  compDescription = '',
  setCompDescription,
  isSavingComp = false,
  compMessage = '',
  setCompMessage,
  isCompError = false,
  handleCreateComponent,
  handleDeleteComponent,
  connections = [],
  loadingConnections = false,
  showAddConnForm = false,
  setShowAddConnForm,
  connFromId = '',
  setConnFromId,
  connToId = '',
  setConnToId,
  connDescription = '',
  setConnDescription,
  isSavingConn = false,
  connMessage = '',
  setConnMessage,
  isConnError = false,
  handleCreateConnection,
  handleDeleteConnection,
}) {
  return (
    <div className="space-y-8">
      {/* SECTION 1: ARCHITECTURE COMPONENTS */}
      <div className="space-y-6">
        <PageHeader
          title="System Architecture"
          subtitle="Design the high-level architecture of your project by defining its major components and how they communicate."
          action={
            <div className="flex items-center gap-2">
              <Button
                variant={showAddCompForm ? 'secondary' : 'maroon'}
                onClick={() => {
                  setShowAddCompForm(!showAddCompForm);
                  if (setCompMessage) setCompMessage('');
                }}
              >
                {showAddCompForm ? 'Close Form' : '+ Add Component'}
              </Button>
            </div>
          }
        />

        {/* Add Component Form */}
        {showAddCompForm && (
          <Card className="border-stone-200 border-l-4 border-l-rose-900 bg-[#fdfcf9]">
            <div className="mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                New Architecture Component
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Define a major building block of your system such as a web frontend, application server, or database.
              </p>
            </div>

            {compMessage && (
              <div
                className={`p-3 rounded text-xs mb-4 ${
                  isCompError
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-stone-100 text-stone-800 border border-stone-300'
                }`}
              >
                {compMessage}
              </div>
            )}

            <form onSubmit={handleCreateComponent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    id="compName"
                    label="Component Name"
                    required
                    placeholder="e.g. React Web App, Node.js API Server, MySQL DB"
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    disabled={isSavingComp}
                  />
                </div>

                <div>
                  <Select
                    id="compType"
                    label="Component Type"
                    value={compType}
                    onChange={(e) => setCompType(e.target.value)}
                    disabled={isSavingComp}
                    options={COMPONENT_TYPE_OPTIONS}
                  />
                </div>
              </div>

              <Textarea
                id="compDescription"
                label="Description"
                rows={2}
                placeholder="e.g. User interface of the application, renders views and interacts with REST endpoints."
                value={compDescription}
                onChange={(e) => setCompDescription(e.target.value)}
                disabled={isSavingComp}
              />

              <div className="flex items-center gap-2.5 pt-1">
                <Button variant="maroon" type="submit" disabled={isSavingComp}>
                  {isSavingComp ? 'Saving...' : 'Save Component'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowAddCompForm(false);
                    if (setCompMessage) setCompMessage('');
                  }}
                  disabled={isSavingComp}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Components Grid */}
        {loadingComponents ? (
          <div className="p-12 text-center text-xs text-stone-500 bg-white border border-stone-200 rounded-lg">
            Loading architecture components...
          </div>
        ) : components.length === 0 ? (
          <EmptyState
            title="No architecture components defined"
            message="Add your first architecture component (such as Frontend, Backend, or Database) to establish your system's topology."
            action={
              !showAddCompForm && (
                <Button variant="maroon" onClick={() => setShowAddCompForm(true)}>
                  + Add Component
                </Button>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {components.map((comp) => {
              const badgeVariant = COMPONENT_BADGE_VARIANTS[comp.type] || 'default';

              return (
                <Card
                  key={comp.id}
                  padding="p-4 sm:p-5"
                  className="border-stone-200 border-l-4 border-l-rose-900 hover:border-stone-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-stone-100">
                      <div>
                        <Badge variant={badgeVariant} size="sm" className="mb-1.5">
                          {comp.type}
                        </Badge>
                        <h4 className="text-sm sm:text-base font-bold text-stone-900">
                          {comp.name}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                      {comp.description || (
                        <span className="italic text-stone-400">No description provided.</span>
                      )}
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                    <span className="text-[11px] font-mono">ID: #{comp.id}</span>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteComponent(comp.id)}
                      className="text-xs"
                    >
                      <TrashIcon className="w-3.5 h-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: ARCHITECTURE CONNECTIONS */}
      <div className="space-y-6 pt-4 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-stone-900 tracking-tight">
              Component Connections & Interactions
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Define the communication channels and data flow between architecture components.
            </p>
          </div>

          {components.length >= 2 && (
            <Button
              variant={showAddConnForm ? 'secondary' : 'maroon'}
              size="sm"
              onClick={() => {
                setShowAddConnForm(!showAddConnForm);
                if (setConnMessage) setConnMessage('');
              }}
            >
              {showAddConnForm ? 'Close Form' : '+ Connect Components'}
            </Button>
          )}
        </div>

        {/* Add Connection Form */}
        {showAddConnForm && (
          <Card className="border-stone-200 border-l-4 border-l-rose-900 bg-[#fdfcf9]">
            <div className="mb-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                New Component Connection
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Connect two existing components to specify their request/response interaction.
              </p>
            </div>

            {connMessage && (
              <div
                className={`p-3 rounded text-xs mb-4 ${
                  isConnError
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-stone-100 text-stone-800 border border-stone-300'
                }`}
              >
                {connMessage}
              </div>
            )}

            <form onSubmit={handleCreateConnection} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select
                    id="connFrom"
                    label="From Component (Source)"
                    required
                    value={connFromId}
                    onChange={(e) => setConnFromId(e.target.value)}
                    disabled={isSavingConn}
                    options={[
                      { value: '', label: '-- Select Source Component --' },
                      ...components.map((c) => ({
                        value: c.id,
                        label: `${c.name} (${c.type})`,
                      })),
                    ]}
                  />
                </div>

                <div>
                  <Select
                    id="connTo"
                    label="To Component (Target)"
                    required
                    value={connToId}
                    onChange={(e) => setConnToId(e.target.value)}
                    disabled={isSavingConn}
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

              <Textarea
                id="connDescription"
                label="Interaction Description"
                rows={2}
                placeholder="e.g. Sends REST API HTTP requests with JSON payloads for authentication and data operations."
                value={connDescription}
                onChange={(e) => setConnDescription(e.target.value)}
                disabled={isSavingConn}
              />

              <div className="flex items-center gap-2.5 pt-1">
                <Button variant="maroon" type="submit" disabled={isSavingConn}>
                  {isSavingConn ? 'Saving...' : 'Save Connection'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowAddConnForm(false);
                    if (setConnMessage) setConnMessage('');
                  }}
                  disabled={isSavingConn}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Connections List */}
        {loadingConnections ? (
          <div className="p-12 text-center text-xs text-stone-500 bg-white border border-stone-200 rounded-lg">
            Loading architecture connections...
          </div>
        ) : connections.length === 0 ? (
          <EmptyState
            title="No component connections defined"
            message={
              components.length < 2
                ? 'Create at least two architecture components to start connecting them.'
                : 'Connect your components (e.g. Frontend → Backend, Backend → Database) to document data interaction.'
            }
            action={
              components.length >= 2 &&
              !showAddConnForm && (
                <Button variant="maroon" onClick={() => setShowAddConnForm(true)}>
                  + Connect Components
                </Button>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connections.map((conn) => {
              const fromName = conn.from_component_name || `Component #${conn.from_component_id}`;
              const fromType = conn.from_component_type || 'Component';
              const toName = conn.to_component_name || `Component #${conn.to_component_id}`;
              const toType = conn.to_component_type || 'Component';

              return (
                <Card
                  key={conn.id}
                  padding="p-4 sm:p-5"
                  className="border-stone-200 border-l-4 border-l-rose-900 hover:border-stone-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Connection Flow: From ↓ To */}
                    <div className="bg-stone-50 border border-stone-200 rounded p-3 mb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={COMPONENT_BADGE_VARIANTS[fromType] || 'default'} size="sm">
                            {fromType}
                          </Badge>
                          <span className="text-xs sm:text-sm font-bold text-stone-900">
                            {fromName}
                          </span>
                        </div>
                      </div>

                      {/* Direction Arrow */}
                      <div className="flex items-center gap-1.5 my-1.5 pl-3 text-rose-800 font-bold text-sm">
                        <span>&darr;</span>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">
                          interacts with
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={COMPONENT_BADGE_VARIANTS[toType] || 'default'} size="sm">
                            {toType}
                          </Badge>
                          <span className="text-xs sm:text-sm font-bold text-stone-900">
                            {toName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {conn.description && (
                      <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                        <span className="font-semibold text-stone-700">Description: </span>
                        {conn.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                    <span className="text-[11px] font-mono">Connection #{conn.id}</span>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteConnection(conn.id)}
                      className="text-xs"
                    >
                      <TrashIcon className="w-3.5 h-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SystemArchitecture;
