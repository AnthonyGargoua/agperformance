"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { fireRestAlert, tickSound, unlockAudio } from "@/lib/alert";

export function useRestTimer() {
  const { s } = useStore();
  const [total, setTotal] = useState(0);
  const [left, setLeft] = useState(0);
  const [paused, setPaused] = useState(false);
  const endAt = useRef(0);
  const lastBeep = useRef(-1);

  const start = (seconds: number, label = "") => {
    unlockAudio();
    setTotal(seconds);
    setLeft(seconds);
    setPaused(false);
    lastBeep.current = -1;
    endAt.current = Date.now() + seconds * 1000;
    (start as any).label = label;
  };

  const stop = () => {
    endAt.current = 0;
    setTotal(0);
    setLeft(0);
    setPaused(false);
    document.title = "AG Performance ⚡";
  };

  const bump = (delta: number) => {
    if (!total) return;
    endAt.current += delta * 1000;
    setTotal((t) => Math.max(5, t + delta));
    setLeft(Math.max(1, Math.ceil((endAt.current - Date.now()) / 1000)));
  };

  const toggle = () => {
    if (!total) return;
    if (paused) {
      endAt.current = Date.now() + left * 1000;
      setPaused(false);
    } else setPaused(true);
  };

  useEffect(() => {
    if (!total || paused) return;
    const id = setInterval(() => {
      const l = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      setLeft(l);
      document.title = `⏱️ ${l}s — AG Performance`;
      if (l <= 3 && l > 0 && lastBeep.current !== l) {
        lastBeep.current = l;
        if (s.settings.sound) tickSound();
      }
      if (l === 0) {
        fireRestAlert(s.settings, "Série suivante, on y retourne 💪");
        stop();
      }
    }, 250);
    return () => clearInterval(id);
  }, [total, paused, s.settings]);

  return { total, left, paused, running: total > 0, start, stop, bump, toggle };
}

export function RestBar({ t }: { t: ReturnType<typeof useRestTimer> }) {
  const pct = t.total ? (t.left / t.total) * 100 : 0;
  const mm = Math.floor(t.left / 60);
  const ss = String(t.left % 60).padStart(2, "0");

  return (
    <AnimatePresence>
      {t.running && (
        <motion.div
          initial={{ y: 140 }}
          animate={{ y: 0 }}
          exit={{ y: 140 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="fixed inset-x-3 bottom-[96px] z-[150] mx-auto max-w-md overflow-hidden rounded-[26px] border-2 border-ink bg-ink text-white shadow-popLg"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <span className={`text-3xl ${t.left <= 3 ? "animate-wiggle" : ""}`}>⏱️</span>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Repos</p>
              <p className="tabnum text-3xl font-black leading-none">
                {mm}:{ss}
              </p>
            </div>
            <button onClick={() => t.bump(-15)} className="rounded-xl bg-white/10 px-3 py-2 text-xs font-black">
              −15
            </button>
            <button onClick={() => t.bump(15)} className="rounded-xl bg-white/10 px-3 py-2 text-xs font-black">
              +15
            </button>
            <button onClick={t.toggle} className="rounded-xl bg-white/10 p-2">
              {t.paused ? <Play size={18} /> : <Pause size={18} />}
            </button>
            <button onClick={t.stop} className="rounded-xl bg-pink p-2">
              <X size={18} />
            </button>
          </div>
          <div className="h-2 w-full bg-white/10">
            <div
              className="h-full bg-amber transition-[width] duration-200 ease-linear"
              style={{ width: `${pct}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
