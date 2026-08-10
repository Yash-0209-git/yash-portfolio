import { useState } from 'react';
import Cursor from './components/Cursor';
import Navigation from './components/Navigation';
import SignalField from './components/SignalField';
import ScrollProgress from './components/ScrollProgress';
import IntroSequence from './components/IntroSequence';
import SideProgress from './components/SideProgress';
import Entry from './components/sections/Entry';
import Identity from './components/sections/Identity';
import Work from './components/sections/Work';
import Stack from './components/sections/Stack';
import Certificates from './components/sections/Certificates';
import Achievements from './components/sections/Achievements';
import Contact from './components/sections/Contact';

function App() {
  const [introComplete, setIntroComplete] = useState(() => !!sessionStorage.getItem('intro-shown'));

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
