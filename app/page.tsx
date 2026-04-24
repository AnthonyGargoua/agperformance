"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check, Zap, Dumbbell, Bike, Trophy, ChevronLeft, Flame, TrendingUp, Map, Save, History, Trash2 } from 'lucide-react';

// --- DATA & HELPER ---
const IMGS = {
    pecs: "https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=600",
    vtt: "https://images.unsplash.com/photo-1544191959-2426bb96eead?q=80&w=600",
    padel: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600"
};

const WORKOUT_DATA = {
    "Lundi": { spec: "Push 1 - Pecs/Tri", exercises: [{ name: "Dév. Couché", sets: 4, reps: "6-8", muscle: "Pecs", img: IMGS.pecs }] },
    // ... Garde tes autres jours ici
};

export default function App() {
    const [view, setView] = useState("selection");
    const [day, setDay] = useState("Lundi");
    const [timeLeft, setTimeLeft] = useState(0);
    const [completed, setCompleted] = useState({});
    const [history, setHistory] = useState([]);

    // --- ETATS VTT ---
    const [vttData, setVttData] = useState({ km: "", denivele: "", temps: "" });
    const [calVtt, setCalVtt] = useState(0);

    // --- ETATS PADEL ---
    const [padelData, setPadelData] = useState({ 
        mySets: [0, 0, 0], 
        oppSets: [0, 0, 0], 
        pointsForts: "", 
        pointsFaibles: "" 
    });

    // --- LOGIQUE BDD (LocalStorage) ---
    useEffect(() => {
        const saved = localStorage.getItem('ag_training_history');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    const saveToDB = (type, data) => {
        const newEntry = { id: Date.now(), type, date: new Date().toLocaleDateString(), ...data };
        const updatedHistory = [newEntry, ...history];
        setHistory(updatedHistory);
        localStorage.setItem('ag_training_history', JSON.stringify(updatedHistory));
        alert("Séance enregistrée dans l'historique !");
        setView('selection');
    };

    // --- LOGIQUE VTT : CALCUL CALORIES ---
    useEffect(() => {
        const km = parseFloat(vttData.km) || 0;
        const deniv = parseFloat(vttData.denivele) || 0;
        const h = parseFloat(vttData.temps) || 0;
        // Formule simplifiée : (KM * 25) + (Dénivelé * 0.5)
        if (km > 0) setCalVtt(Math.round((km * 30) + (deniv * 0.4)));
    }, [vttData]);

    // --- LOGIQUE MINUTEUR (MUSCU) ---
    useEffect(() => {
        if (timeLeft > 0) {
            const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(t);
        } else if (timeLeft === 0 && timeLeft !== null) {
            if (navigator.vibrate) navigator.vibrate([400, 200, 400]);
        }
    }, [timeLeft]);

    const vibrate = (p) => { if (navigator.vibrate) navigator.vibrate(p); };

    // --- RENDER SELECTION ---
    if (view === "selection") {
        return (
            <div className="min-h-screen bg-black p-6 flex flex-col justify-center gap-4">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-black italic text-white">AG <span className="text-cyan-400">HUB</span></h1>
                </div>

                <div className="space-y-4">
                    <button onClick={() => setView('muscu')} className="w-full h-24 bg-zinc-900 rounded-3xl border border-white/5 flex items-center p-6 gap-4">
                        <Dumbbell className="text-cyan-400" />
                        <div className="text-left"><h2 className="font-black">MUSCULATION</h2><p className="text-[10px] text-zinc-500 uppercase">Timer & Séances</p></div>
                    </button>
                    <button onClick={() => setView('vtt')} className="w-full h-24 bg-zinc-900 rounded-3xl border border-white/5 flex items-center p-6 gap-4">
                        <Bike className="text-green-400" />
                        <div className="text-left"><h2 className="font-black">VTT / CYCLISME</h2><p className="text-[10px] text-zinc-500 uppercase">Calcul Calories & Dénivelé</p></div>
                    </button>
                    <button onClick={() => setView('padel')} className="w-full h-24 bg-zinc-900 rounded-3xl border border-white/5 flex items-center p-6 gap-4">
                        <Trophy className="text-yellow-400" />
                        <div className="text-left"><h2 className="font-black">PADEL TENNIS</h2><p className="text-[10px] text-zinc-500 uppercase">Sets & Analyse Tactique</p></div>
                    </button>
                    <button onClick={() => setView('history')} className="w-full h-16 bg-zinc-800/30 rounded-2xl flex items-center justify-center gap-2 text-zinc-500">
                        <History size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Historique</span>
                    </button>
                </div>
            </div>
        );
    }

    // --- RENDER VTT ---
    if (view === "vtt") {
        return (
            <div className="min-h-screen bg-black text-white p-6">
                <button onClick={() => setView('selection')} className="mb-6 flex items-center gap-2 text-zinc-500"><ChevronLeft/> Retour</button>
                <div className="bg-zinc-900 p-6 rounded-[2rem] border border-white/10 space-y-6">
                    <div className="flex justify-between items-center">
                        <span className="font-black italic">VTT SESSION</span>
                        <div className="flex items-center text-orange-500 font-black"><Flame size={16}/> {calVtt} KCAL</div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-white/5 pb-2"><span>Distance</span><input type="number" value={vttData.km} onChange={e => setVttData({...vttData, km: e.target.value})} placeholder="KM" className="bg-transparent text-right font-black text-cyan-400 outline-none w-20"/></div>
                        <div className="flex justify-between border-b border-white/5 pb-2"><span>Dénivelé+</span><input type="number" value={vttData.denivele} onChange={e => setVttData({...vttData, denivele: e.target.value})} placeholder="Mètres" className="bg-transparent text-right font-black text-cyan-400 outline-none w-20"/></div>
                        <div className="flex justify-between border-b border-white/5 pb-2"><span>Durée</span><input type="number" value={vttData.temps} onChange={e => setVttData({...vttData, temps: e.target.value})} placeholder="Min" className="bg-transparent text-right font-black text-cyan-400 outline-none w-20"/></div>
                    </div>
                    <button onClick={() => saveToDB('VTT', { ...vttData, calories: calVtt })} className="w-full bg-cyan-500 text-black font-black p-4 rounded-xl flex justify-center gap-2"><Save/> SAUVEGARDER</button>
                </div>
            </div>
        );
    }

    // --- RENDER PADEL ---
    if (view === "padel") {
        return (
            <div className="min-h-screen bg-black text-white p-6">
                <button onClick={() => setView('selection')} className="mb-6 flex items-center gap-2 text-zinc-500"><ChevronLeft/> Retour</button>
                <div className="bg-zinc-900 p-6 rounded-[2rem] border border-white/10 space-y-6">
                    <h2 className="font-black italic text-center">SCORE DU MATCH</h2>
                    <div className="grid grid-cols-3 gap-2 text-center items-center">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">MOI</span>
                        <div className="flex gap-1 justify-center">
                            {[0,1,2].map(i => <input key={i} type="number" value={padelData.mySets[i]} onChange={e => { let s = [...padelData.mySets]; s[i] = e.target.value; setPadelData({...padelData, mySets: s})}} className="w-10 h-10 bg-zinc-800 rounded-lg text-center font-black text-cyan-400 outline-none"/>)}
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center items-center">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">EUX</span>
                        <div className="flex gap-1 justify-center">
                            {[0,1,2].map(i => <input key={i} type="number" value={padelData.oppSets[i]} onChange={e => { let s = [...padelData.oppSets]; s[i] = e.target.value; setPadelData({...padelData, oppSets: s})}} className="w-10 h-10 bg-zinc-800 rounded-lg text-center font-black outline-none"/>)}
                        </div>
                    </div>
                    <textarea placeholder="Points forts..." onChange={e => setPadelData({...padelData, pointsForts: e.target.value})} className="w-full bg-black/40 p-4 rounded-xl text-sm h-20 outline-none border border-white/5"/>
                    <textarea placeholder="Points à améliorer..." onChange={e => setPadelData({...padelData, pointsFaibles: e.target.value})} className="w-full bg-black/40 p-4 rounded-xl text-sm h-20 outline-none border border-white/5"/>
                    <button onClick={() => saveToDB('PADEL', padelData)} className="w-full bg-yellow-500 text-black font-black p-4 rounded-xl flex justify-center gap-2"><Save/> ENREGISTRER</button>
                </div>
            </div>
        );
    }

    // --- RENDER HISTORY ---
    if (view === "history") {
        return (
            <div className="min-h-screen bg-black text-white p-6 pb-20">
                <button onClick={() => setView('selection')} className="mb-6 flex items-center gap-2 text-zinc-500"><ChevronLeft/> Retour</button>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-black italic text-2xl">HISTORIQUE</h2>
                    <button onClick={() => { localStorage.clear(); setHistory([]); }} className="text-red-500"><Trash2 size={20}/></button>
                </div>
                <div className="space-y-4">
                    {history.map(item => (
                        <div key={item.id} className="bg-zinc-900 p-4 rounded-2xl border border-white/5">
                            <div className="flex justify-between text-[10px] font-black text-zinc-500 mb-2 uppercase"><span>{item.type}</span><span>{item.date}</span></div>
                            {item.type === 'VTT' && <p className="font-bold text-cyan-400">{item.km} KM - {item.calories} KCAL</p>}
                            {item.type === 'PADEL' && <p className="font-bold text-yellow-500">Sets: {item.mySets.join('/')} vs {item.oppSets.join('/')}</p>}
                        </div>
                    ))}
                    {history.length === 0 && <p className="text-center text-zinc-600 mt-20 font-bold uppercase italic">Aucune donnée</p>}
                </div>
            </div>
        );
    }

    // --- RENDER MUSCU ---
    return (
        <div className="min-h-screen bg-black text-white pb-32">
            <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl p-6 border-b border-white/10">
                <button onClick={() => setView('selection')} className="mb-2 text-[10px] text-zinc-600 font-black uppercase flex items-center gap-1"><ChevronLeft size={10}/> Menu</button>
                <h1 className="text-4xl font-black italic">{day.toUpperCase()}</h1>
            </header>

            <main className="p-4 space-y-8">
                {WORKOUT_DATA[day]?.exercises.map((ex) => (
                    <div key={ex.name} className="bg-zinc-900/50 rounded-[2rem] border border-white/5 overflow-hidden">
                        <div className="relative h-40">
                            <img src={ex.img} className="w-full h-full object-cover opacity-40 grayscale" />
                            <div className="absolute bottom-4 left-6"><h2 className="text-2xl font-black italic uppercase">{ex.name}</h2></div>
                        </div>
                        <div className="p-6 space-y-4">
                            {[...Array(ex.sets)].map((_, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <input type="number" placeholder="KG" className="flex-1 bg-zinc-800 p-3 rounded-xl text-center font-black outline-none" />
                                    <input type="number" placeholder="REPS" className="flex-1 bg-zinc-800 p-3 rounded-xl text-center font-black outline-none" />
                                    <button onClick={() => { vibrate(20); setCompleted({...completed, [`${ex.name}-${i}`]: true}) }} className={`h-12 w-12 rounded-xl flex items-center justify-center ${completed[`${ex.name}-${i}`] ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-600'}`}><Check size={20} /></button>
                                </div>
                            ))}
                            <div className="flex gap-2 pt-4">
                                {[60, 90, 120].map(s => <button key={s} onClick={() => setTimeLeft(s)} className="flex-1 bg-zinc-800 py-3 rounded-xl text-[10px] font-black uppercase">{s}s</button>)}
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            <AnimatePresence>
                {timeLeft > 0 && (
                    <motion.div initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }} className="fixed bottom-24 right-6 left-6 z-[100] bg-cyan-500 text-black p-4 rounded-2xl font-black flex justify-between items-center shadow-2xl">
                        <span className="text-3xl">{Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</span>
                        <button onClick={() => setTimeLeft(0)} className="text-[10px] border border-black/20 p-2 rounded-lg">SKIP</button>
                    </motion.div>
                )}
            </AnimatePresence>

            <nav className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-white/10 px-4 pb-8 pt-4 flex justify-between">
                {Object.keys(WORKOUT_DATA).map(d => <button key={d} onClick={() => setDay(d)} className={`text-[10px] font-black ${day === d ? 'text-cyan-400' : 'text-zinc-600'}`}>{d.substring(0,3).toUpperCase()}</button>)}
            </nav>
        </div>
    );
}
