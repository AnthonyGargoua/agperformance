export type Accent = "violet" | "pink" | "amber" | "lime" | "sky";

export type Exercise = {
  id: string;
  name: string;
  muscle: string;
  sets: number;
  reps: string;
  rest: number;
};

export type Day = {
  id: string;
  label: string;
  title: string;
  emoji: string;
  accent: Accent;
  weekday: number | null;
  exercises: Exercise[];
};

export type SetLog = { kg: string; reps: string; done: boolean };

export type Entry = {
  id: string;
  date: string;
  kind: "muscu" | "vtt" | "padel" | "autre";
  title: string;
  emoji: string;
  xp: number;
  volume?: number;
  sets?: number;
  details?: Record<string, any>;
  perf?: { name: string; best: number; reps: string }[];
};

export type Settings = { sound: boolean; vibration: boolean; notify: boolean; wakeLock: boolean };

export type Store = {
  program: Day[];
  history: Entry[];
  drafts: Record<string, Record<string, SetLog[]>>;
  settings: Settings;
  avatar: string;
  pseudo: string;
};
