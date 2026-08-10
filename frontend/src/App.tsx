import { useState, useEffect } from 'react';
import Cursor from './components/Cursor';
import Navigation from './components/Navigation';
import SignalField from './components/SignalField';
import ScrollProgress from './components/ScrollProgress';
import IntroSequence from './components/IntroSequence';
import SideProgress from './components/SideProgress';
import ClassifiedDossier from './components/ClassifiedDossier';
import Entry from './components/sections/Entry';
import Identity from './components/sections/Identity';
import Work from './components/sections/Work';
import Stack from './components/sections/Stack';
import Certificates from './components/sections/Certificates';
import Achievements from './components/sections/Achievements';
import Contact from './components/sections/Contact';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

function App() {
  const [introComplete, setIntroComplete] = useState(() => !!sessionStorage.getItem('intro-shown'));
  const [overdrive, setOverdrive] = useState(false);

  useEffect(() => {
    let inputSequence: string[] = [];

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      inputSequence.push(key);

      if (inputSequence.length > KONAMI_CODE.length) {
        inputSequence.shift();
      }

      const isMatch = KONAMI_CODE.every(
        (expectedKey, index) => inputSequence[index] === expectedKey.toLowerCase()
      );

      if (isMatch) {
        setOverdrive(true);
        inputSequence = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {!introComplete && (
        <IntroSequence onComplete={() => setIntroComplete(true)} />
      )}

      <div style={{ visibility: introComplete ? 'visible' : 'hidden' }}>
        <Cursor />
        <ScrollProgress />
        <SignalField />
        <SideProgress />

        {overdrive && (
          <ClassifiedDossier onClose={() => setOverdrive(false)} />
        )}

        <main style={{ position: 'relative', zIndex: 1 }}>
          <Entry />
          <Identity />
          <Work />
          <Stack />
          <Certificates />
          <Achievements />
          <Contact />
        </main>
        <Navigation />
      </div>
    </>
  );
}

export default App;
