
import React from 'react';

interface HeroProps {
  onSignIn: () => void;
}

const GhostIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C8.686 2 6 4.686 6 8v9c0 1.105.895 2 2 2h8c1.105 0 2-.895 2-2V8c0-3.314-2.686-6-6-6zm-3 8c-.828 0-1.5-.672-1.5-1.5S8.172 7 9 7s1.5.672 1.5 1.5S9.828 10 9 10zm6 0c-.828 0-1.5-.672-1.5-1.5S14.172 7 15 7s1.5.672 1.5 1.5S15.828 10 15 10zM8 19v1.5a1 1 0 0 0 1.707.707L10.414 20l1.293 1.293a1 1 0 0 0 1.414 0L14.414 20l.707.707A1 1 0 0 0 16.828 20V19H8z" />
  </svg>
);

const testimonials = [
  { name: "@dev_explorer", text: "The missing link in my AI workflow. PromptYard is essential." },
  { name: "Sarah J.", text: "Finally, a graveyard where prompts come back to life." },
  { name: "Marcus V.", text: "The search is incredible. Gemini indexing is a game changer." },
  { name: "@ai_enthusiast", text: "Saved me hours of scrolling through X bookmarks." },
  { name: "Chen W.", text: "Visual previews make finding specific prompts effortless." },
  { name: "@creative_mind", text: "The Google Search grounding adds so much context." },
  { name: "Alex Rivera", text: "Enterprise ready? It's my daily driver now." },
  { name: "@prompt_king", text: "Thinking mode tagging is surprisingly accurate." },
];

const Hero: React.FC<HeroProps> = ({ onSignIn }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center bg-obsidian-950 overflow-hidden font-sans">
      {/* Sophisticated Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-brand-600/5 rounded-full blur-[160px] pointer-events-none opacity-60"></div>
      
      {/* Professional Navigation */}
      <nav className="w-full max-w-7xl px-8 py-8 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-600 rounded-xl shadow-2xl shadow-brand-500/20 flex items-center justify-center text-white">
            <GhostIcon className="w-5 h-5" />
          </div>
          <span className="text-lg font-display font-black tracking-tighter text-white">PROMPT YARD</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden md:block text-[9px] font-display font-bold tracking-[0.3em] uppercase text-obsidian-600">Enterprise Ready</span>
          <button 
            onClick={onSignIn}
            className="text-xs font-display font-bold text-obsidian-400 hover:text-white transition-colors tracking-wide"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Main Impact Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 z-10 text-center max-w-4xl space-y-10 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter text-white leading-[1.1] md:leading-[1.05] max-w-4xl mx-auto">
            Inboxes and bookmarks are where great prompts go to die.
          </h1>
          <p className="text-obsidian-400 text-sm md:text-lg font-medium tracking-tight max-w-2xl mx-auto">
            Rescue your AI intelligence from the scroll. Instant searchable vault for X, Drive, and Gmail.
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <button
            onClick={onSignIn}
            className="px-12 py-5 bg-white text-obsidian-950 font-display font-black rounded-full text-xl md:text-2xl transition-all transform hover:scale-105 active:scale-95 ring-4 ring-brand-500/20 shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_35px_rgba(139,92,246,0.7)] hover:ring-brand-500/40 uppercase tracking-tighter"
          >
            SAVE YOURS — FREE
          </button>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-30 grayscale hover:opacity-50 transition-all cursor-default pt-6">
           <div className="flex items-center gap-2">
             <span className="text-[10px] font-display font-black tracking-widest uppercase">Verified by Stripe</span>
           </div>
           <div className="flex items-center gap-2">
             <span className="text-[10px] font-display font-black tracking-widest uppercase">Secured via Cloudflare</span>
           </div>
           <div className="flex items-center gap-2">
             <span className="text-[10px] font-display font-black tracking-widest uppercase">AI by Gemini</span>
           </div>
        </div>
      </section>

      {/* Simplified Status Footer */}
      <footer className="w-full max-w-7xl px-8 py-10 flex flex-col md:flex-row items-center justify-between border-t border-white/5 text-[9px] text-obsidian-600 font-display font-bold uppercase tracking-[0.25em] gap-6">
        <div className="flex items-center gap-4">
           <span className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
             Yard Online
           </span>
           <span className="text-obsidian-800">|</span>
           <span>&copy; 2025 PROMPT YARD</span>
        </div>
        <div className="flex gap-6">
           <a href="#" className="hover:text-white transition-colors">Privacy</a>
           <a href="#" className="hover:text-white transition-colors">Terms</a>
           <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </footer>

      {/* Marquee Testimonials */}
      <div className="w-full bg-obsidian-900/50 border-t border-white/5 py-5 overflow-hidden marquee-container">
        <div className="flex whitespace-nowrap marquee-content animate-marquee">
          {testimonials.map((t, i) => (
            <div key={`t1-${i}`} className="inline-flex items-center gap-4 mx-10">
              <span className="text-brand-400 font-display font-black text-[10px] uppercase tracking-[0.2em]">{t.name}</span>
              <span className="text-obsidian-300 font-sans font-medium text-xs opacity-70">"{t.text}"</span>
              <div className="w-1 h-1 bg-obsidian-700 rounded-full ml-3"></div>
            </div>
          ))}
          {testimonials.map((t, i) => (
            <div key={`t2-${i}`} className="inline-flex items-center gap-4 mx-10">
              <span className="text-brand-400 font-display font-black text-[10px] uppercase tracking-[0.2em]">{t.name}</span>
              <span className="text-obsidian-300 font-sans font-medium text-xs opacity-70">"{t.text}"</span>
              <div className="w-1 h-1 bg-obsidian-700 rounded-full ml-3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
