"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check, Zap } from 'lucide-react';

const IMGS = {
    pecs: "https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=600",
    dos: "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?q=80&w=600",
    legs: "https://images.unsplash.com/photo-1434608216196-18084a9e526c?q=80&w=600",
    epaules: "https://images.unsplash.com/photo-1541534741688-6078c6bd35e5?q=80&w=600",
    bras: "https://images.unsplash.com/photo-1581009146145-b5ef03a7401a?q=80&w=600"
};

const WORKOUT_DATA = {
    "Lundi": { spec: "Push 1 - Pecs/Tri", duration: "75", exercises: [
        { name: "Dév. Couché Barre", sets: 4, reps: "6-8", muscle: "Pecs", img: IMGS.pecs },
        { name: "Dév. Incliné Haltères", sets: 3, reps: "10-12", muscle: "Pecs Haut", img: IMGS.pecs },
        { name: "Dév. Militaire Assis", sets: 3, reps: "8-10", muscle: "Epaules", img: IMGS.epaules },
        { name: "Ecartés Poulie Vis-à-vis", sets: 3, reps: "12-15", muscle: "Pecs", img: IMGS.pecs },
        { name: "Barre au Front", sets: 3, reps: "10-12", muscle: "Triceps", img: IMGS.bras }
    ]},
    "Mardi": { spec: "Pull 1 - Dos/Bi", duration: "70", exercises: [
        { name: "Soulevé de Terre", sets: 3, reps: "5", muscle: "Dos", img: IMGS.dos },
        { name: "Tractions Lestées", sets: 3, reps: "6-8", muscle: "Dos", img: IMGS.dos },
        { name: "Rowing Barre T", sets: 3, reps: "10-12", muscle: "Dos", img: IMGS.dos },
        { name: "Oiseau Poulie", sets: 3, reps: "15", muscle: "Epaules", img: IMGS.epaules },
        { name: "Curl Barre EZ", sets: 3, reps: "8-10", muscle: "Biceps", img: IMGS.bras }
    ]},
    "Mercredi": { spec: "Legs 1 - Quads", duration: "85", exercises: [
        { name: "Squat Barre Haute", sets: 4, reps: "6-8", muscle: "Cuisses", img: IMGS.legs },
        { name: "Presse à Cuisses", sets: 3, reps: "10-15", muscle: "Quads", img: IMGS.legs },
        { name: "Leg Extension", sets: 3, reps: "15-20", muscle: "Quads", img: IMGS.legs },
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
    "Samedi": { spec: "Legs 2 - Ischios", duration: "80", exercises: [
        { name: "SdT Jambes Tendues", sets: 4, reps: "8-10", muscle: "Ischios", img: IMGS.legs },
        { name: "Hip Thrust", sets: 3, reps: "8-10", muscle: "Fessiers", img: IMGS.legs },
        { name: "Leg Curl Assis", sets: 3, reps: "12-15", muscle: "Ischios", img: IMGS.legs },
        { name: "Abducteurs Machine", sets: 3, reps: "15", muscle: "Fessiers", img: IMGS.legs },
        { name: "Presse Pieds Hauts", sets: 3, reps: "12", muscle: "Ischios", img: IMGS.legs }
    ]}
};

export default function App() {
    const [day, setDay] = useState("Lundi");
    const [timeLeft, setTimeLeft] = useState(0);
    const [completed, setCompleted] = useState({});

    const vibrate = (pattern: number | number[]) => {
        if (typeof window !== "undefined" && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    };

    useEffect(() => {
        if (timeLeft > 0) {
            const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(t);
        } else if (timeLeft === 0 && timeLeft !== null) {
            vibrate([400, 200, 400]);
        }
    }, [timeLeft]);

    return (
        <div className="min-h-screen bg-black text-white pb-32 font-sans">
            <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl p-6 border-b border-white/10">
                <div className="flex items-center gap-2 text-cyan-400 mb-1">
                    <Zap size={14} fill="currentColor" />
                    <span className="text-[10px] font-black tracking-widest uppercase">AG PERFORMANCE</span>
                </div>
                <h1 className="text-4xl font-black italic">{day.toUpperCase()}</h1>
                <div className="flex justify-between text-xs font-bold text-zinc-500 mt-2">
                    <span className="text-cyan-500 uppercase italic">{WORKOUT_DATA[day].spec}</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> {WORKOUT_DATA[day].duration} MIN</span>
                </div>
            </header>

            <main className="p-4 space-y-8">
                {WORKOUT_DATA[day].exercises.map((ex) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        key={ex.name} 
                        className="bg-zinc-900/50 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl"
                    >
                        <div className="relative h-44">
                            <img src={ex.img} className="w-full h-full object-cover opacity-40 grayscale" alt={ex.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                            <div className="absolute bottom-4 left-6">
                                <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">{ex.muscle}</span>
                                <h2 className="text-2xl font-black italic leading-tight uppercase">{ex.name}</h2>
                            </div>
                        </div>

                        <div className="p-6 pt-2 space-y-3">
                            <div className="grid grid-cols-4 text-[10px] font-black text-zinc-600 uppercase text-center mb-1">
                                <span>Set</span><span>Kg</span><span>Reps</span><span>Ok</span>
                            </div>
                            {[...Array(ex.sets)].map((_, i) => (
                                <div key={i} className="grid grid-cols-4 gap-3 items-center">
                                    <span className="text-center font-black text-zinc-700">{i+1}</span>
                                    <input type="number" placeholder="--" className="bg-zinc-800 border-none rounded-xl p-3 text-center font-bold focus:ring-1 ring-cyan-500 outline-none transition-all" />
                                    <input type="number" placeholder={ex.reps} className="bg-zinc-800 border-none rounded-xl p-3 text-center font-bold focus:ring-1 ring-cyan-500 outline-none transition-all" />
                                    <button 
                                        onClick={() => {
                                            const key = `${day}-${ex.name}-${i}`;
                                            setCompleted(prev => ({...prev, [key]: !prev[key]}));
                                            vibrate(20);
                                        }}
                                        className={`h-12 rounded-xl flex items-center justify-center transition-all ${completed[`${day}-${ex.name}-${i}`] ? 'bg-cyan-500 text-black scale-90 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-zinc-800 text-zinc-600'}`}
                                    >
                                        <Check size={20} strokeWidth={4} />
                                    </button>
                                </div>
                            ))}
                            <div className="flex gap-2 pt-4 border-t border-white/5 mt-2">
                                {[60, 90, 120, 180].map(s => (
                                    <button key={s} onClick={() => { setTimeLeft(s); vibrate(10); }} className="flex-1 bg-zinc-800/50 py-3 rounded-xl text-[10px] font-black uppercase border border-white/5 active:bg-cyan-500 active:text-black transition-colors">
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
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        className="fixed bottom-24 right-6 left-6 z-[100] bg-cyan-500 text-black p-4 rounded-2xl font-black flex justify-between items-center shadow-2xl"
                    >
                        <span className="uppercase text-xs tracking-tighter">Repos actif</span>
                        <span className="text-3xl tracking-tighter">{Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</span>
                        <button onClick={() => setTimeLeft(0)} className="bg-black/10 p-2 rounded-lg text-[10px]">SKIP</button>
                    </motion.div>
                )}
            </AnimatePresence>

            <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-white/10 px-4 pb-8 pt-4 flex justify-between z-50">
                {Object.keys(WORKOUT_DATA).map(d => (
                    <button 
                        key={d} onClick={() => { setDay(d); window.scrollTo({top:0, behavior:'smooth'}); vibrate(5); }}
                        className={`flex flex-col items-center gap-1 transition-all ${day === d ? 'text-cyan-400 scale-110' : 'text-zinc-600'}`}
                    >
                        <span className="text-[10px] font-black uppercase tracking-tighter">{d.substring(0,3)}</span>
                        {day === d && <motion.div layoutId="nav" className="w-1 h-1 bg-cyan-400 rounded-full" />}
                    </button>
                ))}
            </nav>
        </div>
    );
}
