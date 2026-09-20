import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { TrashIcon } from '../../components/ui/Icons';

function ApiDesign({
  apiEndpoints,
  loadingApiEndpoints,
  showAddApiForm,
  setShowAddApiForm,
  apiName,
  setApiName,
  apiMethod,
  setApiMethod,
  apiEndpoint,
  setApiEndpoint,
  apiDescription,
  setApiDescription,
  apiRequestBody,
  setApiRequestBody,
  apiResponseBody,
  setApiResponseBody,
  isSavingApi,
  apiMessage,
  setApiMessage,
  isApiError,
  handleCreateApi,
  handleDeleteApi,
}) {
  const methodOptions = [
    { value: 'GET', label: 'GET (Retrieve Data)' },
    { value: 'POST', label: 'POST (Create Resource)' },
    { value: 'PUT', label: 'PUT (Full Update)' },
    { value: 'PATCH', label: 'PATCH (Partial Update)' },
    { value: 'DELETE', label: 'DELETE (Remove Resource)' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="API Design & Contracts"
        subtitle="Document RESTful endpoints, HTTP methods, route paths, and JSON request/response payloads."
        action={
          <Button
            variant={showAddApiForm ? 'secondary' : 'rust'}
            onClick={() => {
              setShowAddApiForm(!showAddApiForm);
              setApiMessage('');
            }}
          >
            {showAddApiForm ? 'Close Form' : '+ Add API Endpoint'}
          </Button>
        }
      />

      {/* Add API Form - Rust Accent */}
      {showAddApiForm && (
        <Card className="border-stone-200 border-l-4 border-l-amber-800 bg-[#fdfcf9]">
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              New API Endpoint Design
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Specify the HTTP route and mock JSON contracts for client-server communication.
            </p>
          </div>

          {apiMessage && (
            <div
              className={`p-3 rounded text-xs mb-4 ${
                isApiError
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-stone-100 text-stone-800 border border-stone-300'
              }`}
            >
              {apiMessage}
            </div>
          )}

          <form onSubmit={handleCreateApi} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Input
                  id="apiName"
                  label="API Name"
                  required
                  placeholder="e.g. Create Match, Get Live Scores"
                  value={apiName}
                  onChange={(e) => setApiName(e.target.value)}
                  disabled={isSavingApi}
                />
              </div>

              <div>
                <Select
                  id="apiMethod"
                  label="HTTP Method"
                  value={apiMethod}
                  onChange={(e) => setApiMethod(e.target.value)}
                  disabled={isSavingApi}
                  options={methodOptions}
                />
              </div>
            </div>

            <div>
              <Input
                id="apiEndpoint"
                label="Endpoint Route Path"
                required
                placeholder="e.g. /api/matches or /api/matches/:id/score"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                disabled={isSavingApi}
                className="font-mono text-xs sm:text-sm"
              />
            </div>

            <div>
              <Textarea
                id="apiDescription"
                label="Description"
                rows={2}
                placeholder="e.g. Creates a new cricket match fixture between two participating teams."
                value={apiDescription}
                onChange={(e) => setApiDescription(e.target.value)}
                disabled={isSavingApi}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Textarea
                  id="apiRequestBody"
                  label="Request Body (JSON format or schema)"
                  rows={4}
                  placeholder={`{\n  "team_a": "India",\n  "team_b": "Australia"\n}`}
                  value={apiRequestBody}
                  onChange={(e) => setApiRequestBody(e.target.value)}
                  disabled={isSavingApi}
                  className="font-mono text-xs bg-stone-50"
                />
              </div>

              <div>
                <Textarea
                  id="apiResponseBody"
                  label="Response Body (JSON format or schema)"
                  rows={4}
                  placeholder={`{\n  "match_id": 101,\n  "status": "scheduled"\n}`}
                  value={apiResponseBody}
                  onChange={(e) => setApiResponseBody(e.target.value)}
                  disabled={isSavingApi}
                  className="font-mono text-xs bg-stone-50"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <Button variant="rust" type="submit" disabled={isSavingApi}>
                {isSavingApi ? 'Saving...' : 'Save API Design'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowAddApiForm(false);
                  setApiMessage('');
                }}
                disabled={isSavingApi}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* API Endpoints List */}
      {loadingApiEndpoints ? (
        <div className="p-12 text-center text-xs text-stone-500 bg-white border border-stone-200 rounded-lg">
          Loading API designs...
        </div>
      ) : apiEndpoints.length === 0 ? (
        <EmptyState
          title="No API endpoints documented yet"
          message="Document your system's REST APIs and payloads to specify client-server interfaces."
          action={
            !showAddApiForm && (
              <Button variant="rust" onClick={() => setShowAddApiForm(true)}>
                + Add API Endpoint
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-4">
          {apiEndpoints.map((api) => (
            <Card
              key={api.id}
              padding="p-5"
              className="border-stone-200 border-l-4 border-l-amber-800 hover:border-stone-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge variant={api.method.toLowerCase()} size="md">
                    {api.method}
                  </Badge>
                  <code className="font-mono font-bold text-xs sm:text-sm bg-stone-100 text-stone-900 px-2 py-0.5 rounded border border-stone-200">
                    {api.endpoint}
                  </code>
                  <span className="text-xs font-semibold text-stone-700">
                    ({api.name})
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteApi(api.id)}
                    className="text-xs"
                  >
                    <TrashIcon className="w-3.5 h-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>

              {api.description && (
                <p className="text-xs sm:text-sm text-stone-700 mt-3 leading-relaxed">
                  {api.description}
                </p>
              )}

              {/* Request & Response Body Payloads */}
              {(api.request_body || api.response_body) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  {api.request_body && (
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
                        Request Body (JSON)
                      </span>
                      <pre className="text-xs font-mono bg-white p-2.5 rounded border border-stone-200 text-stone-800 whitespace-pre-wrap">
                        {api.request_body}
                      </pre>
                    </div>
                  )}

                  {api.response_body && (
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
                        Response Body (JSON)
                      </span>
                      <pre className="text-xs font-mono bg-white p-2.5 rounded border border-stone-200 text-stone-800 whitespace-pre-wrap">
                        {api.response_body}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApiDesign;
