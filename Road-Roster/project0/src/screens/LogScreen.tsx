import { useState } from 'react';
import { Flag } from 'lucide-react';
import { HEARD_ENTRIES, WHATSAPP_ACTIONS } from '@/data/sampleData';
import type { IgnoreReason } from '@/types/roadRoster';

const REASON_LABEL: Record<IgnoreReason, string> = {
  no_wake_name: 'वेक नाम नहीं था',
  unknown_word: 'अनजान शब्द',
  low_confidence: 'कम भरोसा',
  wrong_transcription: 'गलत लिखावट',
};

const REASON_TONE: Record<IgnoreReason, string> = {
  no_wake_name: 'bg-teal-500/15 text-teal-300',
  unknown_word: 'bg-sky-500/15 text-sky-300',
  low_confidence: 'bg-amber-500/15 text-amber-300',
  wrong_transcription: 'bg-rose-500/15 text-rose-300',
};

export default function LogScreen() {
  const [reported, setReported] = useState<Set<string>>(new Set());

  const heard = HEARD_ENTRIES.filter((entry) => entry.ignoredReason === null);
  const ignored = HEARD_ENTRIES.filter((entry) => entry.ignoredReason !== null);

  const reportSentence = (id: string) => {
    setReported((current) => new Set(current).add(id));
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-50">लॉग</h1>
        <p className="text-sm text-zinc-400">जो सुना और जो छोड़ा</p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-zinc-200">पिछला सुना</h2>
        {heard.map((entry) => (
          <article key={entry.id} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xl leading-relaxed text-zinc-100">{entry.sentence}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">
                काम हुआ
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-zinc-200">अनसुना किया</h2>
        {ignored.map((entry) => {
          if (!entry.ignoredReason) return null;
          const isReported = reported.has(entry.id);
          return (
            <article key={entry.id} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xl leading-relaxed text-zinc-100">{entry.sentence}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-sm ${REASON_TONE[entry.ignoredReason]}`}
                >
                  {REASON_LABEL[entry.ignoredReason]}
                </span>
                <button
                  type="button"
                  onClick={() => reportSentence(entry.id)}
                  disabled={isReported}
                  aria-label="यह वाक्य रिपोर्ट करें"
                  className={`flex h-12 min-w-12 items-center justify-center gap-2 rounded-2xl px-3 transition-colors active:scale-95 ${
                    isReported
                      ? 'bg-zinc-800 text-zinc-500'
                      : 'bg-orange-500/15 text-orange-300 hover:bg-orange-500/25'
                  }`}
                >
                  <Flag className="h-5 w-5" />
                  <span className="text-sm">{isReported ? 'भेजा' : 'रिपोर्ट'}</span>
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-zinc-200">WhatsApp के काम</h2>
        {WHATSAPP_ACTIONS.map((item) => (
          <article key={item.id} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">{item.time}</span>
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300">
                {item.profile}
              </span>
            </div>
            <p className="mt-2 text-xl text-zinc-100">{item.action}</p>
            <p className="mt-1 break-all font-mono text-xs text-zinc-500">{item.packageName}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
