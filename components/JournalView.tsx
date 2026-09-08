"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { dayKey, xpForPadel, xpForVtt } from "@/lib/game";
import { Btn, Empty, Screen, Sheet } from "./ui";

const KINDS: Record<string, { emoji: string; label: string; tone: string }> = {
  vtt: { emoji: "🚵", label: "VTT", tone: "sky" },
  padel: { emoji: "🎾", label: "Padel", tone: "amber" },
  autre: { emoji: "🏃", label: "Autre", tone: "lime" },
};

const prettyDate = (key: string) => {
  const [y, m, d] = key.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

export default function JournalView({ preset, clearPreset }: { preset?: string; clearPreset: () => void }) {
  const { s, removeEntry } = useStore();
  const [add, setAdd] = useState<string | null>(null);

  useEffect(() => {
    if (preset) {
      setAdd(preset);
      clearPreset();
    }
  }, [preset, clearPreset]);

  const groups: Record<string, typeof s.history> = {};
  s.history.forEach((e) => {
    (groups[e.date] = groups[e.date] || []).push(e);
  });

  return (
    <Screen emoji="📖" title="Journal" sub={`${s.history.length} séances au compteur`}>
      <div className="mb-5 grid grid-cols-3 gap-2">
        {Object.entries(KINDS).map(([k, v]) => (
          <Btn key={k} tone={v.tone} className="flex-col gap-0 py-4 text-xs" onClick={() => setAdd(k)}>
            <span className="text-2xl">{v.emoji}</span>
            {v.label}
          </Btn>
        ))}
      </div>

      {Object.keys(groups).length === 0 && <Empty emoji="🗒️" text="Rien d'enregistré, à toi de jouer" />}

      <div className="space-y-5">
        {Object.entries(groups).map(([date, list]) => (
          <div key={date}>
            <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-ink/40">
              {prettyDate(date)} {date === dayKey() && "· aujourd'hui"}
            </p>
            <div className="space-y-2">
              {list.map((e) => (
                <div key={e.id} className="card p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{e.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-black leading-tight">{e.title}</h3>
                      <p className="text-xs font-bold text-ink/50">
                        {e.kind === "muscu" && `${e.sets} séries · ${e.volume} kg soulevés`}
                        {e.kind === "vtt" && `${e.details?.km} km · ${e.details?.dplus} m D+ · ${e.details?.kcal} kcal`}
                        {e.kind === "padel" && e.details?.score}
                        {e.kind === "autre" && `${e.details?.duration || "?"} min`}
                      </p>
                      {e.details?.notes && <p className="mt-1 text-xs font-bold italic text-ink/40">“{e.details.notes}”</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="chip bg-violet text-white">+{e.xp} xp</span>
                      <button onClick={() => removeEntry(e.id)} className="text-ink/25">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Sheet open={!!add} onClose={() => setAdd(null)} title={`Ajouter ${add ? KINDS[add].label : ""} ${add ? KINDS[add].emoji : ""}`}>
        {add && <AddForm kind={add} onDone={() => setAdd(null)} />}
      </Sheet>
    </Screen>
  );
}

function AddForm({ kind, onDone }: { kind: string; onDone: () => void }) {
  const { addEntry } = useStore();
  const [date, setDate] = useState(dayKey());
  const [f, setF] = useState<any>({ km: "", dplus: "", duration: "", notes: "", title: "", me: ["", "", ""], op: ["", "", ""] });

  const num = (v: any) => parseFloat(v) || 0;
  const kcal = Math.round(num(f.km) * 30 + num(f.dplus) * 0.4);
  const setScore = (who: "me" | "op", i: number, v: string) =>
    setF({ ...f, [who]: f[who].map((x: string, k: number) => (k === i ? v : x)) });

  const submit = () => {
    if (kind === "vtt") {
      addEntry({
        date,
        kind: "vtt",
        title: `Sortie VTT ${f.km || 0} km`,
        emoji: "🚵",
        xp: xpForVtt(num(f.km), num(f.dplus)),
        details: { km: num(f.km), dplus: num(f.dplus), duration: f.duration, kcal, notes: f.notes },
      });
    } else if (kind === "padel") {
      const won = f.me.filter((v: string, i: number) => num(v) > num(f.op[i])).length;
      const lost = f.op.filter((v: string, i: number) => num(v) > num(f.me[i])).length;
      const win = won > lost;
      addEntry({
        date,
        kind: "padel",
        title: win ? "Match gagné 🏆" : "Match de padel",
        emoji: "🎾",
        xp: xpForPadel(win),
        details: {
          score: [0, 1, 2].map((i) => `${f.me[i] || 0}/${f.op[i] || 0}`).join(" · "),
          win,
          notes: f.notes,
        },
      });
    } else {
      addEntry({
        date,
        kind: "autre",
        title: f.title || "Séance libre",
        emoji: "🏃",
        xp: 80,
        details: { duration: f.duration, notes: f.notes },
      });
    }
    onDone();
  };

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-[11px] font-black uppercase text-ink/40">Date</span>
        <input type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>

      {kind === "vtt" && (
        <>
          <div className="card flex items-center justify-center gap-2 p-4">
            <span className="text-3xl">🔥</span>
            <span className="text-3xl font-black">{kcal} kcal</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input className="field tabnum text-center" inputMode="decimal" placeholder="km" value={f.km} onChange={(e) => setF({ ...f, km: e.target.value })} />
            <input className="field tabnum text-center" inputMode="numeric" placeholder="D+ m" value={f.dplus} onChange={(e) => setF({ ...f, dplus: e.target.value })} />
            <input className="field tabnum text-center" inputMode="numeric" placeholder="min" value={f.duration} onChange={(e) => setF({ ...f, duration: e.target.value })} />
          </div>
        </>
      )}

      {kind === "padel" && (
        <div className="card space-y-2 p-4">
          {(["me", "op"] as const).map((who) => (
            <div key={who} className="grid grid-cols-4 items-center gap-2">
              <span className="text-[11px] font-black uppercase text-ink/40">{who === "me" ? "Moi 💪" : "Adv. 😈"}</span>
              {[0, 1, 2].map((i) => (
                <input
                  key={i}
                  className="field tabnum text-center"
                  inputMode="numeric"
                  placeholder={`S${i + 1}`}
                  value={f[who][i]}
                  onChange={(e) => setScore(who, i, e.target.value)}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {kind === "autre" && (
        <>
          <input className="field" placeholder="Type de séance (course, natation...)" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
          <input className="field tabnum" inputMode="numeric" placeholder="Durée en minutes" value={f.duration} onChange={(e) => setF({ ...f, duration: e.target.value })} />
        </>
      )}

      <textarea
        className="field h-24 resize-none"
        placeholder="Ressenti, points à travailler..."
        value={f.notes}
        onChange={(e) => setF({ ...f, notes: e.target.value })}
      />

      <Btn tone="ink" className="w-full py-4" onClick={submit}>
        <Plus size={18} /> Enregistrer
      </Btn>
    </div>
  );
}
