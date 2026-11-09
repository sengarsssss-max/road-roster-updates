import { useState } from 'react';
import { Mic, MicOff, Check, X, VolumeX } from 'lucide-react';
import { QUICK_ACTION_ICONS } from '@/components/quickActionIcons';
import { QUICK_ACTIONS, SAMPLE_CHAT, WAKE_NAME } from '@/data/sampleData';
import type { AssistantStatus } from '@/types/roadRoster';

const STATUS_LABEL: Record<AssistantStatus, string> = {
  listening: 'सुन रहा हूँ',
  waiting: 'बोलिए',
  sleeping: 'सोया हुआ',
};

const PENDING_CONFIRMATION = 'रीना को कॉल करूँ?';

export default function HomeScreen() {
  const [status, setStatus] = useState<AssistantStatus>('listening');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(PENDING_CONFIRMATION);

  const isListening = status !== 'sleeping';
  const recentChat = SAMPLE_CHAT.slice(-3);
  const chosenAction = QUICK_ACTIONS.find((action) => action.id === selectedAction) ?? null;

  const toggleListening = () => {
    setStatus((current) => (current === 'sleeping' ? 'listening' : 'sleeping'));
  };

  const answerConfirmation = () => {
    setPending(null);
    setStatus('waiting');
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400">बोलने के लिए कहें</p>
          <h1 className="text-2xl font-semibold text-zinc-50">{WAKE_NAME}</h1>
        </div>
        <span
          className={`rounded-full px-4 py-2 text-base font-medium transition-colors duration-300 ${
            isListening ? 'bg-orange-500/15 text-orange-300' : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          {STATUS_LABEL[status]}
        </span>
      </header>

      <section className="flex flex-col items-center gap-4 py-2">
        <div className="relative flex h-44 w-44 items-center justify-center">
          {status === 'listening' && (
            <span className="absolute inset-0 animate-ping rounded-full bg-orange-500/20" />
          )}
          <button
            type="button"
            onClick={toggleListening}
            aria-label={isListening ? 'सुनना बंद करें' : 'सुनना शुरू करें'}
            className={`relative flex h-36 w-36 items-center justify-center rounded-full shadow-lg transition-all duration-300 active:scale-95 ${
              isListening
                ? 'bg-orange-500 text-zinc-950 shadow-orange-500/30 hover:bg-orange-400'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {isListening ? <Mic className="h-14 w-14" /> : <MicOff className="h-14 w-14" />}
          </button>
        </div>
      </section>

      {pending && (
        <section className="rounded-3xl border border-orange-500/40 bg-zinc-900 p-5 shadow-lg">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-orange-400">पक्का करें</p>
          <p className="mb-5 text-2xl font-semibold text-zinc-50">{pending}</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={answerConfirmation}
              className="flex min-h-[72px] items-center justify-center gap-2 rounded-2xl bg-orange-500 text-2xl font-semibold text-zinc-950 transition-colors hover:bg-orange-400 active:scale-95"
            >
              <Check className="h-7 w-7" />
              हाँ
            </button>
            <button
              type="button"
              onClick={() => setPending(null)}
              className="flex min-h-[72px] items-center justify-center gap-2 rounded-2xl bg-zinc-800 text-2xl font-semibold text-zinc-100 transition-colors hover:bg-zinc-700 active:scale-95"
            >
              <X className="h-7 w-7" />
              ना
            </button>
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold text-zinc-200">काम चुनें</h2>
        <div className="grid grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = QUICK_ACTION_ICONS[action.icon];
            const isSelected = selectedAction === action.id;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => setSelectedAction(isSelected ? null : action.id)}
                aria-pressed={isSelected}
                className={`flex min-h-[96px] flex-col items-center justify-center gap-2 rounded-2xl border transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500/15 text-orange-300'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <Icon className="h-7 w-7" />
                <span className="text-xl">{action.label}</span>
              </button>
            );
          })}
        </div>
        {chosenAction && (
          <p className="mt-3 rounded-2xl bg-zinc-900 px-4 py-3 text-xl text-zinc-100">
            बोलें: <span className="text-orange-300">{chosenAction.example}</span>
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-zinc-200">हाल की बातचीत</h2>
        {recentChat.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.from === 'driver' ? 'justify-end' : 'justify-start'}`}
          >
            <p
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xl leading-relaxed ${
                message.from === 'driver'
                  ? 'rounded-br-md bg-orange-500 text-zinc-950'
                  : 'rounded-bl-md bg-zinc-800 text-zinc-100'
              }`}
            >
              {message.text}
            </p>
          </div>
        ))}
      </section>

      <button
        type="button"
        onClick={() => setStatus('sleeping')}
        className="flex min-h-[64px] items-center justify-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 text-2xl font-semibold text-zinc-100 transition-colors hover:border-orange-500 active:scale-95"
      >
        <VolumeX className="h-7 w-7 text-orange-400" />
        चुप
      </button>
    </div>
  );
}
