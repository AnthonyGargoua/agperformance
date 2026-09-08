import type { Entry } from "./types";

export const dayKey = (d = new Date()) => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export const WEEKDAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export const uid = () => Math.random().toString(36).slice(2, 9);

const RANKS = [
  { min: 1, name: "Recrue", emoji: "🥚" },
  { min: 3, name: "Apprenti", emoji: "🐣" },
  { min: 5, name: "Assidu", emoji: "💪" },
  { min: 8, name: "Machine", emoji: "🔥" },
  { min: 12, name: "Bête de salle", emoji: "⚡" },
  { min: 17, name: "Colosse", emoji: "🐉" },
  { min: 25, name: "Légende", emoji: "👑" },
];

// Palier d'XP croissant : 250, 400, 550, 700...
const needFor = (level: number) => 250 + (level - 1) * 150;

export function levelInfo(totalXp: number) {
  let level = 1;
  let rest = Math.max(0, totalXp);
  while (rest >= needFor(level)) {
    rest -= needFor(level);
    level++;
  }
  const need = needFor(level);
  const rank = [...RANKS].reverse().find((r) => level >= r.min) || RANKS[0];
  return { level, inLevel: rest, need, pct: Math.round((rest / need) * 100), rank };
}

export function xpForMuscu(setsDone: number, prs: number) {
  return setsDone * 15 + (setsDone > 0 ? 60 : 0) + prs * 25;
}

export function xpForVtt(km: number, dplus: number) {
  return Math.round(km * 10 + dplus * 0.06);
}

export function xpForPadel(win: boolean) {
  return win ? 150 : 100;
}

export function totalXp(history: Entry[]) {
  return history.reduce((s, e) => s + (e.xp || 0), 0);
}

export function streakOf(history: Entry[]) {
  const days = new Set(history.map((e) => e.date));
  const cursor = new Date();
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let n = 0;
  while (days.has(dayKey(cursor))) {
    n++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return n;
}

// Lundi -> dimanche de la semaine en cours
export function weekDays() {
  const now = new Date();
  const shift = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - shift);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return dayKey(d);
  });
}

export function stats(history: Entry[]) {
  const week = weekDays();
  const inWeek = history.filter((e) => week.includes(e.date));
  return {
    sessions: history.length,
    muscu: history.filter((e) => e.kind === "muscu").length,
    padel: history.filter((e) => e.kind === "padel").length,
    volume: history.reduce((s, e) => s + (e.volume || 0), 0),
    km: history.reduce((s, e) => s + (Number(e.details?.km) || 0), 0),
    dplus: history.reduce((s, e) => s + (Number(e.details?.dplus) || 0), 0),
    weekSessions: inWeek.length,
    weekVolume: inWeek.reduce((s, e) => s + (e.volume || 0), 0),
    weekXp: inWeek.reduce((s, e) => s + (e.xp || 0), 0),
    streak: streakOf(history),
  };
}

export const BADGES = [
  { id: "start", emoji: "🌱", name: "Premier pas", desc: "1 séance enregistrée", test: (s: any) => s.sessions >= 1 },
  { id: "ten", emoji: "🔟", name: "Dizaine", desc: "10 séances", test: (s: any) => s.sessions >= 10 },
  { id: "fifty", emoji: "🏅", name: "Cinquantenaire", desc: "50 séances", test: (s: any) => s.sessions >= 50 },
  { id: "cent", emoji: "💯", name: "Centurion", desc: "100 séances", test: (s: any) => s.sessions >= 100 },
  { id: "fire", emoji: "🔥", name: "En feu", desc: "3 jours d'affilée", test: (s: any) => s.streak >= 3 },
  { id: "volcano", emoji: "🌋", name: "Incandescent", desc: "7 jours d'affilée", test: (s: any) => s.streak >= 7 },
  { id: "ton", emoji: "🏋️", name: "Une tonne", desc: "10 000 kg soulevés", test: (s: any) => s.volume >= 10000 },
  { id: "mammoth", emoji: "🦣", name: "Mammouth", desc: "100 000 kg soulevés", test: (s: any) => s.volume >= 100000 },
  { id: "rider", emoji: "🚴", name: "Rouleur", desc: "100 km de VTT", test: (s: any) => s.km >= 100 },
  { id: "climber", emoji: "🏔️", name: "Grimpeur", desc: "3 000 m de D+", test: (s: any) => s.dplus >= 3000 },
  { id: "padel", emoji: "🎾", name: "Padeliste", desc: "5 matchs joués", test: (s: any) => s.padel >= 5 },
  { id: "legend", emoji: "👑", name: "Légende", desc: "Niveau 10 atteint", test: (s: any, lvl: number) => lvl >= 10 },
];

export function badgesOf(history: Entry[]) {
  const s = stats(history);
  const lvl = levelInfo(totalXp(history)).level;
  return BADGES.map((b) => ({ ...b, owned: b.test(s, lvl) }));
}

export function quests(history: Entry[]) {
  const s = stats(history);
  const today = history.some((e) => e.date === dayKey());
  return [
    { emoji: "⚔️", label: "Séance du jour", value: today ? 1 : 0, goal: 1, xp: 60 },
    { emoji: "📅", label: "4 séances cette semaine", value: Math.min(s.weekSessions, 4), goal: 4, xp: 150 },
    { emoji: "🏋️", label: "8 000 kg cette semaine", value: Math.min(s.weekVolume, 8000), goal: 8000, xp: 200 },
  ];
}

// Meilleure charge déjà soulevée sur un exercice, pour détecter les records
export function bestLifts(history: Entry[]) {
  const map: Record<string, number> = {};
  history.forEach((e) =>
    (e.perf || []).forEach((p) => {
      if (!map[p.name] || p.best > map[p.name]) map[p.name] = p.best;
    })
  );
  return map;
}
