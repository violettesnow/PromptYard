
import React, { useState } from 'react';
import { Prompt } from '../types';

interface PromptCardProps {
  prompt: Prompt;
  onTagClick?: (tag: string) => void;
}

const XIcon = () => <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644z" /></svg>;
const DriveIcon = () => <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor"><path d="M7.71 3.502L1.15 14.784l3.75 6.463 6.546-11.282H7.71zM9.73 15.01l-3.323 5.737h13.186l3.323-5.737H9.73zM22.314 13.974L15.753 2.692h-7.5l6.561 11.282h7.5z" /></svg>;
const GmailIcon = () => <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor"><path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.387l-9 6.463-9-6.463V21H1.5C.65 21 0 20.35 0 19.5v-15c0-.425.162-.8.431-1.068C.7 3.16 1.075 3 1.5 3H2l10 7.143L22 3h.5c.425 0 .8.16 1.069.432.27.268.431.643.431 1.068z" /></svg>;

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onTagClick }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const SourceIcon = () => {
    switch (prompt.source_type) {
      case 'x': return <XIcon />;
      case 'drive': return <DriveIcon />;
      case 'gmail': return <GmailIcon />;
      case 'scanner': return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      );
      default: return null;
    }
  };

  return (
    <div className="group flex flex-col bg-obsidian-900/60 rounded-[32px] overflow-hidden border border-white/5 hover:border-brand-500/40 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 animate-subtle-rise h-full">
      <div className="aspect-[16/9] relative bg-obsidian-950 overflow-hidden">
        <img src={prompt.image_url} alt={prompt.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" loading="lazy" />
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={copy} className={`px-3 py-1.5 rounded-lg backdrop-blur-xl border font-display font-black text-[9px] uppercase tracking-widest transition-all ${copied ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-black/40 text-white border-white/10 hover:bg-black/60'}`}>
            {copied ? 'Captured' : 'Copy'}
          </button>
        </div>
        <div className="absolute bottom-4 left-4 p-2 bg-brand-600/20 backdrop-blur-2xl rounded-xl text-brand-400 border border-brand-500/30 shadow-2xl scale-90">
           <SourceIcon />
        </div>
      </div>

      <div className="p-6 space-y-5 flex-1 flex flex-col">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-white text-lg leading-tight tracking-tight line-clamp-2 uppercase">{prompt.title}</h3>
          <div className="flex items-center gap-2 text-[8px] font-display font-black text-obsidian-600 uppercase tracking-[0.2em]">
             <div className="w-1 h-1 bg-obsidian-700 rounded-full"></div>
             {new Date(prompt.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
        </div>
        
        {prompt.analysis && (
          <div className="bg-brand-500/5 p-4 rounded-xl border border-brand-500/10 text-[11px] font-sans text-obsidian-300 leading-relaxed">
            <span className="block text-[7px] font-display font-black text-brand-500 uppercase tracking-[0.2em] mb-1">Agentic Analysis</span>
            {prompt.analysis}
          </div>
        )}

        <div className="flex-1 relative">
          <p className="text-[12px] text-obsidian-400 line-clamp-3 font-mono leading-relaxed bg-obsidian-950/30 p-3 rounded-lg border border-white/5">
            {prompt.content}
          </p>
        </div>

        <div className="pt-4 mt-auto flex items-center justify-between border-t border-white/5">
          <div className="flex gap-1.5 overflow-hidden">
            {prompt.tags.slice(0, 2).map(t => (
              <span 
                key={t} 
                onClick={() => onTagClick?.(t)}
                className="px-2 py-0.5 bg-obsidian-800 hover:bg-obsidian-700 cursor-pointer rounded-md text-[7px] font-display font-black text-obsidian-500 hover:text-white uppercase tracking-wider transition-colors"
              >
                #{t}
              </span>
            ))}
          </div>
          {prompt.source_url && prompt.source_url.startsWith('http') && (
            <a href={prompt.source_url} target="_blank" className="p-1.5 bg-obsidian-800 hover:bg-brand-600 rounded-lg transition-all border border-white/5 group/link">
               <svg className="w-3 h-3 text-obsidian-500 group-hover/link:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
