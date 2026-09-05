'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function ICCS_Dashboard() {
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); 
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [aiOutput, setAiOutput] = useState('');

  useEffect(() => {
    const session = supabase.auth.getSession();
    setUser(session?.user ?? null);
    if(session?.user) setStep('dashboard');
  }, []);

  const handleSendOTP = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: phone });
    setLoading(false);
    if (!error) setStep('otp');
    else alert(error.message);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({ phone: phone, token: otp, type: 'sms' });
    setLoading(false);
    if (!error && data.user) {
      setUser(data.user);
      setStep('dashboard');
    } else alert(error.message);
  };

  const runCognitiveSync = async () => {
    setLoading(true);
    const res = await fetch('/api/cognitive-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, rawText: notes, subject: subject })
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) setAiOutput(data.insights);
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col justify-between font-sans selection:bg-cyan-500/30">
      <header className="border-b border-slate-800 p-4 bg-slate-950/60 backdrop-blur flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
          ICCS // COGNITIVE SYSTEM
        </h1>
        <div className="text-right text-xs text-slate-500">
          Architect: <span className="text-cyan-400 font-mono">Ayush Kumar Pal</span> <br />
          <span className="text-[10px]">BTech CSE AIML 1st Year</span>
        </div>
      </header>

      <main className="flex-grow p-6 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        {step === 'phone' && (
          <div className="bg-slate-950 border border-slate-800 p-8 rounded-xl max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Student Onboarding</h2>
            <p className="text-sm text-slate-400 mb-6">Enter phone number to receive secure network entry token.</p>
            <input 
              type="tel" placeholder="+91XXXXXXXXXX" value={phone} onChange={(e)=>setPhone(e.target.value)}
              className="w-full bg-black border border-slate-700 rounded p-3 mb-4 focus:outline-none focus:border-cyan-500 text-white"
            />
            <button onClick={handleSendOTP} disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 py-3 rounded font-semibold transition-all">
              {loading ? 'Routing Broadcast...' : 'Generate OTP Access'}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="bg-slate-950 border border-slate-800 p-8 rounded-xl max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Verify Identity</h2>
            <p className="text-sm text-slate-400 mb-6">Enter the verification matrix code sent to your terminal.</p>
            <input 
              type="text" placeholder="6-Digit Token" value={otp} onChange={(e)=>setOtp(e.target.value)}
              className="w-full bg-black border border-slate-700 rounded p-3 mb-4 focus:outline-none focus:border-cyan-500 tracking-widest text-center text-white"
            />
            <button onClick={handleVerifyOTP} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded font-semibold transition-all">
              {loading ? 'Authenticating...' : 'Confirm Authentication'}
            </button>
          </div>
        )}

        {step === 'dashboard' && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4 text-cyan-400">Autonomous Student Interface</h3>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Subject Matrix</label>
              <input type="text" placeholder="e.g., Quantum Physics" value={subject} onChange={(e)=>setSubject(e.target.value)} className="w-full bg-black border border-slate-800 rounded p-2 mb-4 text-sm text-white" />
              
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Knowledge Core / Syllabus Notes</label>
              <textarea rows={6} placeholder="Paste paragraphs, topics, or study logs here..." value={notes} onChange={(e)=>setNotes(e.target.value)} className="w-full bg-black border border-slate-800 rounded p-2 mb-4 text-sm resize-none text-white"></textarea>
              
              <button onClick={runCognitiveSync} disabled={loading} className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 py-2.5 rounded text-sm font-medium">
                {loading ? 'AI Brain Syncing...' : 'Initiate Autonomous Sync'}
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl min-h-[350px] flex flex-col justify-between font-mono text-xs">
              <div>
                <div className="flex justify-between border-b border-slate-800 pb-2 mb-4 text-slate-500">
                  <span>COGNITIVE OUTPUT FEED</span>
                  <span className="text-cyan-500 animate-pulse">● LIVE</span>
                </div>
                <div className="text-slate-300 leading-relaxed overflow-y-auto max-h-[260px]">
                  {aiOutput ? aiOutput : '// System Idle. Awaiting student intelligence input data...'}
                </div>
              </div>
              <div className="border-t border-slate-900 pt-3 text-[10px] text-slate-600 text-center">
                ICCS Powered by Groq Cloud Llama3 Integration Architecture
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-900 p-3 bg-black text-center text-[11px] text-slate-600 tracking-wide font-mono">
        SYSTEM PROPERTY CONTROLLED BY: <span className="text-cyan-500/80 font-bold">AYUSH KUMAR PAL</span> | B.TECH 1ST YEAR CSE (AIML) STUDENT
      </footer>
    </div>
  );
}

