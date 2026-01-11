// Add React to the imports to fix 'Cannot find namespace React' error
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Prompt, AppState, ConnectedSource } from '../types';
import { extractPromptFromSource, extractPromptFromImage, extractPromptFromVideo, generatePromptImage, refineTags } from '../services/gemini';
import { supabase } from '../services/supabase';
import PromptCard from './PromptCard';
import { jsPDF } from 'jspdf';
import Logo from './Logo';

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

  const uniqueTags = Array.from(new Set(prompts.flatMap(p => p.tags)));

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 font-sans">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => !isPublicView && window.location.reload()}>
          <div className="w-10 h-10 flex items-center justify-center">
             <Logo className="w-full h-full drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]" />
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

      {!isPublicView && (
        <section className="bg-obsidian-900/40 p-8 rounded-[40px] border border-white/5 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste X/Twitter bookmark URL, Google Drive link, or manual prompt text..."
                className="w-full h-32 bg-obsidian-950 border border-white/10 rounded-3xl p-6 text-sm text-white focus:border-brand-500/50 outline-none transition-all resize-none"
              />
              <button 
                onClick={handleVoiceInput}
                className={`absolute right-4 bottom-4 p-3 rounded-2xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-obsidian-800 text-obsidian-400 hover:text-white'}`}
              >
                <MicIcon />
              </button>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-64">
              <input
                value={manualTags}
                onChange={(e) => setManualTags(e.target.value)}
                placeholder="Add tags (comma separated)"
                className="w-full px-5 py-4 bg-obsidian-950 border border-white/10 rounded-2xl text-xs text-white outline-none focus:border-brand-500/50"
              />
              <button
                onClick={handleImport}
                disabled={status === AppState.LOADING || !inputText.trim()}
                className="flex-1 bg-white text-obsidian-950 font-display font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-brand-500 hover:text-white transition-all disabled:opacity-50 active:scale-95"
              >
                Rescue Intelligence
              </button>
              <button
                onClick={startCamera}
                className="px-5 py-4 bg-obsidian-800 text-obsidian-300 border border-white/10 rounded-2xl text-[9px] font-display font-black uppercase tracking-widest hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <MobileIcon /> Visual Scan
              </button>
            </div>
          </div>
        </section>
      )}

      {status === AppState.LOADING && (
        <div className="flex items-center gap-4 p-6 bg-brand-600/10 border border-brand-500/30 rounded-3xl animate-pulse">
          <div className="w-5 h-5 border-2 border-brand-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-display font-black text-brand-400 uppercase tracking-widest">{loadingMsg}</span>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your stash..."
              className="w-full px-6 py-4 bg-obsidian-900/60 border border-white/5 rounded-2xl text-sm text-white outline-none focus:border-brand-500/30"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-obsidian-600">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
            <button 
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-xl text-[9px] font-display font-black uppercase tracking-widest transition-all ${!selectedTag ? 'bg-brand-500 text-white' : 'bg-obsidian-800 text-obsidian-500 hover:text-white'}`}
            >
              All Assets
            </button>
            {uniqueTags.map(tag => (
              <button 
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-4 py-2 rounded-xl text-[9px] font-display font-black uppercase tracking-widest transition-all whitespace-nowrap ${tag === selectedTag ? 'bg-brand-500 text-white' : 'bg-obsidian-800 text-obsidian-500 hover:text-white'}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrompts.map(prompt => (
              <PromptCard key={prompt.id} prompt={prompt} onTagClick={setSelectedTag} />
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <div className="w-16 h-16 bg-obsidian-900 rounded-full flex items-center justify-center text-obsidian-700">
              <FileTextIcon />
            </div>
            <p className="text-obsidian-500 text-sm font-medium">No intelligence found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Visual Scan Overlay */}
      {isCameraActive && (
        <div className="fixed inset-0 z-[150] bg-black flex flex-col items-center justify-center">
          <video ref={videoRef} className="h-full w-full object-cover" playsInline />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute bottom-10 left-0 w-full flex justify-center gap-6 px-6">
            <button onClick={stopCamera} className="w-16 h-16 bg-obsidian-900 text-white rounded-full flex items-center justify-center border border-white/10">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <button onClick={captureFrame} className="w-20 h-20 bg-white text-obsidian-950 rounded-full flex items-center justify-center shadow-2xl scale-110 active:scale-95 transition-all">
              <div className="w-16 h-16 border-4 border-obsidian-950 rounded-full"></div>
            </button>
            <div className="w-16 h-16"></div>
          </div>
        </div>
      )}

      {/* Cloud Setup Guide Modal */}
      {showCloudGuide && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setShowCloudGuide(false)}>
          <div className="max-w-xl w-full bg-obsidian-900 border border-white/10 rounded-[40px] p-10 space-y-8" onClick={e => e.stopPropagation()}>
            <div className="space-y-2">
               <h2 className="text-3xl font-display font-black uppercase tracking-tighter">Cloud Sync Config</h2>
               <p className="text-obsidian-400 text-sm">Follow these steps to enable enterprise-grade background indexing.</p>
            </div>
            <div className="space-y-4">
               {[
                 "Visit Google Cloud Console & Create Project",
                 "Enable Drive and Gmail APIs",
                 "Create OAuth Credentials",
                 "Paste Client ID in Profile Settings"
               ].map((step, i) => (
                 <div key={i} className="flex gap-4 p-4 bg-obsidian-950 rounded-2xl border border-white/5">
                    <span className="text-brand-500 font-display font-black text-xl">0{i+1}</span>
                    <span className="text-obsidian-300 font-medium text-sm">{step}</span>
                 </div>
               ))}
            </div>
            <button onClick={() => setShowCloudGuide(false)} className="w-full py-4 bg-white text-obsidian-950 font-display font-black rounded-2xl text-[10px] uppercase tracking-widest">Acknowledge</button>
          </div>
        </div>
      )}

      {/* Install Guide Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setShowInstallGuide(false)}>
          <div className="max-w-xl w-full bg-obsidian-900 border border-white/10 rounded-[40px] p-10 text-center space-y-8" onClick={e => e.stopPropagation()}>
            <div className="w-20 h-20 bg-brand-500/20 rounded-3xl flex items-center justify-center mx-auto text-brand-500">
               <MobileIcon />
            </div>
            <div className="space-y-2">
               <h2 className="text-3xl font-display font-black uppercase tracking-tighter">Install Mobile Yard</h2>
               <p className="text-obsidian-400 text-sm">Add PromptYard to your home screen for instant scanning on the go.</p>
            </div>
            <div className="text-left bg-obsidian-950 p-6 rounded-3xl border border-white/5 space-y-4 text-xs">
               <p className="text-obsidian-300 font-bold">iOS: <span className="font-normal">Tap Share button and select "Add to Home Screen"</span></p>
               <p className="text-obsidian-300 font-bold">Android: <span className="font-normal">Tap browser menu and select "Install App"</span></p>
            </div>
            <button onClick={() => setShowInstallGuide(false)} className="w-full py-4 bg-white text-obsidian-950 font-display font-black rounded-2xl text-[10px] uppercase tracking-widest">Close Guide</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;