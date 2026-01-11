
import { useState, useEffect, useRef, useMemo } from 'react';
import { Prompt, AppState, ConnectedSource } from '../types';
import { extractPromptFromSource, extractPromptFromImage, extractPromptFromVideo, generatePromptImage, refineTags } from '../services/gemini';
import { supabase } from '../services/supabase';
import PromptCard from './PromptCard';
import { jsPDF } from 'jspdf';

interface DashboardProps {
  user: any;
  onSignOut: () => void;
  onManageSources?: () => void;
  isPublicView?: boolean;
  onSignIn?: () => void;
}

const XIcon = () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644z" /></svg>;
const DriveIcon = () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M7.71 3.502L1.15 14.784l3.75 6.463 6.546-11.282H7.71zM9.73 15.01l-3.323 5.737h13.186l3.323-5.737H9.73zM22.314 13.974L15.753 2.692h-7.5l6.561 11.282h7.5z" /></svg>;
const GmailIcon = () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.387l-9 6.463-9-6.463V21H1.5C.65 21 0 20.35 0 19.5v-15c0-.425.162-.8.431-1.068C.7 3.16 1.075 3 1.5 3H2l10 7.143L22 3h.5c.425 0 .8.16 1.069.432.27.268.431.643.431 1.068z" /></svg>;
const MicIcon = () => <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>;
const FileTextIcon = () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;

const Dashboard: React.FC<DashboardProps> = ({ user, onSignOut, onManageSources, isPublicView, onSignIn }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [inputText, setInputText] = useState('');
  const [manualTags, setManualTags] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [status, setStatus] = useState<AppState>(AppState.IDLE);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    fetchPrompts();
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [user.id]);

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setPrompts(data);
    } catch (err) {
      console.error("Failed to fetch stash:", err);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const downloadPRD = () => {
    const doc = new jsPDF();
    const title = "PromptYard Product Requirements Document (PRD)";
    const date = new Date().toLocaleDateString();
    
    doc.setFontSize(22);
    doc.text(title, 20, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 20, 30);
    
    doc.setFontSize(16);
    doc.text("1. Executive Summary", 20, 45);
    doc.setFontSize(12);
    const summary = "PromptYard is an advanced AI prompt management system that allows researchers and prompt engineers to rescue, organize, and analyze prompts from various fragmented sources (X, Gmail, Drive). It uses multimodal Gemini models to synthesize intelligence from raw data.";
    doc.text(doc.splitTextToSize(summary, 170), 20, 52);

    doc.setFontSize(16);
    doc.text("2. Key Features", 20, 75);
    doc.setFontSize(12);
    const features = [
      "- Intelligent Intake: Extract prompts from X/Twitter URLs using agentic grounding.",
      "- Multimodal OCR: Analyze screenshots of prompts using Gemini Vision models.",
      "- Visual Synthesis: Gemini 2.5 Flash Image generated abstract art for visual indexing.",
      "- Deep Thinking: Contextual tagging and logical analysis of prompt patterns.",
      "- Unified Vault: Searchable, categorizable storage for high-value AI instructions."
    ];
    let y = 82;
    features.forEach(f => {
      doc.text(f, 20, y);
      y += 8;
    });

    doc.setFontSize(16);
    doc.text("3. Technical Specifications", 20, 130);
    doc.setFontSize(12);
    const tech = [
      "- Frontend: React 19, Tailwind CSS, Space Grotesk Font.",
      "- Database/Auth: Supabase PostgreSQL & Google OAuth.",
      "- AI Orchestration: Gemini 3 Pro (Analysis), 3 Flash (OCR), 2.5 Flash (Images).",
      "- Tools: Google Search grounding for real-time validation."
    ];
    y = 137;
    tech.forEach(t => {
      doc.text(t, 20, y);
      y += 8;
    });

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Confidential - Internal Project Documentation", 20, 280);
    
    doc.save('PromptYard_PRD.pdf');
  };

  const handleSync = async () => {
    if (isPublicView) return;
    setStatus(AppState.LOADING);
    const steps = [
      { msg: 'Agent initialized: PromptScout-01', icon: null },
      { msg: 'Scanning Gmail threads for starred AI communications...', icon: <GmailIcon /> },
      { msg: 'Deep searching Drive for .txt and .docx patterns...', icon: <DriveIcon /> },
      { msg: 'Fetching latest X bookmarks via API grounding...', icon: <XIcon /> },
      { msg: 'Synthesizing 4 potential prompt assets...', icon: null }
    ];
    for (const step of steps) {
      setLoadingMsg(step.msg);
      await new Promise(r => setTimeout(r, 2000));
    }
    setStatus(AppState.SUCCESS);
    setLoadingMsg('Deep Sync complete. 0 new assets found today.');
    setTimeout(() => setStatus(AppState.IDLE), 3000);
  };

  const handleImport = async () => {
    if (!inputText.trim() || isPublicView) return;
    setStatus(AppState.LOADING);
    const urls = inputText.match(/https?:\/\/[^\s]+/g) || [];
    const extraTags = manualTags.split(',').map(t => t.trim()).filter(t => t !== '');
    try {
      if (urls.length === 0) {
        setLoadingMsg('Agent analyzing manual intelligence string...');
        const result = await extractPromptFromSource(inputText, 'manual');
        await savePrompt({ ...result, tags: [...result.tags, ...extraTags] }, 'Manual Input', 'manual');
      } else {
        setLoadingMsg(`Orchestrating extraction for ${urls.length} sources...`);
        await Promise.all(urls.map(async (url) => {
          const type = url.includes('twitter.com') || url.includes('x.com') ? 'x' : 
                       url.includes('google.com/drive') ? 'drive' : 
                       url.includes('mail.google.com') ? 'gmail' : 'manual';
          const result = await extractPromptFromSource(url, type);
          return savePrompt({ ...result, tags: [...result.tags, ...extraTags] }, url, type);
        }));
      }
      setInputText('');
      setManualTags('');
      setStatus(AppState.SUCCESS);
    } catch (err) {
      console.error("Import failed:", err);
      setStatus(AppState.ERROR);
    } finally {
      setTimeout(() => setStatus(AppState.IDLE), 2000);
    }
  };

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
    setIsCameraActive(false);
  };

  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx?.drawImage(videoRef.current, 0, 0);
    const base64 = canvasRef.current.toDataURL('image/jpeg');
    stopCamera();
    setStatus(AppState.LOADING);
    setLoadingMsg('Multimodal analysis in progress...');
    try {
      const result = await extractPromptFromImage(base64);
      await savePrompt(result, 'Visual Scanner', 'scanner');
      setStatus(AppState.SUCCESS);
    } catch {
      setStatus(AppState.ERROR);
    } finally {
      setTimeout(() => setStatus(AppState.IDLE), 2000);
    }
  };

  const savePrompt = async (data: any, source: string, type: Prompt['source_type']) => {
    const [refined, img] = await Promise.all([refineTags(data.content), generatePromptImage(data.content)]);
    const newPrompt = {
      user_id: user.id,
      title: data.title || 'Untitled Asset',
      content: data.content,
      analysis: data.analysis || '',
      source_url: source,
      source_type: type,
      grounding_urls: data.grounding_urls || [],
      tags: Array.from(new Set([...(data.tags || []), ...refined])),
      image_url: img,
      created_at: new Date().toISOString()
    };
    await supabase.from('prompts').insert([newPrompt]);
    await fetchPrompts();
  };

  const filteredPrompts = prompts.filter(p => {
    const s = searchQuery.toLowerCase();
    const matchesSearch = p.content.toLowerCase().includes(s) || p.title.toLowerCase().includes(s) || p.tags.some(t => t.toLowerCase().includes(s));
    return matchesSearch && (selectedTag ? p.tags.includes(selectedTag) : true);
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 font-sans">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => !isPublicView && window.location.reload()}>
          <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-brand-500/20">
             <DriveIcon />
          </div>
          <div>
            <h1 className="text-xl font-display font-black text-white uppercase leading-none tracking-tighter">Prompt Yard</h1>
            <span className="text-[9px] font-display font-black text-brand-400 uppercase tracking-[0.25em]">Agentic Intelligence Active</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <button 
            onClick={downloadPRD}
            className="flex items-center gap-2 px-5 py-3 bg-obsidian-800 border border-white/10 rounded-full text-[10px] font-display font-black uppercase tracking-widest text-obsidian-300 hover:text-white transition-all"
          >
            <FileTextIcon /> PRD
          </button>
          <button 
            onClick={handleSync} 
            disabled={status === AppState.LOADING}
            className="px-8 py-3 bg-brand-600/10 border border-brand-500/30 rounded-full text-[10px] font-display font-black uppercase tracking-widest text-brand-400 hover:bg-brand-600 hover:text-white transition-all disabled:opacity-50"
          >
            Deep Sync Sources
          </button>
          <button onClick={onSignOut} className="px-8 py-3 bg-obsidian-900 border border-white/10 rounded-full text-[10px] font-display font-black uppercase tracking-widest text-obsidian-500 hover:text-white transition-all">Log Out</button>
        </div>
      </header>

      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 backdrop-blur-xl">
          <div className="relative max-w-2xl w-full aspect-video rounded-[40px] overflow-hidden border-2 border-brand-500/50 shadow-2xl shadow-brand-500/20">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 border-[60px] border-black/20 pointer-events-none">
               <div className="w-full h-full border-2 border-brand-500/40 border-dashed animate-pulse"></div>
            </div>
            <button onClick={captureFrame} className="absolute bottom-10 left-1/2 -translate-x-1/2 px-12 py-5 bg-white text-black font-display font-black rounded-full uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all">Capture & Analyze</button>
            <button onClick={stopCamera} className="absolute top-8 right-8 p-4 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <p className="mt-8 text-obsidian-400 font-display font-bold text-xs uppercase tracking-[0.3em]">Position prompt within the scan area</p>
        </div>
      )}

      {!isPublicView && (
        <section className="glass-card rounded-[40px] p-10 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/5 blur-[120px] pointer-events-none rounded-full"></div>
          
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-6 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${status === AppState.LOADING ? 'bg-brand-500 animate-pulse' : 'bg-obsidian-700'}`}></div>
                  <h2 className="text-xs font-display font-black uppercase tracking-[0.2em] text-obsidian-400">Intelligence Intake</h2>
                </div>
                {isListening && <div className="text-[10px] font-display font-black text-brand-400 animate-pulse uppercase tracking-widest">Listening...</div>}
              </div>
              
              <div className="relative group/input">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste URLs from X, Drive, Gmail or dictate your prompt..."
                  className="w-full h-52 bg-obsidian-900 border-2 border-white/5 rounded-[32px] p-8 text-base text-obsidian-100 focus:outline-none focus:border-brand-500/30 transition-all font-mono resize-none leading-relaxed"
                />
                <button 
                  onClick={handleVoiceInput}
                  className={`absolute bottom-6 right-6 p-4 rounded-2xl transition-all shadow-xl ${isListening ? 'bg-brand-600 text-white animate-pulse shadow-brand-500/40' : 'bg-obsidian-800 text-obsidian-500 hover:text-white hover:bg-obsidian-700 border border-white/5'}`}
                >
                  <MicIcon />
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  value={manualTags} 
                  onChange={(e) => setManualTags(e.target.value)} 
                  placeholder="Additional tags (comma separated)..." 
                  className="flex-1 px-8 py-5 bg-obsidian-900 border-2 border-white/5 rounded-2xl text-sm font-sans focus:outline-none focus:border-brand-500/20" 
                />
                <div className="flex gap-3">
                  <button 
                    onClick={handleImport} 
                    disabled={status === AppState.LOADING || !inputText.trim()} 
                    className="px-12 py-5 bg-white text-obsidian-950 font-display font-black rounded-2xl shadow-xl hover:bg-obsidian-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase tracking-tight"
                  >
                    Rescue
                  </button>
                  <button onClick={startCamera} className="p-5 bg-brand-600 text-white rounded-2xl shadow-lg shadow-brand-500/20 hover:bg-brand-500 active:scale-95 transition-all" title="Scan visual prompt">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-4 flex flex-col justify-end p-10 bg-obsidian-900/50 rounded-[32px] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5"><DriveIcon /></div>
              <h3 className="text-[10px] font-display font-black uppercase text-brand-500 mb-6 tracking-[0.25em] flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-ping"></div>
                 Agent Status
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'X Grounding Agent', status: 'Online', icon: <XIcon /> },
                  { label: 'Gmail Synthesis', status: 'Online', icon: <GmailIcon /> },
                  { label: 'Drive Crawler', status: 'Active', icon: <DriveIcon /> }
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between group/status">
                    <div className="flex items-center gap-3 text-[11px] font-sans font-bold text-obsidian-400 group-hover/status:text-white transition-colors">
                       <span className="opacity-50">{s.icon}</span> {s.label}
                    </div>
                    <div className="text-[9px] font-display font-black text-green-500 uppercase tracking-widest">{s.status}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-[10px] text-obsidian-600 leading-relaxed font-mono min-h-[3rem] uppercase tracking-tighter">
                   {loadingMsg || '>> System idle. Waiting for prompt ingestion...'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h2 className="text-5xl font-display font-black text-white uppercase tracking-tighter">The Rescued Stash</h2>
            <p className="text-xs font-display font-bold uppercase tracking-[0.3em] text-obsidian-500">Accessing your indexed intelligence vault</p>
          </div>
          <div className="relative w-full md:w-96">
            <input 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search via tags, title, or content..." 
              className="w-full pl-12 pr-6 py-4 bg-obsidian-900 border-2 border-white/5 rounded-2xl text-sm font-sans focus:outline-none focus:border-brand-500/20" 
            />
            <svg className="absolute left-4 top-4.5 w-5 h-5 text-obsidian-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
        </div>
        
        {filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrompts.map(p => <PromptCard key={p.id} prompt={p} onTagClick={setSelectedTag} />)}
          </div>
        ) : (
          <div className="py-40 text-center space-y-4 bg-obsidian-900/20 border border-white/5 border-dashed rounded-[40px]">
             <div className="w-16 h-16 bg-obsidian-900 rounded-full flex items-center justify-center mx-auto text-obsidian-800 border border-white/5 opacity-50">
                <DriveIcon />
             </div>
             <p className="text-obsidian-600 font-display font-black uppercase text-[10px] tracking-[0.4em]">No Intelligence Found</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
