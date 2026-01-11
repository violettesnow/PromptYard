import React from 'react';
import Logo from './Logo';

interface HeroProps {
  onSignIn: () => void;
}

const testimonials = [
  { name: "@dev_explorer", text: "The missing link in my AI workflow. PromptYard is essential." },
  { name: "Sarah J.", text: "Finally, a graveyard where prompts come back to life." },
  { name: "Marcus V.", text: "The search is incredible. Gemini indexing is a game changer." },
  { name: "@ai_enthusiast", text: "Saved me hours of scrolling through X bookmarks." },
  { name: "Chen W.", text: "Visual previews make finding specific prompts effortlessly." },
  { name: "@creative_mind", text: "The Google Search grounding adds so much context." },
  { name: "Alex Rivera", text: "Enterprise ready? It's my daily driver now." },
  { name: "@prompt_king", text: "Thinking mode tagging is surprisingly accurate." },
];

const Hero: React.FC<HeroProps> = ({ onSignIn }) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-obsidian-950 overflow-hidden font-sans selection:bg-amber-500/20">
      {/* Background Layering */}
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none"></div>
      
      {/* Intense Ambient Glow - Subtle branding light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1400px] aspect-square bg-amber-500/[0.02] rounded-full blur-[160px] pointer-events-none opacity-50"></div>

      {/* Navigation */}
      <nav className="w-full max-w-7xl mx-auto px-6 md:px-12 py-3 md:py-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-4 group cursor-pointer transition-opacity hover:opacity-80" onClick={() => window.location.reload()}>
          <Logo className="w-14 h-14" />
          <span className="text-sm font-display font-black tracking-[0.3em] text-white uppercase">PromptYard</span>
        </div>
        <div className="flex items-center gap-6 md:gap-12">
          <span className="hidden sm:block text-[8px] font-black tracking-[0.4em] uppercase text-obsidian-700">Vault v1.2.0</span>
          <button 
            onClick={onSignIn}
            className="text-[10px] font-black text-obsidian-500 hover:text-white transition-colors uppercase tracking-[0.3em]"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 md:px-12 z-10 text-center max-w-7xl mx-auto w-full pt-0 pb-8">
        <div className="flex flex-col items-center animate-fade-in w-full space-y-0.5 md:space-y-1">
          
          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-[-0.07em] text-white leading-[0.95] md:leading-[0.82] max-w-5xl mx-auto uppercase select-none relative mb-1 md:mb-2">
            DON'T BURY YOUR GOLD. <br />
            <span 
              className="bg-clip-text text-transparent bg-gradient-to-tr from-[#6d28d9] via-[#d946ef] to-[#f5d0fe] inline-block transition-all duration-700 transform hover:scale-105 cursor-default mt-1 md:mt-2 animate-fade-in"
              style={{
                filter: 'drop-shadow(0 -10px 40px rgba(217, 70, 239, 0.6))',
                textShadow: '0 0 45px rgba(217,70,239,1), 0 0 90px rgba(217,70,239,0.5), 0 -10px 60px rgba(217,70,239,0.7)'
              }}
            >
              MAP IT.
            </span>
          </h1>

          {/* Grouped CTA and Tagline */}
          <div className="flex flex-col items-center space-y-6 md:space-y-8 w-full relative">
            
            {/* Aurora Glow behind the CTA */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none opacity-40"></div>

            {/* CTA Button with Enhanced 3D Depth */}
            <div className="flex flex-col items-center opacity-0 animate-subtle-rise relative z-10" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              <button
                onClick={onSignIn}
                style={{
                  boxShadow: `
                    0 1px 1px rgba(255,255,255,0.4) inset,
                    0 10px 20px -5px rgba(0,0,0,0.3),
                    0 20px 40px -10px rgba(245, 158, 11, 0.5),
                    0 0 0 1px rgba(251, 191, 36, 0.4)
                  `
                }}
                className="group relative px-10 md:px-16 py-3.5 md:py-4 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 border border-white/20 text-obsidian-950 font-display font-black rounded-full text-lg md:text-2xl transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 active:scale-95 active:translate-y-0.5 uppercase tracking-[0.2em] md:tracking-[0.3em] overflow-hidden flex items-center gap-6"
              >
                {/* Internal Shimmer Layer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                
                {/* Logo with Glow */}
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shrink-0 drop-shadow-md">
                  <Logo className="w-full h-full" />
                </div>
                
                <span className="relative z-10 drop-shadow-sm">MAP YOUR PROMPTS — FREE</span>
              </button>
            </div>
            
            {/* Tagline - Refined width and wrapping to keep focus central */}
            <div className="opacity-0 animate-fade-in text-center w-full max-w-3xl px-4 relative z-10" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
              <p className="text-slate-400/80 text-base md:text-xl font-light tracking-tight leading-relaxed">
                <span className="block mb-2 md:mb-1">Stop losing your best AI insights in the noise.</span>
                <span className="block text-slate-500/80 text-sm md:text-lg">
                  Deep-scan your inbox, bookmarks, and Drive. <span className="font-black text-amber-500/90 ml-0.5">Consolidate your bullion.</span>
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 md:mt-24 flex flex-wrap justify-center items-center gap-8 md:gap-20 opacity-20 hover:opacity-100 transition-opacity duration-1000 cursor-default grayscale hover:grayscale-0 px-6">
           <div className="flex items-center gap-3">
             <span className="text-[9px] font-black tracking-[0.5em] uppercase text-obsidian-600">Verified by Stripe</span>
           </div>
           <div className="flex items-center gap-3">
             <span className="text-[9px] font-black tracking-[0.5em] uppercase text-obsidian-600">Secured via Cloudflare</span>
           </div>
           <div className="flex items-center gap-3">
             <span className="text-[9px] font-black tracking-[0.5em] uppercase text-obsidian-600">AI by Gemini 3</span>
           </div>
        </div>
      </main>

      {/* Testimonial Marquee */}
      <div className="w-full bg-obsidian-900/10 border-y border-white/[0.02] py-8 md:py-12 overflow-hidden marquee-container">
        <div className="flex whitespace-nowrap marquee-content animate-marquee">
          {testimonials.map((t, i) => (
            <div key={`t1-${i}`} className="inline-flex items-center gap-10 md:gap-14 mx-12 md:mx-28">
              <span className="text-amber-500/40 font-black text-[10px] uppercase tracking-[0.3em]">{t.name}</span>
              <span className="text-slate-600 font-normal text-sm md:text-base tracking-tight italic">"{t.text}"</span>
              <div className="w-[1px] h-8 bg-obsidian-800/40 ml-10 md:ml-14"></div>
            </div>
          ))}
          {/* Seamless loop duplicate */}
          {testimonials.map((t, i) => (
            <div key={`t2-${i}`} className="inline-flex items-center gap-10 md:gap-14 mx-12 md:mx-28">
              <span className="text-amber-500/40 font-black text-[10px] uppercase tracking-[0.3em]">{t.name}</span>
              <span className="text-slate-600 font-normal text-sm md:text-base tracking-tight italic">"{t.text}"</span>
              <div className="w-[1px] h-8 bg-obsidian-800/40 ml-10 md:ml-14"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between text-[9px] text-obsidian-700 font-black uppercase tracking-[0.5em] gap-8 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-20">
           <span className="flex items-center gap-3 md:gap-6">
             <div className="w-1.5 h-1.5 bg-amber-500 rounded-full opacity-50"></div>
             Vault Infrastructure Online
           </span>
           <span className="hidden md:block opacity-10">/</span>
           <span>&copy; 2025 PROMPT YARD</span>
        </div>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
           <a href="#" className="hover:text-white transition-colors">Privacy</a>
           <a href="#" className="hover:text-white transition-colors">Terms</a>
           <a href="#" className="hover:text-white transition-colors">Legal</a>
        </div>
      </footer>
    </div>
  );
};

export default Hero;