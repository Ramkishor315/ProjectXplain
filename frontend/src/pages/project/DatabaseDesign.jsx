import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import { PlusIcon, TrashIcon, ArrowRightIcon, ChevronDownIcon, ChevronRightIcon } from '../../components/ui/Icons';

function DatabaseDesign({
  entities,
  loadingEntities,
  showAddEntityForm,
  setShowAddEntityForm,
  entityName,
  setEntityName,
  entityDescription,
  setEntityDescription,
  isSavingEntity,
  entityMessage,
  setEntityMessage,
  isEntityError,
  handleCreateEntity,
  handleDeleteEntity,
  openEntityMap,
  setOpenEntityMap,
  attributesMap,
  showAttrFormMap,
  setShowAttrFormMap,
  attrInputMap,
  setAttrInputMap,
  attrSavingMap,
  attrErrorMap,
  handleCreateAttribute,
  handleDeleteAttribute,
  dbRelationships,
  loadingRelationships,
  showAddRelForm,
  setShowAddRelForm,
  relFromEntityId,
  setRelFromEntityId,
  relToEntityId,
  setRelToEntityId,
  relType,
  setRelType,
  isSavingRel,
  relMessage,
  setRelMessage,
  isRelError,
  handleCreateRelationship,
  handleDeleteRelationship,
}) {
  const dataTypeOptions = [
    { value: 'INT', label: 'INT (Integer)' },
    { value: 'VARCHAR(255)', label: 'VARCHAR(255) (Short Text)' },
    { value: 'TEXT', label: 'TEXT (Long Text)' },
    { value: 'BOOLEAN', label: 'BOOLEAN (True/False)' },
    { value: 'DATETIME', label: 'DATETIME (Date & Time)' },
    { value: 'DECIMAL(10,2)', label: 'DECIMAL(10,2) (Currency/Float)' },
  ];

  const keyTypeOptions = [
    { value: 'None', label: 'Standard Attribute (No Key)' },
    { value: 'Primary Key', label: 'Primary Key (PK)' },
    { value: 'Foreign Key', label: 'Foreign Key (FK)' },
  ];

  return (
    <div className="space-y-8">
      {/* SECTION 1: ENTITIES & ATTRIBUTES - Grey Accent */}
      <div className="space-y-6">
        <PageHeader
          title="Database Schema & Entities"
          subtitle="Design database tables, fields, data types, and primary/foreign key constraints."
          action={
            <Button
              variant={showAddEntityForm ? 'secondary' : 'neutral'}
              onClick={() => {
                setShowAddEntityForm(!showAddEntityForm);
                setEntityMessage('');
              }}
            >
              {showAddEntityForm ? 'Close Form' : '+ Add Entity / Table'}
            </Button>
          }
        />

        {/* Add Entity Form */}
        {showAddEntityForm && (
          <Card className="border-stone-200 border-l-4 border-l-stone-700 bg-[#fdfcf9]">
            <div className="mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                New Database Entity (Table)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Each entity translates to a table in relational database systems (e.g. users, matches, tickets).
              </p>
            </div>

            {entityMessage && (
              <div
                className={`p-3 rounded text-xs mb-4 ${
                  isEntityError
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-stone-100 text-stone-800 border border-stone-300'
                }`}
              >
                {entityMessage}
              </div>
            )}

            <form onSubmit={handleCreateEntity} className="space-y-4">
              <Input
                id="entityName"
                label="Entity Name"
                required
                placeholder="e.g. users, players, matches, tickets"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                disabled={isSavingEntity}
              />

              <Textarea
                id="entityDescription"
                label="Description"
                rows={2}
                placeholder="e.g. Stores spectator accounts, credentials, and authentication profiles."
                value={entityDescription}
                onChange={(e) => setEntityDescription(e.target.value)}
                disabled={isSavingEntity}
              />

              <div className="flex items-center gap-2.5 pt-1">
                <Button variant="neutral" type="submit" disabled={isSavingEntity}>
                  {isSavingEntity ? 'Saving...' : 'Save Entity'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowAddEntityForm(false);
                    setEntityMessage('');
                  }}
                  disabled={isSavingEntity}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Entities List */}
        {loadingEntities ? (
          <div className="p-12 text-center text-xs text-stone-500 bg-white border border-stone-200 rounded-lg">
            Loading database entities...
          </div>
        ) : entities.length === 0 ? (
          <EmptyState
            title="No database entities defined"
            message="Entities represent your database tables. Create your first entity to design schema attributes."
            action={
              !showAddEntityForm && (
                <Button variant="neutral" onClick={() => setShowAddEntityForm(true)}>
                  + Add Entity
                </Button>
              )
            }
          />
        ) : (
          <div className="space-y-4">
            {entities.map((entity) => {
              const isOpen = openEntityMap[entity.id] !== false; // default open
              const attrs = attributesMap[entity.id] || [];
              const isAttrFormOpen = showAttrFormMap[entity.id];
              const isSavingAttr = attrSavingMap[entity.id];
              const attrError = attrErrorMap[entity.id];
              const currentAttrInput = attrInputMap[entity.id] || {
                name: '',
                data_type: 'INT',
                key_type: 'None',
              };

              return (
                <Card
                  key={entity.id}
                  padding="p-0"
                  className="overflow-hidden border-stone-200 border-l-4 border-l-stone-600"
                >
                  {/* Entity Header */}
                  <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenEntityMap((prev) => ({
                            ...prev,
                            [entity.id]: !isOpen,
                          }))
                        }
                        className="text-stone-500 hover:text-stone-900 text-xs font-bold w-5 h-5 flex items-center justify-center rounded hover:bg-stone-200"
                        title={isOpen ? 'Collapse' : 'Expand'}
                      >
                        {isOpen ? (
                          <ChevronDownIcon className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRightIcon className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] uppercase font-bold text-stone-800 bg-stone-200 border border-stone-300 px-1.5 py-0.5 rounded">
                            TABLE
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-stone-900 font-mono">
                            {entity.name}
                          </h4>
                          <span className="text-xs text-stone-500 font-medium font-sans">
                            ({attrs.length} {attrs.length === 1 ? 'column' : 'columns'})
                          </span>
                        </div>
                        {entity.description && (
                          <p className="text-xs text-stone-600 mt-1 font-sans">
                            {entity.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          setShowAttrFormMap((prev) => ({
                            ...prev,
                            [entity.id]: !prev[entity.id],
                          }))
                        }
                        className="text-xs"
                      >
                        {isAttrFormOpen ? 'Close Form' : '+ Add Column'}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteEntity(entity.id)}
                        className="text-xs"
                      >
                        <TrashIcon className="w-3.5 h-3.5 mr-1" />
                        Delete Table
                      </Button>
                    </div>
                  </div>

                  {/* Body: Attributes */}
                  {isOpen && (
                    <div className="p-4 sm:p-5 space-y-4 bg-white">
                      {/* Add Attribute Form */}
                      {isAttrFormOpen && (
                        <div className="p-3.5 bg-[#fdfcf9] border border-stone-300 rounded shadow-2xs">
                          <h5 className="text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-2.5">
                            Add Column to {entity.name}
                          </h5>

                          {attrError && (
                            <div className="p-2.5 rounded bg-red-50 text-red-800 text-xs mb-3 border border-red-200">
                              {attrError}
                            </div>
                          )}

                          <form
                            onSubmit={(e) => handleCreateAttribute(e, entity.id)}
                            className="space-y-3"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <Input
                                  placeholder="Column Name (e.g. id, email)"
                                  required
                                  value={currentAttrInput.name || ''}
                                  onChange={(e) =>
                                    setAttrInputMap((prev) => ({
                                      ...prev,
                                      [entity.id]: {
                                        ...(prev[entity.id] || {}),
                                        name: e.target.value,
                                      },
                                    }))
                                  }
                                  disabled={isSavingAttr}
                                />
                              </div>

                              <div>
                                <Select
                                  value={currentAttrInput.data_type || 'INT'}
                                  onChange={(e) =>
                                    setAttrInputMap((prev) => ({
                                      ...prev,
                                      [entity.id]: {
                                        ...(prev[entity.id] || {}),
                                        data_type: e.target.value,
                                      },
                                    }))
                                  }
                                  disabled={isSavingAttr}
                                  options={dataTypeOptions}
                                />
                              </div>

                              <div>
                                <Select
                                  value={currentAttrInput.key_type || 'None'}
                                  onChange={(e) =>
                                    setAttrInputMap((prev) => ({
                                      ...prev,
                                      [entity.id]: {
                                        ...(prev[entity.id] || {}),
                                        key_type: e.target.value,
                                      },
                                    }))
                                  }
                                  disabled={isSavingAttr}
                                  options={keyTypeOptions}
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              <Button variant="neutral" size="sm" type="submit" disabled={isSavingAttr}>
                                {isSavingAttr ? 'Saving...' : 'Save Column'}
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                type="button"
                                onClick={() =>
                                  setShowAttrFormMap((prev) => ({
                                    ...prev,
                                    [entity.id]: false,
                                  }))
                                }
                                disabled={isSavingAttr}
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Attributes Table */}
                      {attrs.length === 0 ? (
                        <p className="text-xs text-stone-400 italic py-2">
                          No attributes defined for this table yet. Add columns like primary keys and fields.
                        </p>
                      ) : (
                        <div className="overflow-x-auto border border-stone-200 rounded">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-stone-100 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
                              <tr>
                                <th className="px-4 py-2.5">Attribute Name</th>
                                <th className="px-4 py-2.5">Data Type</th>
                                <th className="px-4 py-2.5">Key Constraint</th>
                                <th className="px-4 py-2.5 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 font-mono">
                              {attrs.map((attr) => (
                                <tr key={attr.id} className="hover:bg-stone-50/70">
                                  <td className="px-4 py-2.5 font-semibold text-stone-900">
                                    {attr.name}
                                  </td>
                                  <td className="px-4 py-2.5 text-stone-700">
                                    {attr.data_type}
                                  </td>
                                  <td className="px-4 py-2.5">
                                    {attr.key_type === 'Primary Key' ? (
                                      <span className="bg-red-50 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200">
                                        PK (Primary Key)
                                      </span>
                                    ) : attr.key_type === 'Foreign Key' ? (
                                      <span className="bg-orange-50 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-200">
                                        FK (Foreign Key)
                                      </span>
                                    ) : (
                                      <span className="text-stone-400 font-sans text-[11px]">
                                        -
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-2.5 text-right font-sans">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteAttribute(attr.id, entity.id)}
                                      className="text-red-600 hover:text-red-800 text-xs font-semibold hover:underline"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: RELATIONSHIPS */}
      <div className="space-y-6 pt-6 border-t border-stone-200">
        <PageHeader
          title="Entity Relationships"
          subtitle="Model relational integrity between tables (e.g. 1 user has many orders)."
          action={
            <Button
              variant={showAddRelForm ? 'secondary' : 'neutral'}
              onClick={() => {
                setShowAddRelForm(!showAddRelForm);
                setRelMessage('');
              }}
              disabled={entities.length < 2}
              title={entities.length < 2 ? 'Need at least 2 entities to create relationships' : ''}
            >
              {showAddRelForm ? 'Close Form' : '+ Add Relationship'}
            </Button>
          }
        />

        {entities.length < 2 && (
          <p className="text-xs text-stone-500 italic">
            Note: You need at least 2 database entities to define relationships between them.
          </p>
        )}

        {/* Add Relationship Form */}
        {showAddRelForm && entities.length >= 2 && (
          <Card className="border-stone-200 border-l-4 border-l-stone-700 bg-[#fdfcf9]">
            <div className="mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                New Entity Relationship
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Connect two entities with a relational cardinality constraint.
              </p>
            </div>

            {relMessage && (
              <div
                className={`p-3 rounded text-xs mb-4 ${
                  isRelError
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-stone-100 text-stone-800 border border-stone-300'
                }`}
              >
                {relMessage}
              </div>
            )}

            <form onSubmit={handleCreateRelationship} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Select
                    id="relFrom"
                    label="From Entity (Parent)"
                    required
                    value={relFromEntityId}
                    onChange={(e) => setRelFromEntityId(e.target.value)}
                    disabled={isSavingRel}
                    options={[
                      { value: '', label: '-- Select Entity --' },
                      ...entities.map((e) => ({
                        value: e.id,
                        label: e.name,
                      })),
                    ]}
                  />
                </div>

                <div>
                  <Select
                    id="relType"
                    label="Relationship Type"
                    value={relType}
                    onChange={(e) => setRelType(e.target.value)}
                    disabled={isSavingRel}
                    options={[
                      { value: 'One-to-One', label: 'One-to-One (1:1)' },
                      { value: 'One-to-Many', label: 'One-to-Many (1:N)' },
                      { value: 'Many-to-Many', label: 'Many-to-Many (M:N)' },
                    ]}
                  />
                </div>

                <div>
                  <Select
                    id="relTo"
                    label="To Entity (Child)"
                    required
                    value={relToEntityId}
                    onChange={(e) => setRelToEntityId(e.target.value)}
                    disabled={isSavingRel}
                    options={[
                      { value: '', label: '-- Select Entity --' },
                      ...entities.map((e) => ({
                        value: e.id,
                        label: e.name,
                      })),
                    ]}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Button variant="neutral" type="submit" disabled={isSavingRel}>
                  {isSavingRel ? 'Saving...' : 'Save Relationship'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowAddRelForm(false);
                    setRelMessage('');
                  }}
                  disabled={isSavingRel}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Relationships List */}
        {loadingRelationships ? (
          <div className="p-12 text-center text-xs text-stone-500 bg-white border border-stone-200 rounded-lg">
            Loading relationships...
          </div>
        ) : dbRelationships.length === 0 ? (
          <EmptyState
            title="No relationships defined"
            message="Model relational links between entities (e.g. users -> matches) to complete your ER diagram."
            action={
              entities.length >= 2 && !showAddRelForm && (
                <Button variant="neutral" onClick={() => setShowAddRelForm(true)}>
                  + Add Relationship
                </Button>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dbRelationships.map((rel) => {
              const fromEntity = entities.find((e) => e.id === rel.from_entity_id);
              const toEntity = entities.find((e) => e.id === rel.to_entity_id);

              return (
                <Card
                  key={rel.id}
                  padding="p-4"
                  className="border-stone-200 border-l-4 border-l-stone-600 hover:border-stone-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 font-mono text-xs sm:text-sm">
                      <span className="font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded border border-stone-200">
                        {fromEntity ? fromEntity.name : `Entity #${rel.from_entity_id}`}
                      </span>

                      <span className="text-stone-400 font-bold">&rarr;</span>

                      <span className="font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded border border-stone-200">
                        {toEntity ? toEntity.name : `Entity #${rel.to_entity_id}`}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteRelationship(rel.id)}
                      className="text-xs"
                    >
                      <TrashIcon className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500 font-medium font-sans">Cardinality:</span>
                    <span className="font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                      {rel.relationship_type}
                    </span>
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

export default DatabaseDesign;
