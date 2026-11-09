import { ClipboardList, Home, Settings } from 'lucide-react';
import type { Tab } from '@/types/roadRoster';

const TABS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'होम', icon: Home },
  { id: 'log', label: 'लॉग', icon: ClipboardList },
  { id: 'settings', label: 'सेटिंग', icon: Settings },
];

type BottomNavProps = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-800 bg-zinc-900/95 backdrop-blur">
      <ul className="mx-auto grid max-w-md grid-cols-3 px-2 pb-[env(safe-area-inset-bottom)]">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-current={isActive ? 'page' : undefined}
                className="flex min-h-[64px] w-full flex-col items-center justify-center gap-1 rounded-2xl transition-colors duration-200 active:scale-95"
              >
                <span
                  className={`flex h-9 w-16 items-center justify-center rounded-full transition-colors duration-200 ${
                    isActive ? 'bg-orange-500/15 text-orange-400' : 'text-zinc-400'
                  }`}
                >
                  <Icon className="h-6 w-6" strokeWidth={isActive ? 2.25 : 1.75} />
                </span>
                <span
                  className={`text-sm ${isActive ? 'font-semibold text-orange-400' : 'text-zinc-400'}`}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
