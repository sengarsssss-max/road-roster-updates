import { useState, type ReactNode } from 'react';
import { BookOpen, Link2, Mic, Shield, Volume2, Bell, Accessibility, Phone, MapPin } from 'lucide-react';
import Switch from '@/components/Switch';
import { QUICK_ACTIONS, WAKE_NAME } from '@/data/sampleData';
import type { VoiceOption } from '@/types/roadRoster';

const VOICE_OPTIONS: { id: VoiceOption; label: string }[] = [
  { id: 'calm', label: 'शांत' },
  { id: 'normal', label: 'सामान्य' },
  { id: 'quick', label: 'तेज़' },
];

const PERMISSIONS: { label: string; granted: boolean; icon: typeof Mic }[] = [
  { label: 'माइक्रोफ़ोन', granted: true, icon: Mic },
  { label: 'संपर्क', granted: true, icon: Link2 },
  { label: 'फ़ोन', granted: true, icon: Phone },
  { label: 'लोकेशन', granted: false, icon: MapPin },
  { label: 'सूचना पहुँच', granted: false, icon: Bell },
  { label: 'एक्सेसिबिलिटी', granted: false, icon: Accessibility },
];

type SettingsCardProps = {
  title: string;
  children: ReactNode;
};

function SettingsCard({ title, children }: SettingsCardProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="px-1 text-sm font-semibold uppercase tracking-wide text-zinc-400">{title}</h2>
      <div className="flex flex-col divide-y divide-zinc-800 rounded-3xl border border-zinc-800 bg-zinc-900">
        {children}
      </div>
    </section>
  );
}

export default function SettingsScreen() {
  const [voice, setVoice] = useState<VoiceOption>('calm');
  const [isLocked] = useState(true);
  const [vocabUpdated, setVocabUpdated] = useState(false);
  const [features, setFeatures] = useState<Record<string, boolean>>(
    () => Object.fromEntries(QUICK_ACTIONS.map((action) => [action.id, true])),
  );

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-50">सेटिंग</h1>
        <p className="text-sm text-zinc-400">अपनी पसंद बदलें</p>
      </header>

      <SettingsCard title="बुनियादी">
        <div className="flex items-center gap-4 p-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
            <Mic className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <p className="text-sm text-zinc-400">वेक नाम</p>
            <p className="text-xl font-semibold text-zinc-100">{WAKE_NAME}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
              <Volume2 className="h-6 w-6" />
            </span>
            <p className="text-xl font-semibold text-zinc-100">आवाज़</p>
          </div>
          <div role="radiogroup" aria-label="आवाज़ चुनें" className="grid grid-cols-3 gap-2 rounded-2xl bg-zinc-950 p-1">
            {VOICE_OPTIONS.map((option) => {
              const isSelected = voice === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setVoice(option.id)}
                  className={`min-h-[52px] rounded-xl text-xl font-medium transition-colors duration-200 ${
                    isSelected ? 'bg-orange-500 text-zinc-950' : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="WhatsApp">
        <div className="flex items-center gap-4 p-4">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              isLocked ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
            }`}
          >
            <Shield className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <p className="text-sm text-zinc-400">लॉक स्थिति</p>
            <p className="text-xl font-semibold text-zinc-100">{isLocked ? 'लॉक है' : 'नहीं मिला'}</p>
          </div>
        </div>
        <div className="p-4">
          <button
            type="button"
            className="min-h-[56px] w-full rounded-2xl border border-zinc-700 text-xl font-semibold text-zinc-100 transition-colors hover:border-orange-500 active:scale-95"
          >
            फिर से जोड़ें
          </button>
        </div>
      </SettingsCard>

      <SettingsCard title="अनुमतियाँ">
        {PERMISSIONS.map(({ label, granted, icon: Icon }) => (
          <div key={label} className="flex items-center gap-4 p-4">
            <Icon className="h-6 w-6 text-zinc-400" />
            <p className="flex-1 text-xl text-zinc-100">{label}</p>
            <span
              className={`rounded-full px-3 py-1 text-sm ${
                granted ? 'bg-emerald-500/15 text-emerald-300' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {granted ? 'मिली' : 'बाकी'}
            </span>
          </div>
        ))}
      </SettingsCard>

      <SettingsCard title="काम">
        {QUICK_ACTIONS.map((action) => (
          <div key={action.id} className="flex items-center gap-4 p-4">
            <p className="flex-1 text-xl text-zinc-100">{action.label}</p>
            <Switch
              label={`${action.label} चालू रखें`}
              checked={features[action.id]}
              onChange={(checked) => setFeatures((current) => ({ ...current, [action.id]: checked }))}
            />
          </div>
        ))}
      </SettingsCard>

      <SettingsCard title="शब्दावली">
        <div className="flex items-center gap-4 p-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
            <BookOpen className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <p className="text-xl font-semibold text-zinc-100">शब्दावली अपडेट</p>
            <p className="text-sm text-zinc-400">{vocabUpdated ? 'ताज़ा है' : 'नए शब्द जोड़ें'}</p>
          </div>
        </div>
        <div className="p-4">
          <button
            type="button"
            onClick={() => setVocabUpdated(true)}
            disabled={vocabUpdated}
            className="min-h-[56px] w-full rounded-2xl bg-orange-500 text-xl font-semibold text-zinc-950 transition-colors hover:bg-orange-400 active:scale-95 disabled:bg-zinc-800 disabled:text-zinc-500"
          >
            {vocabUpdated ? 'अपडेट हो गया' : 'अभी अपडेट करें'}
          </button>
        </div>
      </SettingsCard>
    </div>
  );
}
