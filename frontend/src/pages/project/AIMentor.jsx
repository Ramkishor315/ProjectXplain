import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import { MentorIcon, CheckIcon } from '../../components/ui/Icons';

// Predefined viva & project question suggestions
const SUGGESTED_QUESTIONS = [
  'Why are foreign keys used in my project?',
  'Explain the architecture of my project.',
  'Why is POST used for creating a match?',
  'What CSE concepts are being used in my project?',
  'Explain the request flow of my project.',
  'What is the purpose of the Users table?',
  'How does my frontend communicate with the backend?',
];

function AIMentor({ project, onNavigate }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [askedQuestion, setAskedQuestion] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAskMentor = async (e) => {
    if (e) e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) {
      setError('Please enter a question to ask the AI Mentor.');
      return;
    }

    if (!project || !project.id) {
      setError('Project information is missing.');
      return;
    }

    setLoading(true);
    setError('');
    setAnswer(null);
    setAskedQuestion(trimmed);

    try {
      const response = await fetch(`http://localhost:4000/api/projects/${project.id}/mentor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer from AI Mentor.');
      }

      setAnswer(data.answer);
    } catch (err) {
      setError(err.message || 'An error occurred while contacting AI Mentor.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestedText) => {
    setQuestion(suggestedText);
    setError('');
  };

  const handleCopyAnswer = () => {
    if (!answer) return;
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render markdown-like text cleanly without external libraries
  const renderFormattedAnswer = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    return (
      <div className="space-y-2.5 text-stone-800 text-xs sm:text-sm leading-relaxed font-sans">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          // Empty line -> spacing
          if (!trimmed) {
            return <div key={idx} className="h-1" />;
          }

          // Heading 3: ###
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="text-sm sm:text-base font-bold text-stone-900 pt-2 border-b border-stone-200 pb-1">
                {trimmed.replace('### ', '')}
              </h4>
            );
          }

          // Heading 2: ##
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={idx} className="text-base sm:text-lg font-bold text-stone-900 pt-3 border-b border-stone-200 pb-1">
                {trimmed.replace('## ', '')}
              </h3>
            );
          }

          // Bullet points: - or *
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const bulletContent = trimmed.slice(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-red-600 font-bold shrink-0 mt-0.5">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(bulletContent) }} />
              </div>
            );
          }

          // Numbered list: 1. 2. etc.
          const matchNum = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (matchNum) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="font-mono text-xs font-bold text-stone-700 shrink-0 mt-0.5">
                  {matchNum[1]}.
                </span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(matchNum[2]) }} />
              </div>
            );
          }

          // Table separator line |---|---|
          if (trimmed.startsWith('|') && trimmed.includes('---')) {
            return null;
          }

          // Table row | col | col |
          if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            const cells = trimmed
              .split('|')
              .filter((_, i, arr) => i > 0 && i < arr.length - 1)
              .map((c) => c.trim());

            return (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-stone-50 border border-stone-200 rounded p-2 text-xs">
                {cells.map((cell, cIdx) => (
                  <div key={cIdx} className="font-medium text-stone-800" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell) }} />
                ))}
              </div>
            );
          }

          // Standard paragraph
          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />
          );
        })}
      </div>
    );
  };

  // Helper for bold and code tags inline
  function formatInlineMarkdown(str) {
    if (!str) return '';
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-stone-900">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="font-mono text-[11px] bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded border border-stone-200">$1</code>');
  }

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title="AI Mentor"
        subtitle="Ask questions about your project and learn why its design and technologies are used."
      />

      {/* 2. Main Question Card */}
      <Card className="border-stone-200 border-l-4 border-l-red-600 bg-white">
        <form onSubmit={handleAskMentor} className="space-y-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="mentorQuestion"
              className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2"
            >
              <MentorIcon className="w-4 h-4 text-red-600" />
              Ask a question about your project
            </label>
            <span className="text-[11px] text-stone-400 font-sans">
              Context-aware answer based on Features 1–9
            </span>
          </div>

          <div className="relative">
            <textarea
              id="mentorQuestion"
              rows={3}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#fdfcf9] border border-stone-300 rounded focus:border-red-500 focus:ring-2 focus:ring-red-100 text-stone-900 placeholder:text-stone-400 focus:outline-none transition-colors"
              placeholder="e.g. Why are foreign keys used in my project? How does the frontend communicate with the backend? Explain the architecture..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
            />
            {question && (
              <button
                type="button"
                onClick={() => setQuestion('')}
                disabled={loading}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600 text-xs px-1 rounded"
                title="Clear question"
              >
                &times; Clear
              </button>
            )}
          </div>

          {/* Quick Question Suggestions */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
              Suggested Questions for Viva Prep:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_QUESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  disabled={loading}
                  className="text-[11px] font-medium px-2.5 py-1 rounded bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 hover:border-stone-300 transition-colors text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded text-xs">
              {error}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <span className="text-[11px] text-stone-400">
              Project: <span className="font-semibold text-stone-700">{project?.name || 'Selected Project'}</span>
            </span>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !question.trim()}
              className="min-w-[120px]"
            >
              {loading ? 'Thinking...' : 'Ask Mentor'}
            </Button>
          </div>
        </form>
      </Card>

      {/* 3. Loading State: "Thinking..." */}
      {loading && (
        <Card className="border-stone-200 bg-[#fdfcf9] p-6 text-center">
          <div className="flex flex-col items-center justify-center gap-3 py-4">
            <div className="w-8 h-8 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-stone-900">
                AI Mentor is thinking...
              </h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Analyzing your project database schema, REST API endpoints, system architecture, data flow steps, and CSE concepts to provide a tailored answer.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* 4. Mentor Answer Card */}
      {answer && !loading && (
        <Card className="border-stone-200 border-l-4 border-l-stone-800 bg-white shadow-xs">
          <div className="space-y-4">
            {/* Header: Question context */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded inline-block mb-1.5">
                  Mentor's Answer
                </span>
                <h3 className="text-sm sm:text-base font-bold text-stone-900">
                  {askedQuestion}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleCopyAnswer}
                className="shrink-0 text-xs text-stone-500 hover:text-stone-800 bg-stone-50 hover:bg-stone-100 border border-stone-200 px-2.5 py-1 rounded transition-colors flex items-center gap-1.5"
                title="Copy answer to clipboard"
              >
                {copied ? (
                  <>
                    <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied!</span>
                  </>
                ) : (
                  <span>Copy Answer</span>
                )}
              </button>
            </div>

            {/* Answer Content */}
            <div className="bg-[#fdfcf9] border border-stone-200/80 rounded p-4 sm:p-5">
              {renderFormattedAnswer(answer)}
            </div>

            {/* Follow-up / Navigation hint */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400">
              <span>Have another question? Select one above or type your own.</span>
              <button
                type="button"
                onClick={() => {
                  setQuestion('');
                  setAnswer(null);
                }}
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                Ask another question &rarr;
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* 5. Initial Empty State */}
      {!answer && !loading && (
        <div className="bg-white border border-stone-200 rounded-lg p-6 sm:p-8 text-center text-stone-600 space-y-3">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <MentorIcon className="w-5 h-5" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-stone-900">
            Your Personal Engineering & Viva Mentor
          </h3>
          <p className="text-xs text-stone-500 max-w-lg mx-auto leading-relaxed">
            The AI Mentor reads your project requirements, user stories, database tables, REST APIs, architecture components, data flow sequence, and CSE concepts to answer conceptual and implementation questions.
          </p>
          <p className="text-[11px] text-stone-400">
            Click any suggested question above or type your question in the box to get started.
          </p>
        </div>
      )}
    </div>
  );
}

export default AIMentor;
