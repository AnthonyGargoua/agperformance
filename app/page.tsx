"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check, Zap, Dumbbell, Bike, Trophy, ChevronLeft, Flame, TrendingUp, Map } from 'lucide-react';

// --- DONNÉES MUSCU (Ton code actuel) ---
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
    "Lundi": { spec: "Push 1 - Pecs/Tri", duration: "75", exercises: [{ name: "Dév. Couché Barre", sets: 4, reps: "6-8", muscle: "Pecs", img: IMGS.pecs }, { name: "Barre au Front", sets: 3, reps: "10-12", muscle: "Triceps", img: IMGS.bras }] },
    "Mardi": { spec: "Pull 1 - Dos/Bi", duration: "70", exercises: [{ name: "Soulevé de Terre", sets: 3, reps: "5", muscle: "Dos", img: IMGS.dos }, { name: "Curl Barre EZ", sets: 3, reps: "8-10", muscle: "Biceps", img: IMGS.bras }] },
    "Mercredi": { spec: "Legs 1 - Quads", duration: "85", exercises: [{ name: "Squat Barre Haute", sets: 4, reps: "6-8", muscle: "Cuisses", img: IMGS.legs }] },
    "Jeudi": { spec: "Push 2 - Epaules/Pecs", duration: "75", exercises: [{ name: "Dév. Militaire Barre", sets: 4, reps: "6-8", muscle: "Epaules", img: IMGS.epaules }] },
    "Vendredi": { spec: "Pull 2 - Largeur Dos", duration: "70", exercises: [{ name: "Tirage Vertical Large", sets: 4, reps: "10-12", muscle: "Dos", img: IMGS.dos }] },
    "Samedi": { spec: "Legs 2 - Ischios", duration: "80", exercises: [{ name: "SdT Jambes Tendues", sets: 4, reps: "8-10", muscle: "Ischios", img: IMGS.legs }] }
};

export default function App() {
    const [view, setView] = useState("selection"); // selection, muscu, vtt, padel
    const [day, setDay] = useState("Lundi");
    const [timeLeft, setTimeLeft] = useState(0);
    const [completed, setCompleted] = useState({});

    const vibrate = (pattern: number | number[]) => {
        if (typeof window !== "undefined" && navigator.vibrate) navigator.vibrate(pattern);
    };

    // --- RENDER SELECTION ---
    if (view === "selection") {
        return (
            <div className="min-h-screen bg-black flex flex-col justify-center p-6 gap-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                    <span className="text-cyan-400 font-black tracking-[0.3em] text-[10px] uppercase">AG PERFORMANCE</span>
                    <h1 className="text-5xl font-black italic tracking-tighter text-white">CHOISIS TON <span className="text-cyan-400">DEFI</span></h1>
                </motion.div>

                {[
                    { id: 'muscu', label: 'MUSCULATION', icon: <Dumbbell size={32}/>, img: IMGS.pecs, desc: 'Force & Hypertrophie' },
                    { id: 'vtt', label: 'VTT / CYCLISME', icon: <Bike size={32}/>, img: IMGS.vtt, desc: 'Endurance & Dénivelé' },
                    { id: 'padel', label: 'PADEL TENNIS', icon: <Trophy size={32}/>, img: IMGS.padel, desc: 'Score & Performance' }
                ].map((item, idx) => (
                    <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                        onClick={() => { setView(item.id); vibrate(15); }}
                        className="relative h-32 rounded-[2rem] overflow-hidden border border-white/10 group"
                    >
                        <img src={item.img} className="absolute inset-0 w-full h-full object-cover opacity-40 group-active:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                        <div className="relative flex items-center p-8 gap-6">
                            <div className="text-cyan-400">{item.icon}</div>
                            <div className="text-left">
                                <h2 className="text-2xl font-black italic text-white uppercase">{item.label}</h2>
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{item.desc}</p>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        );
    }

    // --- RENDER VTT ---
    if (view === "vtt") {
        return (
            <div className="min-h-screen bg-black text-white p-6 pb-32">
                <button onClick={() => setView('selection')} className="mb-8 flex items-center gap-2 text-zinc-500 font-bold text-xs uppercase"><ChevronLeft size={16}/> Retour</button>
                <h1 className="text-4xl font-black italic mb-8">SESSION <span className="text-cyan-400">VTT</span></h1>
                
                <div className="grid grid-cols-1 gap-4">
                    {[
                        { label: 'Distance (KM)', icon: <TrendingUp size={20}/>, placeholder: '0.00' },
                        { label: 'Dénivelé Positif (M)', icon: <Map size={20}/>, placeholder: '0' },
                        { label: 'Calories (KCAL)', icon: <Flame size={20}/>, placeholder: '0' },
                        { label: 'Temps Total', icon: <Clock size={20}/>, placeholder: '00:00:00' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-cyan-400">{stat.icon}</div>
                                <span className="font-bold text-sm uppercase text-zinc-400">{stat.label}</span>
                            </div>
                            <input type="number" placeholder={stat.placeholder} className="bg-transparent text-right text-2xl font-black text-cyan-400 w-24 outline-none" />
                        </div>
                    ))}
                    <button onClick={() => { vibrate([50, 30, 50]); setView('selection'); }} className="mt-8 bg-cyan-400 text-black font-black p-6 rounded-2xl uppercase italic tracking-tighter">Enregistrer la sortie</button>
                </div>
            </div>
        );
    }

    // --- RENDER PADEL ---
    if (view === "padel") {
        return (
            <div className="min-h-screen bg-black text-white p-6 pb-32">
                <button onClick={() => setView('selection')} className="mb-8 flex items-center gap-2 text-zinc-500 font-bold text-xs uppercase"><ChevronLeft size={16}/> Retour</button>
                <h1 className="text-4xl font-black italic mb-8 uppercase">Stats <span className="text-cyan-400">Padel</span></h1>
                
                <div className="space-y-6">
                    <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-white/10 text-center">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Score Final</span>
                        <div className="flex justify-center items-center gap-6 mt-4">
                            <input type="number" placeholder="0" className="bg-zinc-800 w-16 h-16 rounded-2xl text-center text-3xl font-black text-cyan-400 outline-none" />
                            <span className="text-2xl font-black text-zinc-700">VS</span>
                            <input type="number" placeholder="0" className="bg-zinc-800 w-16 h-16 rounded-2xl text-center text-3xl font-black text-white outline-none" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-black italic uppercase text-zinc-500 text-xs tracking-widest">Analyse du Match</h3>
                        <textarea placeholder="Points forts (ex: bandeja, service...)" className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-sm font-bold outline-none focus:border-cyan-400 h-24" />
                        <textarea placeholder="Points faibles à bosser..." className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-sm font-bold outline-none focus:border-cyan-400 h-24" />
                    </div>
                    <button onClick={() => { vibrate([50, 30, 50]); setView('selection'); }} className="w-full bg-white text-black font-black p-6 rounded-2xl uppercase italic tracking-tighter">Sauvegarder le match</button>
                </div>
            </div>
        );
    }

    // --- RENDER MUSCU (Ton code existant encapsulé) ---
    return (
        <div className="min-h-screen bg-black text-white pb-32 font-sans">
            <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl p-6 border-b border-white/10">
                <button onClick={() => setView('selection')} className="mb-2 flex items-center gap-1 text-zinc-600 font-bold text-[10px] uppercase italic tracking-widest"><ChevronLeft size={12}/> Menu Principal</button>
                <h1 className="text-4xl font-black italic">{day.toUpperCase()}</h1>
                <div className="flex justify-between text-xs font-bold text-zinc-500 mt-2">
                    <span className="text-cyan-500 uppercase italic">{WORKOUT_DATA[day].spec}</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> {WORKOUT_DATA[day].duration} MIN</span>
                </div>
            </header>

            <main className="p-4 space-y-8">
                {WORKOUT_DATA[day].exercises.map((ex) => (
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} key={ex.name} className="bg-zinc-900/50 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                        <div className="relative h-44">
                            <img src={ex.img} className="w-full h-full object-cover opacity-40 grayscale" alt={ex.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                            <div className="absolute bottom-4 left-6">
                                <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">{ex.muscle}</span>
                                <h2 className="text-2xl font-black italic leading-tight uppercase">{ex.name}</h2>
                            </div>
                        </div>
                        <div className="p-6 pt-2 space-y-3">
                            <div className="grid grid-cols-4 text-[10px] font-black text-zinc-600 uppercase text-center mb-1"><span>Set</span><span>Kg</span><span>Reps</span><span>Ok</span></div>
                            {[...Array(ex.sets)].map((_, i) => (
                                <div key={i} className="grid grid-cols-4 gap-3 items-center">
                                    <span className="text-center font-black text-zinc-700">{i+1}</span>
                                    <input type="number" placeholder="--" className="bg-zinc-800 border-none rounded-xl p-3 text-center font-bold outline-none" />
                                    <input type="number" placeholder={ex.reps} className="bg-zinc-800 border-none rounded-xl p-3 text-center font-bold outline-none" />
                                    <button onClick={() => { vibrate(20); setCompleted(prev => ({...prev, [`${day}-${ex.name}-${i}`]: !prev[`${day}-${ex.name}-${i}`]})); }} className={`h-12 rounded-xl flex items-center justify-center transition-all ${completed[`${day}-${ex.name}-${i}`] ? 'bg-cyan-500 text-black scale-90' : 'bg-zinc-800 text-zinc-600'}`}><Check size={20} strokeWidth={4} /></button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </main>

            {/* NAV BAR MUSCU (Uniquement si vue muscu) */}
            <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-white/10 px-4 pb-8 pt-4 flex justify-between z-50">
                {Object.keys(WORKOUT_DATA).map(d => (
                    <button key={d} onClick={() => { setDay(d); window.scrollTo({top:0, behavior:'smooth'}); vibrate(5); }} className={`flex flex-col items-center gap-1 transition-all ${day === d ? 'text-cyan-400 scale-110' : 'text-zinc-600'}`}>
                        <span className="text-[10px] font-black uppercase tracking-tighter">{d.substring(0,3)}</span>
                        {day === d && <motion.div layoutId="nav" className="w-1 h-1 bg-cyan-400 rounded-full" />}
                    </button>
                ))}
            </nav>
        </div>
    );
}
