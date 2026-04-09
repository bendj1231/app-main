import React, { useState } from 'react';
import { RotateCw, ExternalLink, ArrowLeft, ArrowRight, ShieldAlert, Globe } from 'lucide-react';

const WebBrowser: React.FC = () => {
  const DEFAULT_URL = 'https://wingmentorapp.vercel.app/';
  const [url, setUrl] = useState(DEFAULT_URL);
  const [currentSrc, setCurrentSrc] = useState(DEFAULT_URL);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = url;
    if (!target.startsWith('http')) {
      target = 'https://' + target;
    }
    setCurrentSrc(target);
    setUrl(target);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
      {/* Toolbar */}
      <div className="flex items-center space-x-2 p-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center space-x-1 mr-2">
           <div className="p-2 bg-slate-200 rounded-full text-slate-400 cursor-not-allowed"><ArrowLeft size={16} /></div>
           <div className="p-2 bg-slate-200 rounded-full text-slate-400 cursor-not-allowed"><ArrowRight size={16} /></div>
           <button onClick={() => setCurrentSrc(url)} className="p-2 text-slate-600 hover:bg-slate-200 rounded-full transition-colors"><RotateCw size={16} /></button>
        </div>
        
        <form onSubmit={handleNavigate} className="flex-1 relative">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             {url.includes('wingmentor') ? <Globe size={14} className="text-sky-500" /> : <ShieldAlert size={14} className="text-slate-400" />}
           </div>
           <input 
             type="text" 
             value={url}
             onChange={(e) => setUrl(e.target.value)}
             className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-mono text-slate-600"
           />
        </form>

        <a 
          href={currentSrc} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-3 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm font-medium shadow-sm"
        >
          <ExternalLink size={16} />
          <span className="hidden sm:inline">Open Tab</span>
        </a>
      </div>

      {/* Viewport */}
      <div className="flex-1 relative bg-slate-100 w-full h-full">
        {currentSrc.includes('t.me') ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white z-20">
              <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-4">
                <Globe size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">WingMentor Community Chat</h3>
              <p className="text-slate-500 max-w-md mb-6">
                Join our Telegram group to connect with other student pilots and instructors. 
                Due to Telegram's security settings, the chat cannot be displayed directly inside this window.
              </p>
              <a 
                href={currentSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all shadow-md font-semibold flex items-center space-x-2"
              >
                <ExternalLink size={18} />
                <span>Join Group on Telegram</span>
              </a>
           </div>
        ) : (
          <>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-0">
               <p>Loading external content...</p>
               <p className="text-xs mt-2">If content doesn't load, use the "Open Tab" button.</p>
            </div>
            <iframe 
              src={currentSrc} 
              title="Browser View"
              className="absolute inset-0 w-full h-full border-0 z-10 bg-white"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default WebBrowser;