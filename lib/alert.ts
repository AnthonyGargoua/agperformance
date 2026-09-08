import type { Settings } from "./types";

let ctx: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

// iOS n'autorise le son qu'après une interaction : on débloque au premier tap
export function unlockAudio() {
  const a = audio();
  if (!a) return;
  const o = a.createOscillator();
  const g = a.createGain();
  g.gain.value = 0.0001;
  o.connect(g).connect(a.destination);
  o.start();
  o.stop(a.currentTime + 0.02);
}

function tone(freq: number, at: number, dur: number, vol = 0.25) {
  const a = audio();
  if (!a) return;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = "triangle";
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, a.currentTime + at);
  g.gain.linearRampToValueAtTime(vol, a.currentTime + at + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + at + dur);
  o.connect(g).connect(a.destination);
  o.start(a.currentTime + at);
  o.stop(a.currentTime + at + dur + 0.05);
}

export const clickSound = () => tone(880, 0, 0.06, 0.12);
export const tickSound = () => tone(660, 0, 0.09, 0.18);
export const winSound = () => {
  [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.3, 0.22));
};

export async function askNotify() {
  if (typeof Notification === "undefined") return "unsupported";
  if (Notification.permission === "granted") return "granted";
  return await Notification.requestPermission();
}

export function registerSW() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

// Alerte de fin de repos : vibration + son + notification système
export async function fireRestAlert(settings: Settings, body: string) {
  if (settings.vibration && navigator.vibrate) navigator.vibrate([300, 120, 300, 120, 500]);
  if (settings.sound) winSound();
  if (!settings.notify || typeof Notification === "undefined" || Notification.permission !== "granted") return;

  const options: NotificationOptions = {
    body,
    icon: "/icon.svg",
    badge: "/icon.svg",
    tag: "ag-rest",
    renotify: true,
    requireInteraction: true,
    vibrate: [300, 120, 300],
  } as NotificationOptions;

  try {
    const reg = await navigator.serviceWorker?.ready;
    if (reg) return reg.showNotification("⏱️ Repos terminé — GO !", options);
  } catch {}
  try {
    new Notification("⏱️ Repos terminé — GO !", options);
  } catch {}
}
