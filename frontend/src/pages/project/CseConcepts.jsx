import { useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import {
  ConceptsIcon,
  DatabaseIcon,
  ApiIcon,
  ArchitectureIcon,
  TrashIcon,
  ArrowRightIcon,
  CheckIcon,
} from '../../components/ui/Icons';

// Subject visual config adhering to project palette: red, orange, rust, maroon, stone/grey
const SUBJECT_CONFIG = {
  DBMS: {
    badgeVariant: 'grey',
    icon: DatabaseIcon,
    accentBorder: 'border-l-stone-700',
    countBadge: 'bg-stone-100 text-stone-800 border-stone-200',
  },
  'Computer Networks': {
    badgeVariant: 'rust',
    icon: ApiIcon,
    accentBorder: 'border-l-amber-800',
    countBadge: 'bg-amber-50 text-amber-900 border-amber-200',
  },
  OOPS: {
    badgeVariant: 'orange',
    icon: ConceptsIcon,
    accentBorder: 'border-l-orange-600',
    countBadge: 'bg-orange-50 text-orange-800 border-orange-200',
  },
  'Operating Systems': {
    badgeVariant: 'maroon',
    icon: ArchitectureIcon,
    accentBorder: 'border-l-rose-800',
    countBadge: 'bg-rose-50 text-rose-900 border-rose-200',
  },
  'System Design': {
    badgeVariant: 'red',
    icon: ArchitectureIcon,
    accentBorder: 'border-l-red-600',
    countBadge: 'bg-red-50 text-red-800 border-red-200',
  },
};

function CseConcepts({
  concepts = [],
  allAvailableConcepts = [],
  subjects = [],
  loading = false,
  onAssociateConcept,
  onRemoveConcept,
  onNavigate,
}) {
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [activeModalConcept, setActiveModalConcept] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addConceptId, setAddConceptId] = useState('');
  const [addReason, setAddReason] = useState('');
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);
  const [addError, setAddError] = useState('');

  // Count concepts per subject
  const subjectCounts = {};
  subjects.forEach((s) => {
    subjectCounts[s.name] = concepts.filter((c) => c.subject_name === s.name).length;
  });

  // Filtered concepts based on selected subject
  const filteredConcepts =
    selectedSubject === 'ALL'
      ? concepts
      : concepts.filter((c) => c.subject_name === selectedSubject);

  // Available concepts that are not yet mapped to this project
  const mappedConceptIds = new Set(concepts.map((c) => c.concept_id));
  const unmappedConcepts = allAvailableConcepts.filter((c) => !mappedConceptIds.has(c.id));

  // Handle adding concept form submit
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!addConceptId) {
      setAddError('Please select a concept to associate');
      return;
    }

    setIsSubmittingAdd(true);
    setAddError('');
    try {
      await onAssociateConcept(Number(addConceptId), addReason);
      setAddConceptId('');
      setAddReason('');
      setShowAddModal(false);
    } catch (err) {
      setAddError(err.message || 'Failed to associate concept');
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Page Header */}
      <PageHeader
        title="CSE Concepts"
        subtitle="Understand the Computer Science concepts behind your project and see where they are used."
        action={
          <Button
            variant="primary"
            onClick={() => {
              setAddError('');
              setShowAddModal(true);
            }}
          >
            + Add Concept to Project
          </Button>
        }
      />

      {/* 2. SUBJECT CARDS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Subject Categories
          </h2>
          <span className="text-xs text-stone-400">
            Click a subject to filter concepts
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* "All Subjects" Pill/Card */}
          <div
            onClick={() => setSelectedSubject('ALL')}
            className={`cursor-pointer rounded-lg p-3.5 border transition-all text-left flex flex-col justify-between ${
              selectedSubject === 'ALL'
                ? 'bg-[#fdfcf9] border-red-600 border-l-4 shadow-xs'
                : 'bg-white border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-stone-900 truncate">
                All Subjects
              </span>
              <span className="w-2 h-2 rounded-full bg-stone-400"></span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-stone-600 mt-2">
              {concepts.length} {concepts.length === 1 ? 'concept' : 'concepts'}
            </span>
          </div>

          {/* Individual Subject Cards */}
          {subjects.map((s) => {
            const count = subjectCounts[s.name] || 0;
            const isSelected = selectedSubject === s.name;
            const conf = SUBJECT_CONFIG[s.name] || {
              badgeVariant: 'default',
              accentBorder: 'border-l-stone-600',
              countBadge: 'bg-stone-100 text-stone-700 border-stone-200',
            };
            const IconComponent = conf.icon || ConceptsIcon;

            return (
              <div
                key={s.id}
                onClick={() => setSelectedSubject(s.name)}
                className={`cursor-pointer rounded-lg p-3.5 border transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? `bg-[#fdfcf9] border-stone-400 ${conf.accentBorder} border-l-4 shadow-xs`
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-xs font-bold text-stone-900 truncate">
                    {s.name}
                  </span>
                  <IconComponent className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded border font-semibold ${conf.countBadge}`}
                  >
                    {count} {count === 1 ? 'concept' : 'concepts'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. CONCEPTS LIST SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              {selectedSubject === 'ALL' ? 'All Mapped Concepts' : `${selectedSubject} Concepts`}
            </h3>
            <span className="text-xs font-mono text-stone-500">
              ({filteredConcepts.length})
            </span>
          </div>

          {selectedSubject !== 'ALL' && (
            <button
              type="button"
              onClick={() => setSelectedSubject('ALL')}
              className="text-xs text-red-600 hover:text-red-700 font-semibold"
            >
              Show all subjects &rarr;
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-16 text-center text-xs text-stone-500 bg-white border border-stone-200 rounded-lg">
            Loading CSE concepts...
          </div>
        ) : filteredConcepts.length === 0 ? (
          <EmptyState
            title={
              selectedSubject === 'ALL'
                ? 'No CSE Concepts Mapped Yet'
                : `No ${selectedSubject} concepts found for this project`
            }
            message={
              selectedSubject === 'ALL'
                ? 'Concepts are automatically detected when you create database entities, API endpoints, or architecture components. You can also manually associate any CSE concept.'
                : `No concepts under ${selectedSubject} have been mapped to this project yet.`
            }
            action={
              <Button
                variant="primary"
                onClick={() => {
                  setAddError('');
                  setShowAddModal(true);
                }}
              >
                + Add Concept to Project
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredConcepts.map((item) => {
              const conf = SUBJECT_CONFIG[item.subject_name] || {
                badgeVariant: 'default',
                accentBorder: 'border-l-stone-600',
              };

              return (
                <Card
                  key={item.mapping_id || item.concept_id}
                  padding="p-5"
                  className={`border-stone-200 border-l-4 ${conf.accentBorder} hover:border-stone-300 transition-shadow`}
                >
                  <div className="flex flex-col h-full justify-between gap-4">
                    {/* Top: Badges & Name */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant={conf.badgeVariant} size="sm">
                          {item.subject_name}
                        </Badge>
                        <button
                          type="button"
                          onClick={() => onRemoveConcept(item.mapping_id)}
                          title="Remove concept from project"
                          className="text-stone-400 hover:text-red-600 p-1 rounded transition-colors text-xs flex items-center gap-1"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="text-base font-bold text-stone-900 tracking-tight">
                        {item.name}
                      </h4>

                      {/* Explanation Teaser */}
                      <p className="text-xs text-stone-600 mt-1.5 leading-relaxed line-clamp-2 font-sans">
                        {item.explanation}
                      </p>
                    </div>

                    {/* Middle: Project Evidence Connection (Section 9) */}
                    <div className="bg-stone-50 border border-stone-200/80 rounded p-3 text-xs">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">
                        <span>Related Feature:</span>
                        <span className="text-red-700 font-semibold">
                          {item.project_evidence?.related_feature || 'System Design'}
                        </span>
                      </div>

                      <div className="text-[11px] text-stone-800 font-medium">
                        <span className="text-stone-400">Used in: </span>
                        <span className="font-mono text-stone-900 font-semibold">
                          {Array.isArray(item.project_evidence?.references)
                            ? item.project_evidence.references.slice(0, 3).join(', ')
                            : 'Active project components'}
                          {Array.isArray(item.project_evidence?.references) &&
                            item.project_evidence.references.length > 3 &&
                            ` +${item.project_evidence.references.length - 3} more`}
                        </span>
                      </div>
                    </div>

                    {/* Bottom: Action trigger */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] text-stone-400">
                        Academic & Viva Prep
                      </span>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setActiveModalConcept(item)}
                        className="text-xs"
                      >
                        View Full Breakdown &rarr;
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. CONCEPT DETAIL MODAL (Sections 8 & 9) */}
      {activeModalConcept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-stone-300 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-3">
                <Badge
                  variant={SUBJECT_CONFIG[activeModalConcept.subject_name]?.badgeVariant || 'default'}
                  size="md"
                >
                  {activeModalConcept.subject_name}
                </Badge>
                <h3 className="text-lg font-bold text-stone-900">
                  {activeModalConcept.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalConcept(null)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold p-1 leading-none"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
              {/* Question 1: What is it? */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                  1. What is it?
                </h4>
                <div className="bg-[#fdfcf9] border border-stone-200 rounded p-3.5 text-stone-800 leading-relaxed font-sans">
                  {activeModalConcept.explanation}
                </div>
              </div>

              {/* Question 2: Why is it relevant to your project? */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
                  2. Why is it relevant to your project?
                </h4>
                <div className="bg-stone-50 border border-stone-200 rounded p-3.5 text-stone-800 leading-relaxed font-sans space-y-2">
                  <p>{activeModalConcept.project_relevance}</p>
                  {activeModalConcept.reason && (
                    <div className="pt-2 border-t border-stone-200/60 text-xs text-stone-600">
                      <span className="font-semibold text-stone-700">Project Context: </span>
                      {activeModalConcept.reason}
                    </div>
                  )}
                </div>
              </div>

              {/* Question 3: Where is it used in your project? (Section 9) */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-800"></span>
                  3. Where is it used in your project?
                </h4>
                <div className="bg-stone-50 border border-stone-200 rounded p-3.5 text-stone-800 leading-relaxed font-sans space-y-3">
                  <p>{activeModalConcept.project_usage}</p>

                  {/* Concrete Live Project References */}
                  {activeModalConcept.project_evidence && (
                    <div className="bg-white border border-stone-200 rounded p-3">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                        Actual Project Artifacts ({activeModalConcept.project_evidence.related_feature}):
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeModalConcept.project_evidence.references?.map((ref, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-xs bg-stone-100 text-stone-800 px-2 py-0.5 rounded border border-stone-200"
                          >
                            {ref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Question 4: What should you learn? */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-700"></span>
                  4. What should you learn (Viva & Academic Checklist)?
                </h4>
                <div className="bg-[#fdfcf9] border border-stone-200 rounded p-3.5">
                  <ul className="space-y-1.5 text-xs text-stone-800">
                    {activeModalConcept.what_to_learn
                      ?.split('\n')
                      .filter((line) => line.trim())
                      .map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-600 font-bold shrink-0 mt-0.5">•</span>
                          <span>{point.replace(/^[•\-\*]\s*/, '')}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  onRemoveConcept(activeModalConcept.mapping_id);
                  setActiveModalConcept(null);
                }}
              >
                <TrashIcon className="w-3.5 h-3.5 mr-1" />
                Remove from Project
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveModalConcept(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 5. ADD CONCEPT TO PROJECT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-stone-300 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Add Concept to Project
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold p-1 leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="p-6 space-y-4">
              <p className="text-xs text-stone-500">
                Select a predefined CSE concept from the syllabus knowledge base to connect it with your project.
              </p>

              {addError && (
                <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded text-xs">
                  {addError}
                </div>
              )}

              {/* Concept Selector */}
              <div>
                <Select
                  id="addConceptSelect"
                  label="Predefined CSE Concept"
                  required
                  value={addConceptId}
                  onChange={(e) => setAddConceptId(e.target.value)}
                  options={[
                    { value: '', label: '-- Choose a Concept to Associate --' },
                    ...unmappedConcepts.map((c) => ({
                      value: c.id,
                      label: `${c.name} (${c.subject_name})`,
                    })),
                  ]}
                />
                {unmappedConcepts.length === 0 && (
                  <p className="text-[11px] text-stone-400 mt-1">
                    All 17 available concepts are already associated with this project!
                  </p>
                )}
              </div>

              {/* Custom Reason */}
              <div>
                <Input
                  id="addConceptReason"
                  label="Project Relevance / Reason (Optional)"
                  placeholder="e.g. Applied in tournament elimination tree computation"
                  value={addReason}
                  onChange={(e) => setAddReason(e.target.value)}
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmittingAdd}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmittingAdd || !addConceptId}
                >
                  {isSubmittingAdd ? 'Associating...' : 'Associate Concept'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CseConcepts;
