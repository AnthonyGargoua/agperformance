import type { Day } from "./types";

const ex = (id: string, name: string, muscle: string, sets: number, reps: string, rest = 90) => ({
  id,
  name,
  muscle,
  sets,
  reps,
  rest,
});

export const DEFAULT_PROGRAM: Day[] = [
  {
    id: "d1",
    label: "Lundi",
    title: "Push — Pecs / Triceps",
    emoji: "💥",
    accent: "pink",
    weekday: 1,
    exercises: [
      ex("d1e1", "Développé couché barre", "Pecs", 4, "6-8", 150),
      ex("d1e2", "Développé incliné haltères", "Pecs haut", 3, "10-12", 120),
      ex("d1e3", "Développé militaire assis", "Épaules", 3, "8-10", 120),
      ex("d1e4", "Écartés poulie", "Pecs", 3, "12-15", 75),
      ex("d1e5", "Barre au front", "Triceps", 3, "10-12", 75),
    ],
  },
  {
    id: "d2",
    label: "Mardi",
    title: "Pull — Dos / Biceps",
    emoji: "🦍",
    accent: "violet",
    weekday: 2,
    exercises: [
      ex("d2e1", "Soulevé de terre", "Dos", 3, "5", 180),
      ex("d2e2", "Tractions lestées", "Dos", 3, "6-8", 150),
      ex("d2e3", "Rowing barre T", "Dos", 3, "10-12", 120),
      ex("d2e4", "Oiseau poulie", "Épaules", 3, "15", 60),
      ex("d2e5", "Curl barre EZ", "Biceps", 3, "8-10", 75),
    ],
  },
  {
    id: "d3",
    label: "Mercredi",
    title: "Legs — Quadriceps",
    emoji: "🦵",
    accent: "amber",
    weekday: 3,
    exercises: [
      ex("d3e1", "Squat barre haute", "Cuisses", 4, "6-8", 180),
      ex("d3e2", "Presse à cuisses", "Quadriceps", 3, "10-15", 120),
      ex("d3e3", "Leg extension", "Quadriceps", 3, "15-20", 75),
      ex("d3e4", "Adducteurs machine", "Adducteurs", 3, "15", 60),
      ex("d3e5", "Mollets debout", "Mollets", 4, "12-15", 60),
    ],
  },
  {
    id: "d4",
    label: "Jeudi",
    title: "Push — Épaules / Pecs",
    emoji: "🚀",
    accent: "sky",
    weekday: 4,
    exercises: [
      ex("d4e1", "Développé militaire barre", "Épaules", 4, "6-8", 150),
      ex("d4e2", "Développé incliné barre", "Pecs haut", 3, "8-10", 120),
      ex("d4e3", "Élévations latérales", "Épaules", 4, "12-15", 60),
      ex("d4e4", "Pec deck", "Pecs", 3, "12", 75),
      ex("d4e5", "Extension poulie", "Triceps", 3, "12-15", 60),
    ],
  },
  {
    id: "d5",
    label: "Vendredi",
    title: "Pull — Largeur du dos",
    emoji: "🪽",
    accent: "lime",
    weekday: 5,
    exercises: [
      ex("d5e1", "Tirage vertical large", "Dos", 4, "10-12", 120),
      ex("d5e2", "Rowing haltère", "Dos", 3, "10", 90),
      ex("d5e3", "Pull over poulie", "Dos", 3, "15", 60),
      ex("d5e4", "Curl pupitre", "Biceps", 3, "10-12", 75),
      ex("d5e5", "Curl marteau", "Biceps", 3, "10-12", 75),
    ],
  },
  {
    id: "d6",
    label: "Samedi",
    title: "Legs — Ischios / Fessiers",
    emoji: "🔥",
    accent: "pink",
    weekday: 6,
    exercises: [
      ex("d6e1", "SDT jambes tendues", "Ischios", 4, "8-10", 150),
      ex("d6e2", "Hip thrust", "Fessiers", 3, "8-10", 120),
      ex("d6e3", "Leg curl assis", "Ischios", 3, "12-15", 75),
      ex("d6e4", "Abducteurs machine", "Fessiers", 3, "15", 60),
      ex("d6e5", "Presse pieds hauts", "Ischios", 3, "12", 90),
    ],
  },
];

export const EMOJIS = ["💥", "🦍", "🦵", "🚀", "🪽", "🔥", "⚡", "🛡️", "🏔️", "🐉", "🎯", "🧊", "🥊", "🌪️", "💎", "🍑"];

export const ACCENTS: Record<string, string> = {
  violet: "#6C3CFF",
  pink: "#FF3D8A",
  amber: "#FFC02E",
  lime: "#22CC7A",
  sky: "#12C2E9",
};
