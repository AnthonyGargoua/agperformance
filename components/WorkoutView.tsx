"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Timer } from "lucide-react";
import { useStore } from "@/lib/store";
import { ACCENTS } from "@/lib/program";
import { badgesOf, bestLifts, dayKey, levelInfo, totalXp, xpForMuscu } from "@/lib/game";
import { Btn, Progress, Screen, Sheet } from "./ui";
import type { SetLog } from "@/lib/types";

const emptyLogs = (day: any) =>
  Object.fromEntries(
    day.exercises.map((e: any) => [
      e.id,
      Array.from({ length: e.sets }, () => ({ kg: "", reps: "", done: false })),
    ])
  );

export default function WorkoutView({ dayId, setDayId, timer }: any) {
  const { s, set, setDraft, addEntry } = useStore();
  const day = s.program.find((d) => d.id === dayId) || s.program[0];
  const accent = ACCENTS[day?.accent] || ACCENTS.violet;
  const draftKey = `${dayKey()}|${day?.id}`;
  const logs: Record<string, SetLog[]> = s.drafts[draftKey] || emptyLogs(day);

  const records = useMemo(() => bestLifts(s.history), [s.history]);
  const [pr, setPr] = useState<string | null>(null);
  const [summary, setSummary] = useState<any>(null);

  // Garde l'écran allumé pendant la séance
  useEffect(() => {
    if (!s.settings.wakeLock) return;
    let lock: any;
    (navigator as any).wakeLock
      ?.request("screen")
      .then((l: any) => (lock = l))
      .catch(() => {});
    return () => lock?.release?.().catch(() => {});
  }, [s.settings.wakeLock]);

  if (!day) return null;

  const update = (exId: string, i: number, patch: Partial<SetLog>) => {
    const rows = logs[exId] || [];
    setDraft(day.id, { ...logs, [exId]: rows.map((l, k) => (k === i ? { ...l, ...patch } : l)) });
  };

  const totalSets = day.exercises.reduce((n: number, e: any) => n + e.sets, 0);
  const doneSets = Object.values(logs).flat().filter((l: any) => l.done).length;

  const validate = (ex: any, i: number) => {
    const cur = logs[ex.id][i];
    const kg = parseFloat(cur.kg) || 0;
    if (!cur.done && kg > 0 && kg > (records[ex.name] || 0)) {
      setPr(ex.name);
      setTimeout(() => setPr(null), 1600);
    }
    update(ex.id, i, { done: !cur.done });
    if (!cur.done && ex.rest) timer.start(ex.rest, ex.name);
  };

  const finish = () => {
    const before = badgesOf(s.history)
      .filter((b) => b.owned)
      .map((b) => b.id);

    let volume = 0;
    let prs = 0;
    const perf = day.exercises
      .map((ex: any) => {
        const done = (logs[ex.id] || []).filter((l) => l.done);
        done.forEach((l) => (volume += (parseFloat(l.kg) || 0) * (parseFloat(l.reps) || 0)));
        const best = Math.max(0, ...done.map((l) => parseFloat(l.kg) || 0));
        if (best > 0 && best > (records[ex.name] || 0)) prs++;
        return done.length ? { name: ex.name, best, reps: `${done.length} séries` } : null;
      })
      .filter(Boolean) as any[];

    const xp = xpForMuscu(doneSets, prs);
    const entry = {
      kind: "muscu" as const,
      title: day.title,
      emoji: day.emoji,
      xp,
      volume: Math.round(volume),
      sets: doneSets,
      perf,
    };
    addEntry(entry);

    const drafts = { ...s.drafts };
    delete drafts[draftKey];
    set({ drafts });

    const after = badgesOf([{ id: "tmp", date: dayKey(), ...entry } as any, ...s.history]);
    setSummary({
      xp,
      volume: Math.round(volume),
      prs,
      sets: doneSets,
      newBadges: after.filter((b) => b.owned && !before.includes(b.id)),
    });
  };

  return (
    <Screen emoji={day.emoji} title={day.title} sub={`${doneSets}/${totalSets} séries validées`}>
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {s.program.map((d) => (
          <button
            key={d.id}
            onClick={() => setDayId(d.id)}
            className={`chip shrink-0 ${d.id === day.id ? "text-white shadow-popSm" : "bg-white text-ink/50"}`}
            style={d.id === day.id ? { background: ACCENTS[d.accent] } : undefined}
          >
            {d.emoji} {d.label.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="card mb-4 p-4">
        <Progress value={doneSets} max={totalSets} tone={accent} />
        <p className="mt-2 text-[11px] font-black uppercase text-ink/40">
          {doneSets === totalSets ? "Séance complète, tu es une machine 🔥" : `Objectif : ${totalSets} séries`}
        </p>
      </div>

      <div className="space-y-4">
        {day.exercises.map((ex: any, idx: number) => {
          const rows = logs[ex.id] || [];
          const allDone = rows.length > 0 && rows.every((l) => l.done);
          return (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="card overflow-hidden"
            >
              <div
                className="flex items-start justify-between gap-2 p-4"
                style={{ background: allDone ? "#22CC7A" : accent }}
              >
                <div className="text-white">
                  <span className="chip border-white/40 bg-white/20 text-white">{ex.muscle}</span>
                  <h3 className="mt-1.5 text-xl font-black leading-tight">{ex.name}</h3>
                  <p className="text-xs font-bold text-white/80">
                    {ex.sets} × {ex.reps} · repos {ex.rest}s
                    {records[ex.name] ? ` · record ${records[ex.name]} kg 🏆` : ""}
                  </p>
                </div>
                {allDone && <span className="text-3xl">✅</span>}
              </div>

              <div className="space-y-2 p-4">
                <div className="grid grid-cols-[26px_1fr_1fr_52px] gap-2 text-[10px] font-black uppercase text-ink/30">
                  <span />
                  <span className="text-center">Kg</span>
                  <span className="text-center">Reps</span>
                  <span />
                </div>
                {rows.map((l, i) => (
                  <div key={i} className="grid grid-cols-[26px_1fr_1fr_52px] items-center gap-2">
                    <span className="text-center text-sm font-black text-ink/25">{i + 1}</span>
                    <input
                      inputMode="decimal"
                      value={l.kg}
                      placeholder="—"
                      onChange={(e) => update(ex.id, i, { kg: e.target.value })}
                      className="field tabnum text-center"
                    />
                    <input
                      inputMode="numeric"
                      value={l.reps}
                      placeholder={ex.reps}
                      onChange={(e) => update(ex.id, i, { reps: e.target.value })}
                      className="field tabnum text-center"
                    />
                    <button
                      onClick={() => validate(ex, i)}
                      className={`flex h-11 items-center justify-center rounded-xl border-2 border-ink font-black shadow-popSm active:translate-y-[2px] active:shadow-none ${
                        l.done ? "bg-lime" : "bg-paper text-ink/25"
                      }`}
                    >
                      <Check size={20} strokeWidth={4} />
                    </button>
                  </div>
                ))}

                <Btn tone="white" className="mt-2 w-full py-3 text-xs" onClick={() => timer.start(ex.rest, ex.name)}>
                  <Timer size={16} /> Repos {ex.rest}s
                </Btn>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Btn tone="ink" className="mt-6 w-full py-5 text-lg disabled:opacity-40" onClick={finish} disabled={doneSets === 0}>
        🏁 Terminer la séance
      </Btn>

      {pr && (
        <div className="pointer-events-none fixed inset-x-0 top-24 z-[180] flex justify-center">
          <div className="animate-popIn rounded-2xl border-2 border-ink bg-amber px-5 py-3 font-black shadow-pop">
            🏆 NOUVEAU RECORD — {pr}
          </div>
        </div>
      )}

      <Sheet open={!!summary} onClose={() => setSummary(null)} title="Séance bouclée 🎉">
        {summary && <SummaryBody sum={summary} onClose={() => setSummary(null)} />}
      </Sheet>
    </Screen>
  );
}

function SummaryBody({ sum, onClose }: any) {
  const { s } = useStore();
  const lvl = levelInfo(totalXp(s.history));
  return (
    <div className="space-y-4">
      <div className="card p-5 text-center">
        <p className="text-6xl">💪</p>
        <p className="mt-2 text-4xl font-black text-violet">+{sum.xp} XP</p>
        <p className="text-sm font-black uppercase text-ink/40">
          Niveau {lvl.level} · {lvl.rank.emoji} {lvl.rank.name}
        </p>
        <div className="mt-3">
          <Progress value={lvl.inLevel} max={lvl.need} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { e: "✅", v: sum.sets, l: "séries" },
          { e: "🏋️", v: `${sum.volume} kg`, l: "volume" },
          { e: "🏆", v: sum.prs, l: "records" },
        ].map((k) => (
          <div key={k.l} className="card p-3 text-center">
            <p className="text-lg font-black">
              {k.e} {k.v}
            </p>
            <p className="text-[10px] font-black uppercase text-ink/40">{k.l}</p>
          </div>
        ))}
      </div>

      {sum.newBadges.length > 0 && (
        <div className="card bg-amber/25 p-4">
          <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-ink/50">Trophée débloqué</p>
          {sum.newBadges.map((b: any) => (
            <p key={b.id} className="text-lg font-black">
              {b.emoji} {b.name} — <span className="text-ink/50">{b.desc}</span>
            </p>
          ))}
        </div>
      )}

      <Btn tone="lime" className="w-full py-4" onClick={onClose}>
        Nickel, on continue 🚀
      </Btn>
    </div>
  );
}
