"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { DEFAULT_PROGRAM } from "./program";
import { dayKey, uid } from "./game";
import { registerSW } from "./alert";
import type { Entry, SetLog, Store } from "./types";

const KEY = "ag_perf_v4";

const INITIAL: Store = {
  program: DEFAULT_PROGRAM,
  history: [],
  drafts: {},
  settings: { sound: true, vibration: true, notify: true, wakeLock: true },
  avatar: "🦁",
  pseudo: "Athlète",
};

type Ctx = {
  s: Store;
  set: (patch: Partial<Store>) => void;
  setDraft: (dayId: string, logs: Record<string, SetLog[]>) => void;
  addEntry: (e: Omit<Entry, "id" | "date"> & { date?: string }) => void;
  removeEntry: (id: string) => void;
  reset: () => void;
};

const StoreCtx = createContext<Ctx>(null as any);
export const useStore = () => useContext(StoreCtx);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<Store>(INITIAL);
  const [ready, setReady] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        const today = dayKey();
        // On ne garde que le brouillon du jour, les anciens sont périmés
        const drafts = Object.fromEntries(
          Object.entries(saved.drafts || {}).filter(([k]) => k.startsWith(today))
        );
        setS({ ...INITIAL, ...saved, drafts, settings: { ...INITIAL.settings, ...saved.settings } });
      }
    } catch {}
    setReady(true);
    registerSW();
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (ready) localStorage.setItem(KEY, JSON.stringify(s));
  }, [s, ready]);

  const set = (patch: Partial<Store>) => setS((prev) => ({ ...prev, ...patch }));

  const setDraft = (dayId: string, logs: Record<string, SetLog[]>) =>
    setS((prev) => ({ ...prev, drafts: { ...prev.drafts, [`${dayKey()}|${dayId}`]: logs } }));

  const addEntry: Ctx["addEntry"] = (e) =>
    setS((prev) => ({
      ...prev,
      history: [{ id: uid(), date: e.date || dayKey(), ...e } as Entry, ...prev.history],
    }));

  const removeEntry = (id: string) =>
    setS((prev) => ({ ...prev, history: prev.history.filter((h) => h.id !== id) }));

  const reset = () => {
    localStorage.removeItem(KEY);
    setS(INITIAL);
  };

  if (!ready) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <div className="animate-wiggle text-6xl">⚡</div>
      </div>
    );
  }

  return (
    <StoreCtx.Provider value={{ s, set, setDraft, addEntry, removeEntry, reset }}>
      {children}
    </StoreCtx.Provider>
  );
}
