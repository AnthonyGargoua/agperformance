"use client";

import React, { useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { ACCENTS, DEFAULT_PROGRAM, EMOJIS } from "@/lib/program";
import { uid, WEEKDAYS } from "@/lib/game";
import { Btn, Screen, Sheet } from "./ui";
import type { Day, Exercise } from "@/lib/types";

export default function ProgramView() {
  const { s, set } = useStore();
  const [editId, setEditId] = useState<string | null>(null);
  const day = s.program.find((d) => d.id === editId);

  const save = (next: Day) => set({ program: s.program.map((d) => (d.id === next.id ? next : d)) });

  const addDay = () => {
    const id = uid();
    set({
      program: [
        ...s.program,
        {
          id,
          label: "Nouveau jour",
          title: "À toi de jouer",
          emoji: "⚡",
          accent: "violet",
          weekday: null,
          exercises: [],
        },
      ],
    });
    setEditId(id);
  };

  const removeDay = (id: string) => {
    set({ program: s.program.filter((d) => d.id !== id) });
    setEditId(null);
  };

  return (
    <Screen emoji="🛠️" title="Programme" sub="Ton plan, tes règles">
      <div className="space-y-3">
        {s.program.map((d) => (
          <button
            key={d.id}
            onClick={() => setEditId(d.id)}
            className="card flex w-full items-center gap-3 p-4 text-left"
          >
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-ink text-2xl"
              style={{ background: ACCENTS[d.accent] }}
            >
              {d.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black uppercase tracking-widest text-ink/40">
                {d.weekday !== null ? WEEKDAYS[d.weekday] : "Hors planning"}
              </p>
              <h3 className="truncate text-lg font-black leading-tight">{d.title}</h3>
              <p className="text-xs font-bold text-ink/50">
                {d.exercises.length} exercices · {d.exercises.reduce((n, e) => n + e.sets, 0)} séries
              </p>
            </div>
            <Pencil size={18} className="text-ink/30" />
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Btn tone="violet" className="py-4" onClick={addDay}>
          <Plus size={18} /> Jour
        </Btn>
        <Btn
          tone="white"
          className="py-4"
          onClick={() => confirm("Revenir au programme d'origine ?") && set({ program: DEFAULT_PROGRAM })}
        >
          <RotateCcw size={18} /> Reset
        </Btn>
      </div>

      <Sheet open={!!day} onClose={() => setEditId(null)} title="Modifier le jour ✏️">
        {day && <DayEditor day={day} save={save} onDelete={() => removeDay(day.id)} />}
      </Sheet>
    </Screen>
  );
}

function DayEditor({ day, save, onDelete }: { day: Day; save: (d: Day) => void; onDelete: () => void }) {
  const patch = (p: Partial<Day>) => save({ ...day, ...p });
  const patchEx = (id: string, p: Partial<Exercise>) =>
    patch({ exercises: day.exercises.map((e) => (e.id === id ? { ...e, ...p } : e)) });

  const move = (i: number, dir: number) => {
    const list = [...day.exercises];
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    patch({ exercises: list });
  };

  return (
    <div className="space-y-4">
      <div className="card space-y-3 p-4">
        <div className="flex flex-wrap gap-1.5">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => patch({ emoji: e })}
              className={`h-9 w-9 rounded-xl border-2 text-lg ${
                day.emoji === e ? "border-ink bg-amber shadow-popSm" : "border-transparent bg-paper"
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {Object.entries(ACCENTS).map(([k, c]) => (
            <button
              key={k}
              onClick={() => patch({ accent: k as any })}
              className={`h-9 flex-1 rounded-xl border-2 ${day.accent === k ? "border-ink shadow-popSm" : "border-ink/10"}`}
              style={{ background: c }}
            />
          ))}
        </div>

        <input className="field" value={day.label} placeholder="Nom court" onChange={(e) => patch({ label: e.target.value })} />
        <input className="field" value={day.title} placeholder="Titre de la séance" onChange={(e) => patch({ title: e.target.value })} />

        <select
          className="field"
          value={day.weekday === null ? "" : day.weekday}
          onChange={(e) => patch({ weekday: e.target.value === "" ? null : Number(e.target.value) })}
        >
          <option value="">Hors planning</option>
          {WEEKDAYS.map((w, i) => (
            <option key={w} value={i}>
              {w}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {day.exercises.map((ex, i) => (
          <div key={ex.id} className="card space-y-2 p-3">
            <div className="flex items-center gap-2">
              <input className="field flex-1" value={ex.name} onChange={(e) => patchEx(ex.id, { name: e.target.value })} />
              <button onClick={() => move(i, -1)} className="rounded-xl border-2 border-ink bg-paper p-2">
                <ArrowUp size={14} />
              </button>
              <button onClick={() => move(i, 1)} className="rounded-xl border-2 border-ink bg-paper p-2">
                <ArrowDown size={14} />
              </button>
              <button
                onClick={() => patch({ exercises: day.exercises.filter((e) => e.id !== ex.id) })}
                className="rounded-xl border-2 border-ink bg-pink p-2 text-white"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <input className="field" value={ex.muscle} placeholder="Muscle" onChange={(e) => patchEx(ex.id, { muscle: e.target.value })} />
              <input
                className="field tabnum text-center"
                inputMode="numeric"
                value={ex.sets}
                onChange={(e) => patchEx(ex.id, { sets: Math.max(1, Math.min(10, Number(e.target.value) || 1)) })}
              />
              <input className="field text-center" value={ex.reps} onChange={(e) => patchEx(ex.id, { reps: e.target.value })} />
              <input
                className="field tabnum text-center"
                inputMode="numeric"
                value={ex.rest}
                onChange={(e) => patchEx(ex.id, { rest: Math.max(10, Number(e.target.value) || 60) })}
              />
            </div>
            <div className="grid grid-cols-4 gap-2 text-[10px] font-black uppercase text-ink/30">
              <span>Muscle</span>
              <span className="text-center">Séries</span>
              <span className="text-center">Reps</span>
              <span className="text-center">Repos</span>
            </div>
          </div>
        ))}
      </div>

      <Btn
        tone="lime"
        className="w-full py-4"
        onClick={() =>
          patch({
            exercises: [
              ...day.exercises,
              { id: uid(), name: "Nouvel exercice", muscle: "Full body", sets: 3, reps: "10", rest: 90 },
            ],
          })
        }
      >
        <Plus size={18} /> Ajouter un exercice
      </Btn>

      <Btn tone="white" className="w-full py-3 text-xs" onClick={() => confirm("Supprimer ce jour ?") && onDelete()}>
        <Trash2 size={16} /> Supprimer le jour
      </Btn>
    </div>
  );
}
