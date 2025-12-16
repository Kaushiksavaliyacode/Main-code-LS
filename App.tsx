import React, { useState } from 'react';
import { Header } from './components/Header';
import { Calculator } from './components/Calculator';

const App: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans text-slate-900 selection:bg-[#2563EB]/20 selection:text-[#2563EB]">
      <Header onOpenSettings={() => setShowSettings(true)} />
      <div className="flex-1 w-full pt-16">
        <Calculator 
          showSettings={showSettings}
          onCloseSettings={() => setShowSettings(false)}
        />
      </div>
    </div>
  );
};

export default App;