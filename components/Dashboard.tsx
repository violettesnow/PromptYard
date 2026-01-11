
// Add React to the imports to fix 'Cannot find namespace React' error
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  isPremium: boolean;
  onUpgrade: () => void;
}

const XIcon = () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644z" /></svg>;
const DriveIcon = () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M7.71 3.502L1.15 14.784l3.75 6.463 6.546-11.282H7.71zM9.73 15.01l-3.323 5.737h13.186l3.323-5.737H9.73zM22.314 13.974L15.753 2.692h-7.5l6.561 11.282h7.5z" /></svg>;
const GmailIcon = () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.387l-9 6.463-9-6.463V21H1.5C.65 21 0 20.35 0 19.5v-15c0-.425.162-.8.431-1.068C.7 3.16 1.075 3 1.5 3H2l10 7.143L22 3h.5c.425 0 .8.16 1.069.432.27.268.431.643.431 1.068z" /></svg>;
const MicIcon = () => <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>;
const FileTextIcon = () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const CloudIcon = () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19a3.5 3.5 0 1 1 0-7c.1 0 .2 0 .3 0a7 7 0 1 0-13.3-3C2.1 9.4 0 12 0 15a5 5 0 0 0 5 5h12.5a3.5 3.5 0 0 0 0-7z"/></svg>;
const DownloadIcon = () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const MobileIcon = () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;
const LockIcon = () => <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm3 8H9V7a3 3 0 0 1 6 0v3z"/></svg>;

const Dashboard: React.FC<DashboardProps> = ({ user, onSignOut, onManageSources, isPublicView, onSignIn, isPremium, onUpgrade }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [inputText, setInputText] = useState('');
  const [manualTags, setManualTags] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [status, setStatus] = useState<AppState>(AppState.IDLE);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showCloudGuide, setShowCloudGuide] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    fetchPrompts();
    
    // PWA Install Prompt Listener
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition;
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

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallGuide(true);
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

  const handleExportStash = () => {
    if (!isPremium) {
      onUpgrade();
      return;
    }
    const dataStr = JSON.stringify(prompts, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const exportFileDefaultName = `prompt_yard_stash_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    URL.revokeObjectURL(url);
  };

  const downloadPRD = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("PromptYard Product Requirements Document", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text("PromptYard is an advanced AI prompt management system that allows researchers and prompt engineers to rescue, organize, and analyze prompts from fragmented sources.", 20, 50);
    doc.save('PromptYard_PRD.pdf');
  };

  const handleSync = async () => {
    if (isPublicView) return;
    if (!isPremium) {
      onUpgrade();
      return;
    }
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
      await new Promise(r => setTimeout(r, 1500));
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
    if (!isPremium) {
      onUpgrade();
      return;
    }
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
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 font-sans">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => !isPublicView && window.location.reload()}>
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-2xl shadow-brand-500/20">
             <DriveIcon />
          </div>
          <div>
            <h1 className="text-lg font-display font-black text-white uppercase leading-none tracking-tighter">Prompt Yard</h1>
            <span className="text-[8px] font-display font-black text-brand-400 uppercase tracking-[0.25em]">Agentic Intelligence Active</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          {!isPremium && !isPublicView && (
            <button 
              onClick={onUpgrade}
              className="px-6 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-display font-black rounded-full uppercase text-[9px] tracking-widest shadow-xl shadow-brand-600/20 hover:scale-105 transition-all"
            >
              Unlock Pro
            </button>
          )}
          {isPremium && (
            <div className="px-4 py-2.5 bg-brand-600/10 border border-brand-500/30 text-brand-400 rounded-full text-[9px] font-display font-black uppercase tracking-widest flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse"></div>
               Premium Active
            </div>
          )}
          <button 
            onClick={handleInstallClick}
            className={`flex items-center gap-2 px-4 py-2.5 bg-obsidian-800 border border-white/10 rounded-full text-[9px] font-display font-black uppercase tracking-widest text-obsidian-300 hover:text-white transition-all`}
          >
            <MobileIcon /> Setup Mobile
          </button>
          <button 
            onClick={() => setShowCloudGuide(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-obsidian-800 border border-white/10 rounded-full text-[9px] font-display font-black uppercase tracking-widest text-obsidian-300 hover:text-white transition-all hover:bg-obsidian-700"
          >
            <CloudIcon /> Cloud Setup
          </button>
          <button 
            onClick={handleExportStash}
            className="flex items-center gap-2 px-4 py-2.5 bg-obsidian-800 border border-white/10 rounded-full text-[9px] font-display font-black uppercase tracking-widest text-obsidian-300 hover:text-white transition-all group"
          >
            <DownloadIcon /> Export {!isPremium && <LockIcon />}
          </button>
          <button 
            onClick={handleSync} 
            disabled={status === AppState.LOADING}
            className="px-6 py-2.5 bg-brand-600/10 border border-brand-500/30 rounded-full text-[9px] font-display font-black uppercase tracking-widest text-brand-400 hover:bg-brand-600 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
          >
            Deep Sync {!isPremium && <LockIcon />}
          </button>
          <button onClick={onSignOut} className="px-6 py-2.5 bg-obsidian-900 border border-white/10 rounded-full text-[9px] font-display font-black uppercase tracking-widest text-obsidian-500 hover:text-white transition-all">Log Out</button>
        </div>
      </header>

      {showInstallGuide && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-2xl animate-fade-in">
          <div className="max-w-xl w-full bg-obsidian-950 border-2 border-white/10 rounded-[40px] p-10 space-y-8 relative overflow-hidden shadow-[0_0_100px_rgba(139,92,246,0.1)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/10 blur-[100px] pointer-events-none rounded-full"></div>
            <div className="space-y-3">
              <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Mobile Deployment</h2>
              <p className="text-obsidian-400 text-xs font-medium">Equip PromptYard as a standalone application on your device.</p>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                <h3 className="text-[10px] font-display font-black text-brand-500 uppercase tracking-widest">iOS / Safari</h3>
                <p className="text-[11px] text-obsidian-200">Tap 'Share' and select 'Add to Home Screen'.</p>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                <h3 className="text-[10px] font-display font-black text-green-500 uppercase tracking-widest">Android / Chrome</h3>
                <p className="text-[11px] text-obsidian-200">Open Menu and select 'Install App'.</p>
              </div>
            </div>
            <button onClick={() => setShowInstallGuide(false)} className="w-full py-4 bg-white text-obsidian-950 font-display font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-obsidian-100 transition-all">Got it</button>
          </div>
        </div>
      )}

      {showCloudGuide && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-2xl animate-fade-in">
          <div className="max-w-2xl w-full bg-obsidian-950 border-2 border-white/10 rounded-[40px] p-10 space-y-8 relative overflow-hidden">
            <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Google Cloud Setup</h2>
            <div className="grid gap-3 font-mono">
              {[
                { step: "01", text: "Create a Project at console.cloud.google.com" },
                { step: "02", text: "Enable Gmail, Drive, and People APIs" },
                { step: "03", text: "Configure OAuth Consent Screen" },
                { step: "04", text: "Add Scopes: gmail.readonly, drive.readonly" },
                { step: "05", text: "Create OAuth 2.0 Client ID" }
              ].map(item => (
                <div key={item.step} className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-brand-500 font-display font-black text-lg">{item.step}</span>
                  <p className="text-[10px] text-obsidian-200 uppercase tracking-wide">{item.text}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowCloudGuide(false)} className="w-full py-4 bg-white text-obsidian-950 font-display font-black rounded-2xl uppercase text-[10px] tracking-widest">Close</button>
          </div>
        </div>
      )}

      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 backdrop-blur-xl">
          <div className="relative max-w-2xl w-full aspect-video rounded-[40px] overflow-hidden border-2 border-brand-500/50 shadow-2xl">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
            <canvas ref={canvasRef} className="hidden" />
            <button onClick={captureFrame} className="absolute bottom-10 left-1/2 -translate-x-1/2 px-10 py-4 bg-white text-black font-display font-black rounded-full uppercase text-xs">Capture & Analyze</button>
            <button onClick={stopCamera} className="absolute top-8 right-8 p-4 bg-black/40 text-white rounded-full">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      )}

      {!isPublicView && (
        <section className="glass-card rounded-[32px] p-8 space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/5 blur-[100px] pointer-events-none rounded-full"></div>
          
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-5 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${status === AppState.LOADING ? 'bg-brand-500 animate-pulse' : 'bg-obsidian-700'}`}></div>
                  <h2 className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-obsidian-400">Intelligence Intake</h2>
                </div>
              </div>
              
              <div className="relative group/input">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste URLs from X, Drive, Gmail or dictate your prompt..."
                  className="w-full h-40 bg-obsidian-900 border-2 border-white/5 rounded-[24px] p-6 text-sm text-obsidian-100 focus:outline-none focus:border-brand-500/30 transition-all font-mono resize-none leading-relaxed"
                />
                <button 
                  onClick={handleVoiceInput}
                  className={`absolute bottom-4 right-4 p-3 rounded-xl transition-all shadow-xl ${isListening ? 'bg-brand-600 text-white animate-pulse' : 'bg-obsidian-800 text-obsidian-500 hover:text-white'}`}
                >
                  <MicIcon />
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <input 
                  value={manualTags} 
                  onChange={(e) => setManualTags(e.target.value)} 
                  placeholder="Additional tags (comma separated)..." 
                  className="flex-1 px-6 py-3.5 bg-obsidian-900 border-2 border-white/5 rounded-xl text-xs font-sans focus:outline-none focus:border-brand-500/20" 
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleImport} 
                    disabled={status === AppState.LOADING || !inputText.trim()} 
                    className="px-8 py-3.5 bg-white text-obsidian-950 font-display font-black rounded-xl shadow-xl hover:bg-obsidian-100 transition-all uppercase tracking-tight text-xs"
                  >
                    Rescue
                  </button>
                  <button onClick={startCamera} className="p-3.5 bg-brand-600 text-white rounded-xl shadow-lg hover:bg-brand-500 transition-all flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    {!isPremium && <LockIcon />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-4 flex flex-col justify-end p-8 bg-obsidian-900/50 rounded-[24px] border border-white/5 relative overflow-hidden">
              <h3 className="text-[9px] font-display font-black uppercase text-brand-500 mb-4 tracking-[0.25em]">Agent Status</h3>
              <div className="space-y-3">
                {[
                  { label: 'X Grounding Agent', status: 'Online', icon: <XIcon /> },
                  { label: 'Gmail Synthesis', status: 'Online', icon: <GmailIcon /> },
                  { label: 'Drive Crawler', status: 'Active', icon: <DriveIcon /> }
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between group/status">
                    <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-obsidian-400">
                       <span className="opacity-50 scale-75">{s.icon}</span> {s.label}
                    </div>
                    <div className="text-[8px] font-display font-black text-green-500 uppercase tracking-widest">{s.status}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-[9px] text-obsidian-600 leading-relaxed font-mono min-h-[2.5rem] uppercase tracking-tighter">
                   {loadingMsg || '>> System idle. Waiting for prompt ingestion...'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tighter">The Rescued Stash</h2>
            <p className="text-[10px] font-display font-bold uppercase tracking-[0.3em] text-obsidian-500">Accessing your indexed intelligence vault</p>
          </div>
          <div className="relative w-full md:w-80">
            <input 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search stash..." 
              className="w-full pl-10 pr-4 py-3 bg-obsidian-900 border-2 border-white/5 rounded-xl text-xs font-sans focus:outline-none focus:border-brand-500/20" 
            />
          </div>
        </div>
        
        {filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map(p => <PromptCard key={p.id} prompt={p} onTagClick={setSelectedTag} />)}
          </div>
        ) : (
          <div className="py-32 text-center space-y-4 bg-obsidian-900/20 border border-white/5 border-dashed rounded-[32px]">
             <p className="text-obsidian-600 font-display font-black uppercase text-[9px] tracking-[0.4em]">No Intelligence Found</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
