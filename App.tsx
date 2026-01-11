
import React, { useState, useEffect } from 'react';
import { supabase, signInWithGoogle, signOut } from './services/supabase';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import SourceAuth from './components/SourceAuth';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSourceAuth, setShowSourceAuth] = useState(false);
  const [publicVaultId, setPublicVaultId] = useState<string | null>(null);

  useEffect(() => {
    // Check for shared vault in URL
    const urlParams = new URLSearchParams(window.location.search);
    const vaultId = urlParams.get('vault');
    if (vaultId) {
      setPublicVaultId(vaultId);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session && !vaultId) {
        const onboarded = localStorage.getItem(`onboarded_${session.user.id}`);
        if (!onboarded) setShowSourceAuth(true);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session && !vaultId) {
        const onboarded = localStorage.getItem(`onboarded_${session.user.id}`);
        if (!onboarded) setShowSourceAuth(true);
      } else {
        setShowSourceAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleOnboardingComplete = () => {
    if (session) {
      localStorage.setItem(`onboarded_${session.user.id}`, 'true');
    }
    setShowSourceAuth(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-obsidian-950">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-brand-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // If viewing a public vault, show dashboard in read-only mode
  if (publicVaultId) {
    return (
      <div className="min-h-screen font-sans selection:bg-brand-500/30 bg-obsidian-950 text-white">
        <Dashboard 
          user={{ id: publicVaultId }} 
          onSignOut={() => {
            window.location.href = window.location.origin;
          }} 
          isPublicView={true} 
          onSignIn={signInWithGoogle}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans selection:bg-brand-500/30 bg-obsidian-950 text-white">
      {!session ? (
        <Hero onSignIn={signInWithGoogle} />
      ) : showSourceAuth ? (
        <SourceAuth onComplete={handleOnboardingComplete} />
      ) : (
        <Dashboard user={session.user} onSignOut={signOut} onManageSources={() => setShowSourceAuth(true)} />
      )}
    </div>
  );
};

export default App;
