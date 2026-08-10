import { useState, useEffect } from 'react';
import Cursor from './components/Cursor';
import Navigation from './components/Navigation';
import SignalField from './components/SignalField';
import ScrollProgress from './components/ScrollProgress';
import IntroSequence from './components/IntroSequence';
import SideProgress from './components/SideProgress';
import YashOSDesktop from './components/YashOSDesktop';
import Entry from './components/sections/Entry';
import Identity from './components/sections/Identity';
import Work from './components/sections/Work';
import Stack from './components/sections/Stack';
import Certificates from './components/sections/Certificates';
import Achievements from './components/sections/Achievements';
import Contact from './components/sections/Contact';

function App() {
  const [introComplete, setIntroComplete] = useState(() => !!sessionStorage.getItem('intro-shown'));
  const [overdrive, setOverdrive] = useState(false);

  useEffect(() => {
    let keyBuffer: string[] = [];

    const handleKeyDown = (e: KeyboardEvent) => {
      keyBuffer.push(e.key.toLowerCase());
      if (keyBuffer.length > 20) keyBuffer.shift();

      const keyStr = keyBuffer.join('');

      // Match Arrow key sequence or overdrive keyword
      if (
        keyStr.includes('overdrive') ||
        keyStr.includes('arrowuparrowuparrowdownarrowdownarrowleftarrowrightarrowleftarrowrightba')
      ) {
        setOverdrive(true);
        keyBuffer = [];
      }
    };

    const handleCustomTrigger = () => setOverdrive(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('trigger-overdrive', handleCustomTrigger);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('trigger-overdrive', handleCustomTrigger);
    };
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
          <YashOSDesktop onClose={() => setOverdrive(false)} />
        )}

        <main style={{ position: 'relative' }}>
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
