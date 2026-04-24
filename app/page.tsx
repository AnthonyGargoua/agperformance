"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check, Zap, Dumbbell, Bike, Trophy, ChevronLeft, Flame, Map, Save, History, Trash2, TrendingUp } from 'lucide-react';

const IMGS = {
    pecs: "https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=600",
    dos: "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?q=80&w=600",
    legs: "https://images.unsplash.com/photo-1434608216196-18084a9e526c?q=80&w=600",
    epaules: "https://images.unsplash.com/photo-1541534741688-6078c6bd35e5?q=80&w=600",
    bras: "https://images.unsplash.com/photo-1581009146145-b5ef03a7401a?q=80&w=600",
    vtt: "https://images.unsplash.com/photo-1544191959-2426bb96eead?q=80&w=600",
    padel: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600"
};

const WORKOUT_DATA = {
    "Lundi": { spec: "Push 1 - Pecs/Triceps", duration: "75", exercises: [
        { name: "Dév. Couché Barre", sets: 4, reps: "6-8", muscle: "Pecs", img: IMGS.pecs },
        { name: "Dév. Incliné Haltères", sets: 3, reps: "10-12", muscle: "Pecs Haut", img: IMGS.pecs },
        { name: "Dév. Militaire Assis", sets: 3, reps: "8-10", muscle: "Epaules", img: IMGS.epaules },
        { name: "Ecartés Poulie", sets: 3, reps: "12-15", muscle: "Pecs", img: IMGS.pecs },
        { name: "Barre au Front", sets: 3, reps: "10-12", muscle: "Triceps", img: IMGS.bras }
    ]},
    "Mardi": { spec: "Pull 1 - Dos/Biceps", duration: "70", exercises: [
        { name: "Soulevé de Terre", sets: 3, reps: "5", muscle: "Dos", img: IMGS.dos },
        { name: "Tractions Lestées", sets: 3, reps: "6-8", muscle: "Dos", img: IMGS.dos },
        { name: "Rowing Barre T", sets: 3, reps: "10-12", muscle: "Dos", img: IMGS.dos },
        { name: "Oiseau Poulie", sets: 3, reps: "15", muscle: "Epaules", img: IMGS.epaules },
        { name: "Curl Barre EZ", sets: 3, reps: "8-10", muscle: "Biceps", img: IMGS.bras }
    ]},
    "Mercredi": { spec: "Legs 1 - Quadriceps", duration: "85", exercises: [
        { name: "Squat Barre Haute", sets: 4, reps: "6-8", muscle: "Cuisses", img: IMGS.legs },
        { name: "Presse à Cuisses", sets: 3, reps: "10-15", muscle: "Quadriceps", img: IMGS.legs },
        { name: "Leg Extension", sets: 3, reps: "15-20", muscle: "Quadriceps", img: IMGS.legs },
        { name: "Adducteurs Machine", sets: 3, reps: "15", muscle: "Adducteurs", img: IMGS.legs },
        { name: "Mollets Debout", sets: 4, reps: "12-15", muscle: "Mollets", img: IMGS.legs }
    ]},
    "Jeudi": { spec: "Push 2 - Epaules/Pecs", duration: "75", exercises: [
        { name: "Dév. Militaire Barre", sets: 4, reps: "6-8", muscle: "Epaules", img: IMGS.epaules },
        { name: "Dév. Incliné Barre", sets: 3, reps: "8-10", muscle: "Pecs Haut", img: IMGS.pecs },
        { name: "Elévations Latérales", sets: 4, reps: "12-15", muscle: "Epaules", img: IMGS.epaules },
        { name: "Pec Deck", sets: 3, reps: "12", muscle: "Pecs", img: IMGS.pecs },
        { name: "Extension Poulie", sets: 3, reps: "12-15", muscle: "Triceps", img: IMGS.bras }
    ]},
    "Vendredi": { spec: "Pull 2 - Largeur Dos", duration: "70", exercises: [
        { name: "Tirage Vertical Large", sets: 4, reps: "10-12", muscle: "Dos", img: IMGS.dos },
        { name: "Rowing Haltère", sets: 3, reps: "10", muscle: "Dos", img: IMGS.dos },
        { name: "Pull Over Poulie", sets: 3, reps: "15", muscle: "Dos", img: IMGS.dos },
        { name: "Curl Pupitre", sets: 3, reps: "10-12", muscle: "Biceps", img: IMGS.bras },
        { name: "Curl Marteau", sets: 3, reps: "10-12", muscle: "Biceps", img: IMGS.bras }
    ]},
    "Samedi": { spec: "Legs 2 - Ischio-jambiers", duration: "80", exercises: [
        { name: "SdT Jambes Tendues", sets: 4, reps: "8-10", muscle: "Ischio", img: IMGS.legs },
        { name: "Hip Thrust", sets: 3, reps: "8-10", muscle: "Fessiers", img: IMGS.legs },
        { name: "Leg Curl Assis", sets: 3, reps: "12-15", muscle: "Ischio", img: IMGS.legs },
        { name: "Abducteurs Machine", sets: 3, reps: "15", muscle: "Fessiers", img: IMGS.legs },
        { name: "Presse Pieds Hauts", sets: 3, reps: "12", muscle: "Ischio", img: IMGS.legs }
    ]}
};

export default function App() {
    const [view, setView] = useState("selection");
    const [day, setDay] = useState("Lundi");
    const [timeLeft, setTimeLeft] = useState(0);
    const [completed, setCompleted] = useState({});
    const [history, setHistory] = useState([]);

    // ETATS VTT / PADEL
    const [vttData, setVttData] = useState({ km: "", denivele: "", temps: "" });
    const [padelData, setPadelData] = useState({ s1M: "", s2M: "", s3M: "", s1A: "", s2A: "", s3A: "", forts: "", faibles: "" });

    useEffect(() => {
        const saved = localStorage.getItem('ag_history_v3');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(t);
        } else if (timeLeft === 0 && navigator.vibrate) {
            navigator.vibrate([400, 200, 400]);
        }
    }, [timeLeft]);

    const saveSession = (type, data) => {
        const entry = { id: Date.now(), date: new Date().toLocaleDateString(), type, ...data };
        const newHistory = [entry, ...history];
        setHistory(newHistory);
        localStorage.setItem('ag_history_v3', JSON.stringify(newHistory));
        setView('selection');
    };

    const vibrate = (p) => { if (navigator.vibrate) navigator.vibrate(p); };

    // --- VIEW: SELECTION ---
    if (view === "selection") {
        return (
            <div className="min-h-screen bg-black p-6 flex flex-col justify-center gap-6">
                <h1 className="text-4xl font-black italic text-center text-white">AG <span className="text-cyan-400">HUB</span></h1>
                <div className="space-y-4">
                    <button onClick={() => setView('muscu')} className="w-full p-6 bg-zinc-900 rounded-3xl border border-white/10 flex items-center gap-4 text-left">
                        <Dumbbell className="text-cyan-400" size={32}/>
                        <div><h2 className="font-black text-xl">MUSCULATION</h2><p className="text-[10px] text-zinc-500 uppercase">Programme complet & Timer</p></div>
                    </button>
                    <button onClick={() => setView('vtt')} className="w-full p-6 bg-zinc-900 rounded-3xl border border-white/10 flex items-center gap-4 text-left">
                        <Bike className="text-orange-400" size={32}/>
                        <div><h2 className="font-black text-xl">VTT</h2><p className="text-[10px] text-zinc-500 uppercase">Dénivelé & Calories</p></div>
                    </button>
                    <button onClick={() => setView('padel')} className="w-full p-6 bg-zinc-900 rounded-3xl border border-white/10 flex items-center gap-4 text-left">
                        <Trophy className="text-yellow-400" size={32}/>
                        <div><h2 className="font-black text-xl">PADEL</h2><p className="text-[10px] text-zinc-500 uppercase">Score 3 Sets & Tactique</p></div>
                    </button>
                    <button onClick={() => setView('history')} className="w-full p-4 bg-zinc-800/30 rounded-2xl flex items-center justify-center gap-2 text-zinc-500 text-xs font-black uppercase"><History size={16}/> Historique</button>
                </div>
            </div>
        );
    }

    // --- VIEW: VTT ---
    if (view === "vtt") {
        const calVtt = Math.round((parseFloat(vttData.km) || 0) * 30 + (parseFloat(vttData.denivele) || 0) * 0.4);
        return (
            <div className="min-h-screen bg-black text-white p-6">
                <button onClick={() => setView('selection')} className="mb-6 flex items-center gap-2 text-zinc-500 uppercase text-[10px] font-black"><ChevronLeft/> Retour</button>
                <div className="bg-zinc-900 p-8 rounded-[2rem] border border-white/10 space-y-6">
                    <div className="text-center"><Flame className="text-orange-500 mx-auto mb-2" size={40}/><span className="text-3xl font-black">{calVtt} KCAL</span></div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2"><span>Distance KM</span><input type="number" placeholder="0" className="bg-transparent text-right font-black text-cyan-400 outline-none w-20" onChange={e => setVttData({...vttData, km: e.target.value})}/></div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2"><span>Dénivelé+ M</span><input type="number" placeholder="0" className="bg-transparent text-right font-black text-cyan-400 outline-none w-20" onChange={e => setVttData({...vttData, denivele: e.target.value})}/></div>
                    </div>
                    <button onClick={() => saveSession('VTT', { ...vttData, calories: calVtt })} className="w-full bg-orange-500 text-black font-black p-4 rounded-xl">SAUVEGARDER LA SORTIE</button>
                </div>
            </div>
        );
    }

    // --- VIEW: PADEL ---
    if (view === "padel") {
        return (
            <div className="min-h-screen bg-black text-white p-6 pb-20">
                <button onClick={() => setView('selection')} className="mb-6 flex items-center gap-2 text-zinc-500 uppercase text-[10px] font-black"><ChevronLeft/> Retour</button>
                <div className="bg-zinc-900 p-6 rounded-[2rem] border border-white/10 space-y-6">
                    <h2 className="font-black italic text-center">SCORE DU MATCH (3 SETS)</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-4 items-center text-center">
                            <span className="text-[10px] font-black text-zinc-500 uppercase">MOI</span>
                            <input type="number" placeholder="S1" className="bg-zinc-800 m-1 h-12 rounded-lg text-center font-black" onChange={e => setPadelData({...padelData, s1M: e.target.value})}/>
                            <input type="number" placeholder="S2" className="bg-zinc-800 m-1 h-12 rounded-lg text-center font-black" onChange={e => setPadelData({...padelData, s2M: e.target.value})}/>
                            <input type="number" placeholder="S3" className="bg-zinc-800 m-1 h-12 rounded-lg text-center font-black" onChange={e => setPadelData({...padelData, s3M: e.target.value})}/>
                        </div>
                        <div className="grid grid-cols-4 items-center text-center">
                            <span className="text-[10px] font-black text-zinc-500 uppercase">ADVERS.</span>
                            <input type="number" placeholder="S1" className="bg-zinc-800 m-1 h-12 rounded-lg text-center font-black" onChange={e => setPadelData({...padelData, s1A: e.target.value})}/>
                            <input type="number" placeholder="S2" className="bg-zinc-800 m-1 h-12 rounded-lg text-center font-black" onChange={e => setPadelData({...padelData, s2A: e.target.value})}/>
                            <input type="number" placeholder="S3" className="bg-zinc-800 m-1 h-12 rounded-lg text-center font-black" onChange={e => setPadelData({...padelData, s3A: e.target.value})}/>
                        </div>
                    </div>
                    <textarea placeholder="Points forts..." className="w-full bg-black/40 p-4 rounded-xl text-xs h-20 outline-none" onChange={e => setPadelData({...padelData, forts: e.target.value})}/>
                    <textarea placeholder="À améliorer..." className="w-full bg-black/40 p-4 rounded-xl text-xs h-20 outline-none" onChange={e => setPadelData({...padelData, faibles: e.target.value})}/>
                    <button onClick={() => saveSession('PADEL', padelData)} className="w-full bg-yellow-500 text-black font-black p-4 rounded-xl uppercase">Enregistrer le Match</button>
                </div>
            </div>
        );
    }

    // --- VIEW: HISTORY ---
    if (view === "history") {
        return (
            <div className="min-h-screen bg-black text-white p-6 pb-20">
                <button onClick={() => setView('selection')} className="mb-6 flex items-center gap-2 text-zinc-500 uppercase text-[10px] font-black"><ChevronLeft/> Retour</button>
                <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-black italic">HISTORIQUE</h2><button onClick={() => {localStorage.removeItem('ag_history_v3'); setHistory([]);}} className="text-red-500"><Trash2 size={20}/></button></div>
                <div className="space-y-4">
                    {history.map(h => (
                        <div key={h.id} className="bg-zinc-900 p-5 rounded-3xl border border-white/5">
                            <div className="flex justify-between text-[10px] font-black text-zinc-600 mb-2"><span>{h.type}</span><span>{h.date}</span></div>
                            {h.type === 'VTT' ? (
                                <p className="font-black text-orange-400 uppercase">{h.km} KM — {h.calories} KCAL</p>
                            ) : (
                                <div>
                                    <p className="font-black text-yellow-500 uppercase">Score: {h.s1M}/{h.s1A} - {h.s2M}/{h.s2A} - {h.s3M}/{h.s3A}</p>
                                    <p className="text-[10px] text-zinc-400 mt-2 italic font-bold">Focus: {h.faibles}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    {history.length === 0 && <div className="text-center text-zinc-700 font-black py-20 uppercase italic">Aucune donnée enregistrée</div>}
                </div>
            </div>
        );
    }

    // --- VIEW: MUSCU (Full avec tous les exos) ---
    return (
        <div className="min-h-screen bg-black text-white pb-32">
            <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl p-6 border-b border-white/10">
                <button onClick={() => setView('selection')} className="mb-2 text-[10px] text-zinc-600 font-black uppercase flex items-center gap-1"><ChevronLeft size={10}/> Menu Principal</button>
                <h1 className="text-4xl font-black italic">{day.toUpperCase()}</h1>
                <div className="flex justify-between text-cyan-500 text-[10px] font-black mt-1"><span>{WORKOUT_DATA[day]?.spec}</span><span>{WORKOUT_DATA[day]?.duration} MIN</span></div>
            </header>

            <main className="p-4 space-y-8">
                {WORKOUT_DATA[day]?.exercises.map((ex) => (
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} key={ex.name} className="bg-zinc-900/50 rounded-[2rem] border border-white/5 overflow-hidden">
                        <div className="relative h-44">
                            <img src={ex.img} className="w-full h-full object-cover opacity-30 grayscale" alt={ex.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                            <div className="absolute bottom-4 left-6">
                                <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">{ex.muscle}</span>
                                <h2 className="text-2xl font-black italic uppercase leading-none">{ex.name}</h2>
                            </div>
                        </div>
                        <div className="p-6 pt-2 space-y-3">
                            <div className="grid grid-cols-4 text-[10px] font-black text-zinc-700 uppercase text-center mb-1"><span>Set</span><span>Kg</span><span>Reps</span><span>Ok</span></div>
                            {[...Array(ex.sets)].map((_, i) => (
                                <div key={i} className="grid grid-cols-4 gap-3 items-center">
                                    <span className="text-center font-black text-zinc-800">{i+1}</span>
                                    <input type="number" placeholder="--" className="bg-zinc-800 rounded-xl p-3 text-center font-black outline-none focus:ring-1 ring-cyan-500" />
                                    <input type="number" placeholder={ex.reps} className="bg-zinc-800 rounded-xl p-3 text-center font-black outline-none focus:ring-1 ring-cyan-500" />
                                    <button 
                                        onClick={() => { vibrate(20); setCompleted({...completed, [`${day}-${ex.name}-${i}`]: !completed[`${day}-${ex.name}-${i}`]}) }}
                                        className={`h-12 rounded-xl flex items-center justify-center ${completed[`${day}-${ex.name}-${i}`] ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-600'}`}
                                    ><Check size={20} strokeWidth={4} /></button>
                                </div>
                            ))}
                            <div className="flex gap-2 pt-4 border-t border-white/5 mt-2">
                                {[60, 90, 120, 180].map(s => (
                                    <button key={s} onClick={() => { setTimeLeft(s); vibrate(10); }} className="flex-1 bg-zinc-800/50 py-3 rounded-xl text-[10px] font-black">
                                        {s}s
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </main>

            <AnimatePresence>
                {timeLeft > 0 && (
                    <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-24 right-6 left-6 z-[100] bg-cyan-500 text-black p-5 rounded-2xl font-black flex justify-between items-center shadow-2xl">
                        <div className="flex items-center gap-3">
                            <Clock className="animate-pulse" />
                            <span className="text-3xl tracking-tighter">
                                {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}
                            </span>
                        </div>
                        <button onClick={() => setTimeLeft(0)} className="bg-black/10 px-4 py-2 rounded-lg text-[10px] uppercase">Passer</button>
                    </motion.div>
                )}
            </AnimatePresence>

            <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-white/10 px-4 pb-8 pt-4 flex justify-between z-50">
                {Object.keys(WORKOUT_DATA).map(d => (
                    <button key={d} onClick={() => { setDay(d); window.scrollTo({top:0, behavior:'smooth'}); }} className={`flex flex-col items-center gap-1 transition-all ${day === d ? 'text-cyan-400 scale-110' : 'text-zinc-600'}`}>
                        <span className="text-[10px] font-black uppercase tracking-tighter">{d.substring(0,3)}</span>
                        {day === d && <div className="w-1 h-1 bg-cyan-400 rounded-full" />}
                    </button>
                ))}
            </nav>
        </div>
    );
}
