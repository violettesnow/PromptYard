
import React, { useState } from 'react';
import { ConnectedSource } from '../types';

interface SourceAuthProps {
  onComplete: () => void;
}

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644z" />
  </svg>
);

const DriveIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M7.71 3.502L1.15 14.784l3.75 6.463 6.546-11.282H7.71zM9.73 15.01l-3.323 5.737h13.186l3.323-5.737H9.73zM22.314 13.974L15.753 2.692h-7.5l6.561 11.282h7.5z" />
  </svg>
);

const GmailIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.387l-9 6.463-9-6.463V21H1.5C.65 21 0 20.35 0 19.5v-15c0-.425.162-.8.431-1.068C.7 3.16 1.075 3 1.5 3H2l10 7.143L22 3h.5c.425 0 .8.16 1.069.432.27.268.431.643.431 1.068z" />
  </svg>
);

const SourceAuth: React.FC<SourceAuthProps> = ({ onComplete }) => {
  const [sources, setSources] = useState<ConnectedSource[]>([
    { id: 'x', name: 'X (Twitter)', connected: false },
    { id: 'google_drive', name: 'Google Drive', connected: false },
    { id: 'gmail', name: 'Gmail', connected: false },
  ]);
  const [loading, setLoading] = useState<string | null>(null);

  const toggleSource = (id: string) => {
    setLoading(id);
    // Simulate OAuth flow
    setTimeout(() => {
      setSources(prev => prev.map(s => s.id === id ? { ...s, connected: !s.connected } : s));
      setLoading(null);
    }, 1200);
  };

  const connectedCount = sources.filter(s => s.connected).length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-obsidian-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-2xl w-full space-y-12 z-10">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">
            Grant Access to <span className="text-brand-500">Your Intelligence</span>
          </h2>
          <p className="text-obsidian-400 text-lg max-w-lg mx-auto font-medium">
            Connect your stash sources. Gemini will automatically index prompts from your bookmarks, drive files, and starred emails.
          </p>
        </div>

        <div className="grid gap-6">
          {sources.map((source) => (
            <div 
              key={source.id}
              className={`group relative p-6 rounded-[32px] border-2 transition-all cursor-pointer overflow-hidden ${source.connected ? 'bg-brand-600/10 border-brand-500/50' : 'bg-obsidian-900 border-white/5 hover:border-white/10'}`}
              onClick={() => toggleSource(source.id)}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${source.connected ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/40' : 'bg-obsidian-800 text-obsidian-500 group-hover:bg-obsidian-700'}`}>
                    {source.id === 'x' && <XIcon />}
                    {source.id === 'google_drive' && <DriveIcon />}
                    {source.id === 'gmail' && <GmailIcon />}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white">{source.name}</h3>
                    <p className="text-sm text-obsidian-500">
                      {source.connected ? 'Access granted and syncing' : `Connect your ${source.name} account`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {loading === source.id ? (
                    <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : source.connected ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/30 text-[10px] font-black uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      Connected
                    </div>
                  ) : (
                    <div className="px-6 py-2.5 bg-obsidian-800 text-obsidian-300 rounded-full border border-white/5 text-[10px] font-black uppercase tracking-widest group-hover:bg-white group-hover:text-obsidian-950 transition-all">
                      Grant Access
                    </div>
                  )}
                </div>
              </div>
              
              {/* Animated progress bar for connected states */}
              {source.connected && (
                <div className="absolute bottom-0 left-0 h-1 bg-brand-500/30 w-full overflow-hidden">
                  <div className="h-full bg-brand-500 w-1/3 animate-shimmer"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col items-center gap-6">
          <button
            onClick={onComplete}
            disabled={connectedCount === 0}
            className="group relative px-16 py-6 bg-white text-obsidian-950 disabled:bg-obsidian-800 disabled:text-obsidian-600 rounded-[32px] text-2xl font-black transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-white/5 uppercase"
          >
            Enter the Yard
          </button>
          
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-obsidian-700">
            {connectedCount === 0 ? 'Select at least one source to continue' : `${connectedCount} Intelligence Sources Verified`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SourceAuth;
