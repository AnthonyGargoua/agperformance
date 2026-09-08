"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { clickSound, unlockAudio } from "@/lib/alert";

export function Btn({
  children,
  className = "",
  tone = "ink",
  quiet = false,
  onClick,
  ...rest
}: any) {
  const { s } = useStore();
  const tones: Record<string, string> = {
    ink: "bg-ink text-white",
    violet: "bg-violet text-white",
    pink: "bg-pink text-white",
    amber: "bg-amber text-ink",
    lime: "bg-lime text-ink",
    sky: "bg-sky text-ink",
    white: "bg-white text-ink",
  };
  return (
    <button
      {...rest}
      onClick={(e: any) => {
        unlockAudio();
        if (!quiet) {
          if (s.settings.sound) clickSound();
          if (s.settings.vibration && navigator.vibrate) navigator.vibrate(12);
        }
        onClick?.(e);
      }}
      className={`btn ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Progress({ value, max, tone }: { value: number; max: number; tone?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-4 w-full overflow-hidden rounded-full border-2 border-ink bg-paper">
      <motion.div
        className={`h-full ${tone || "xp-fill"}`}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        style={tone ? { background: tone } : undefined}
      />
    </div>
  );
}

export function Sheet({ open, onClose, children, title }: any) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-end justify-center bg-ink/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-t-[32px] border-2 border-ink bg-paper p-5 pb-10"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-ink/20" />
            {title && <h3 className="mb-4 text-2xl font-black">{title}</h3>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Screen({ title, emoji, sub, children, right }: any) {
  return (
    <div className="mx-auto w-full max-w-md px-4 pb-32 pt-[calc(env(safe-area-inset-top)+18px)]">
      <header className="mb-5 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-[30px] font-black leading-[1.05] tracking-tight">
            {emoji} {title}
          </h1>
          {sub && <p className="mt-1 text-sm font-bold text-ink/50">{sub}</p>}
        </div>
        {right}
      </header>
      {children}
    </div>
  );
}

export function Empty({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="card flex flex-col items-center gap-2 p-10 text-center">
      <span className="text-5xl">{emoji}</span>
      <p className="text-sm font-black uppercase text-ink/40">{text}</p>
    </div>
  );
}
