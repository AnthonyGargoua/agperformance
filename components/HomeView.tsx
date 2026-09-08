"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bike, ChevronRight, Trophy, Zap } from "lucide-react";
import { useStore } from "@/lib/store";
import { ACCENTS } from "@/lib/program";
import { badgesOf, dayKey, levelInfo, quests, stats, totalXp, weekDays, WEEKDAYS } from "@/lib/game";
import { Btn, Progress, Screen } from "./ui";

export default function HomeView({ go }: { go: (v: string, p?: any) => void }) {
  const { s } = useStore();
  const xp = totalXp(s.history);
  const lvl = levelInfo(xp);
  const st = stats(s.history);
  const qs = quests(s.history);
  const badges = badgesOf(s.history).filter((b) => b.owned);
  const week = weekDays();
  const doneDays = new Set(s.history.map((e) => e.date));

  const today = new Date();
  const todayDay = s.program.find((d) => d.weekday === today.getDay());
  const doneToday = s.history.some((e) => e.date === dayKey());

  return (
    <Screen
      emoji="⚡"
      title="AG Performance"
      sub={`${WEEKDAYS[today.getDay()]} — on lâche rien`}
      right={
        <button
          onClick={() => go("profile")}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-ink bg-white text-3xl shadow-pop active:translate-y-1 active:shadow-none"
        >
          {s.avatar}
        </button>
      }
    >
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card mb-4 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-ink/40">{s.pseudo}</p>
            <h2 className="text-2xl font-black leading-tight">
              {lvl.rank.emoji} {lvl.rank.name}
            </h2>
          </div>
          <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl border-2 border-ink bg-violet text-white">
            <span className="text-[9px] font-black uppercase leading-none">Niv.</span>
            <span className="text-2xl font-black leading-none">{lvl.level}</span>
          </div>
        </div>

        <Progress value={lvl.inLevel} max={lvl.need} />
        <p className="mt-1.5 text-[11px] font-black uppercase text-ink/40">
          {lvl.inLevel} / {lvl.need} XP — encore {lvl.need - lvl.inLevel} pour le niveau {lvl.level + 1} 🚀
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { e: "🔥", v: st.streak, l: "jours" },
            { e: "⚔️", v: st.sessions, l: "séances" },
            { e: "🏋️", v: `${Math.round(st.volume / 1000)}t`, l: "soulevés" },
          ].map((k) => (
            <div key={k.l} className="rounded-2xl border-2 border-ink bg-paper py-2 text-center">
              <p className="text-xl font-black leading-none">
                {k.e} {k.v}
              </p>
              <p className="text-[10px] font-black uppercase text-ink/40">{k.l}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="card mb-4 p-4">
        <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-ink/40">Ta semaine 📅</p>
        <div className="flex justify-between">
          {week.map((d, i) => {
            const ok = doneDays.has(d);
            const isToday = d === dayKey();
            return (
              <div key={d} className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink text-sm font-black ${
                    ok ? "bg-lime" : isToday ? "bg-amber" : "bg-paper text-ink/25"
                  }`}
                >
                  {ok ? "✓" : d.slice(-2)}
                </div>
                <span className="text-[9px] font-black uppercase text-ink/40">
                  {["L", "M", "M", "J", "V", "S", "D"][i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {todayDay ? (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => go("workout", todayDay.id)}
          className="mb-4 w-full overflow-hidden rounded-[26px] border-2 border-ink text-left shadow-popLg"
          style={{ background: ACCENTS[todayDay.accent] }}
        >
          <div className="p-5 text-white">
            <p className="text-[11px] font-black uppercase tracking-widest text-white/70">
              {doneToday ? "Déjà validé aujourd'hui 🎉" : "Ta mission du jour"}
            </p>
            <h3 className="mt-1 text-3xl font-black leading-none">
              {todayDay.emoji} {todayDay.title}
            </h3>
            <p className="mt-1 text-sm font-bold text-white/80">
              {todayDay.exercises.length} exercices ·{" "}
              {todayDay.exercises.reduce((n, e) => n + e.sets, 0)} séries
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border-2 border-ink bg-white px-4 py-2 font-black uppercase text-ink shadow-popSm">
              <Zap size={16} /> {doneToday ? "Refaire" : "Lancer la séance"}
            </div>
          </div>
        </motion.button>
      ) : (
        <div className="card mb-4 flex items-center justify-between p-5">
          <div>
            <h3 className="text-2xl font-black">Repos 🛌</h3>
            <p className="text-sm font-bold text-ink/50">Rien de prévu aujourd'hui</p>
          </div>
          <Btn tone="violet" className="px-4 py-3 text-xs" onClick={() => go("workout")}>
            Séance libre
          </Btn>
        </div>
      )}

      <div className="card mb-4 p-4">
        <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-ink/40">Quêtes 🎯</p>
        <div className="space-y-3">
          {qs.map((q) => {
            const done = q.value >= q.goal;
            return (
              <div key={q.label}>
                <div className="mb-1 flex items-center justify-between text-sm font-black">
                  <span className={done ? "text-lime" : ""}>
                    {q.emoji} {q.label} {done && "✅"}
                  </span>
                  <span className="text-[11px] text-ink/40">+{q.xp} XP</span>
                </div>
                <Progress value={q.value} max={q.goal} tone={done ? "#22CC7A" : "#171223"} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Btn tone="sky" className="flex-col gap-0 py-5" onClick={() => go("journal", "vtt")}>
          <Bike size={26} />
          <span className="text-base">VTT 🚵</span>
        </Btn>
        <Btn tone="amber" className="flex-col gap-0 py-5" onClick={() => go("journal", "padel")}>
          <Trophy size={26} />
          <span className="text-base">Padel 🎾</span>
        </Btn>
      </div>

      <button onClick={() => go("profile")} className="card flex w-full items-center gap-3 p-4 text-left">
        <div className="flex-1">
          <p className="text-[11px] font-black uppercase tracking-widest text-ink/40">Trophées</p>
          <p className="text-lg font-black">
            {badges.length > 0 ? badges.slice(0, 8).map((b) => b.emoji).join(" ") : "Aucun pour l'instant 🔓"}
          </p>
        </div>
        <ChevronRight className="text-ink/30" />
      </button>
    </Screen>
  );
}
