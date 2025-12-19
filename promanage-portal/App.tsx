
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import AdminPanel from './components/AdminPanel';
import { AppView } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');

  return (
    <div className="min-h-screen">
      {/* Universal Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${view === 'landing' ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-slate-900 shadow-xl'}`}>
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            onClick={() => setView('landing')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl transition-colors ${view === 'landing' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-900'}`}>
              P
            </div>
            <span className={`text-2xl font-bold tracking-tight transition-colors ${view === 'landing' ? 'text-slate-900' : 'text-white'}`}>
              ProManage
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => setView('landing')}
              className={`font-semibold transition hover:text-indigo-600 ${view === 'landing' ? 'text-indigo-600' : 'text-slate-300'}`}
            >
              Public Home
            </button>
            <button 
              onClick={() => setView('admin')}
              className={`font-semibold px-6 py-2 rounded-full transition ${view === 'admin' ? 'bg-indigo-600 text-white' : 'bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
            >
              Admin Panel
            </button>
          </nav>
        </div>
      </header>

      {/* View Container */}
      <div className={view === 'landing' ? 'pt-0' : 'pt-0'}>
        {view === 'landing' ? <LandingPage /> : <AdminPanel />}
      </div>
    </div>
  );
};

export default App;
