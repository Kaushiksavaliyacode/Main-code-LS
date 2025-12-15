import React from 'react';
import { Header } from './components/Header';
import { Calculator } from './components/Calculator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans text-slate-900 selection:bg-[#2563EB]/20 selection:text-[#2563EB]">
      <Header />
      <div className="flex-1 w-full pt-16">
        <Calculator />
      </div>
    </div>
  );
};

export default App;