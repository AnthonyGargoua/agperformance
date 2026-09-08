"use client";

import React, { useCallback, useState } from "react";
import { StoreProvider, useStore } from "@/lib/store";
import { RestBar, useRestTimer } from "@/components/RestTimer";
import HomeView from "@/components/HomeView";
import WorkoutView from "@/components/WorkoutView";
import ProgramView from "@/components/ProgramView";
import JournalView from "@/components/JournalView";
import ProfileView from "@/components/ProfileView";

const TABS = [
  { id: "home", emoji: "🏠", label: "Accueil" },
  { id: "workout", emoji: "🔥", label: "Séance" },
  { id: "program", emoji: "🛠️", label: "Plan" },
  { id: "journal", emoji: "📖", label: "Journal" },
];

export default function Page() {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  );
}

function App() {
  const { s } = useStore();
  const timer = useRestTimer();
  const [view, setView] = useState("home");
  const [preset, setPreset] = useState<string | undefined>();
  const [dayId, setDayId] = useState(
    () => (s.program.find((d) => d.weekday === new Date().getDay()) || s.program[0])?.id
  );

  const go = (v: string, payload?: any) => {
    if (v === "workout" && payload) setDayId(payload);
    if (v === "journal" && payload) setPreset(payload);
    setView(v);
    window.scrollTo({ top: 0 });
  };

  const clearPreset = useCallback(() => setPreset(undefined), []);

  return (
    <div className="min-h-[100dvh]">
      <div key={view}>
        {view === "home" && <HomeView go={go} />}
        {view === "workout" && <WorkoutView dayId={dayId} setDayId={setDayId} timer={timer} />}
        {view === "program" && <ProgramView />}
        {view === "journal" && <JournalView preset={preset} clearPreset={clearPreset} />}
        {view === "profile" && <ProfileView go={go} />}
      </div>

      <RestBar t={timer} />

      <nav className="fixed inset-x-0 bottom-0 z-[160] border-t-2 border-ink bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto flex max-w-md justify-around px-2 py-2">
          {TABS.map((t) => {
            const active = view === t.id || (t.id === "home" && view === "profile");
            return (
              <button
                key={t.id}
                onClick={() => go(t.id)}
                className={`flex w-[22%] flex-col items-center gap-0.5 rounded-2xl py-2 transition-transform ${
                  active ? "scale-105 bg-paper" : "opacity-40"
                }`}
              >
                <span className="text-2xl leading-none">{t.emoji}</span>
                <span className="text-[10px] font-black uppercase">{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
