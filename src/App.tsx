import React, { lazy, Suspense, useState } from 'react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { WelcomeScreen } from './components/ui/WelcomeScreen';
import { soundManager } from './utils/sound';

const MuseumExperience = lazy(() => import('./MuseumExperience'));

export const App: React.FC = () => {
  const [visitorName, setVisitorName] = useState<string | null>(null);

  if (visitorName === null) {
    return <WelcomeScreen onEnter={setVisitorName} />;
  }

  return (
    <>
      <Suspense fallback={
        <main className="museum-loading" role="status">
          <LoaderCircle className="loading-spinner" size={32} aria-hidden="true" />
          <h1>Menyiapkan perjalananmu…</h1>
          <p>Selamat datang, {visitorName}. Museum segera terbuka.</p>
        </main>
      }>
        <MuseumExperience />
      </Suspense>
      <button className="museum-return" onClick={() => {
        soundManager.stopNarration();
        setVisitorName(null);
      }}>
        <ArrowLeft size={16} aria-hidden="true" />
        <span>Kembali<span className="museum-visitor"> · {visitorName}</span></span>
      </button>
    </>
  );
};

export default App;
