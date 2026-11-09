import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import HomeScreen from '@/screens/HomeScreen';
import LogScreen from '@/screens/LogScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import type { Tab } from '@/types/roadRoster';

function App() {
  const [tab, setTab] = useState<Tab>('home');

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 font-sans">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-28 pt-6">
        {tab === 'home' && <HomeScreen />}
        {tab === 'log' && <LogScreen />}
        {tab === 'settings' && <SettingsScreen />}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

export default App;
