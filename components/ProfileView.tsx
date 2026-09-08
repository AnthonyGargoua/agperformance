"use client";

import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import { badgesOf, levelInfo, stats, totalXp } from "@/lib/game";
import { askNotify, fireRestAlert } from "@/lib/alert";
import { Btn, Progress, Screen } from "./ui";

const AVATARS = ["🦁", "🐺", "🐉", "🦅", "🐻", "🦈", "🤖", "👽", "🥷", "🦾", "🐯", "🦏"];

export default function ProfileView({ go }: { go: (v: string) => void }) {
  const { s, set, reset } = useStore();
  const lvl = levelInfo(totalXp(s.history));
  const st = stats(s.history);
  const badges = badgesOf(s.history);
  const [notifState, setNotifState] = useState("");

  const toggle = (k: keyof typeof s.settings) => set({ settings: { ...s.settings, [k]: !s.settings[k] } });

  const enableNotify = async () => {
    const r = await askNotify();
    setNotifState(r === "granted" ? "Notifications activées ✅" : "Refusé par le téléphone ❌");
    if (r === "granted") set({ settings: { ...s.settings, notify: true } });
  };

  return (
    <Screen
      emoji={s.avatar}
      title={s.pseudo}
      sub={`Niveau ${lvl.level} · ${lvl.rank.emoji} ${lvl.rank.name}`}
      right={
        <Btn tone="white" className="px-3 py-3" onClick={() => go("home")}>
          <ChevronLeft size={18} />
        </Btn>
      }
    >
      <div className="card mb-4 p-5">
        <Progress value={lvl.inLevel} max={lvl.need} />
        <p className="mt-1.5 text-[11px] font-black uppercase text-ink/40">
          {totalXp(s.history)} XP au total ⚡
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[
            { e: "⚔️", v: st.sessions, l: "séances" },
            { e: "🔥", v: `${st.streak} j`, l: "série en cours" },
            { e: "🏋️", v: `${st.volume.toLocaleString("fr-FR")} kg`, l: "volume total" },
            { e: "🚵", v: `${Math.round(st.km)} km`, l: "vélo" },
          ].map((k) => (
            <div key={k.l} className="rounded-2xl border-2 border-ink bg-paper p-3">
              <p className="text-lg font-black leading-none">
                {k.e} {k.v}
              </p>
              <p className="text-[10px] font-black uppercase text-ink/40">{k.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card mb-4 p-4">
        <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-ink/40">
          Trophées 🏆 {badges.filter((b) => b.owned).length}/{badges.length}
        </p>
        <div className="grid grid-cols-4 gap-2">
          {badges.map((b) => (
            <div
              key={b.id}
              title={b.desc}
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border-2 border-ink p-1 text-center ${
                b.owned ? "bg-amber" : "bg-paper opacity-40 grayscale"
              }`}
            >
              <span className="text-2xl">{b.owned ? b.emoji : "🔒"}</span>
              <span className="text-[8px] font-black uppercase leading-none">{b.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card mb-4 p-4">
        <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-ink/40">Ton avatar</p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => set({ avatar: a })}
              className={`h-11 w-11 rounded-xl border-2 text-2xl ${
                s.avatar === a ? "border-ink bg-lime shadow-popSm" : "border-transparent bg-paper"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
        <input className="field" value={s.pseudo} maxLength={18} onChange={(e) => set({ pseudo: e.target.value })} />
      </div>

      <div className="card mb-4 divide-y-2 divide-ink/5 p-4">
        <p className="pb-3 text-[11px] font-black uppercase tracking-widest text-ink/40">Alertes du chrono</p>
        {[
          { k: "sound", label: "Son 🔊" },
          { k: "vibration", label: "Vibration 📳" },
          { k: "notify", label: "Notification 🔔" },
          { k: "wakeLock", label: "Écran allumé 💡" },
        ].map((o) => (
          <button
            key={o.k}
            onClick={() => toggle(o.k as any)}
            className="flex w-full items-center justify-between py-3 text-left font-black"
          >
            {o.label}
            <span
              className={`flex h-7 w-12 items-center rounded-full border-2 border-ink px-0.5 ${
                (s.settings as any)[o.k] ? "bg-lime" : "bg-paper"
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full border-2 border-ink bg-white transition-transform ${
                  (s.settings as any)[o.k] ? "translate-x-5" : ""
                }`}
              />
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Btn tone="violet" className="py-4 text-xs" onClick={enableNotify}>
          🔔 Autoriser
        </Btn>
        <Btn tone="sky" className="py-4 text-xs" onClick={() => fireRestAlert(s.settings, "Ceci est un test 👌")}>
          🧪 Tester
        </Btn>
      </div>
      {notifState && <p className="mt-2 text-center text-xs font-black text-ink/50">{notifState}</p>}

      <Btn
        tone="white"
        className="mt-6 w-full py-3 text-xs"
        onClick={() => confirm("Effacer toutes tes données ? Aucun retour possible.") && reset()}
      >
        🗑️ Tout effacer
      </Btn>
    </Screen>
  );
}
