import React from "react";
import { motion } from "framer-motion";
import { useSettingsStore } from "../stores/settingsStore";
import { useTransactionStore } from "../stores/transactionStore";

export const AtmosphereBackground: React.FC = () => {
  const theme = useSettingsStore((s) => s.settings?.theme || "dark");
  const transactions = useTransactionStore((s) => s.transactions);

  if (theme === "light") return null;

  // Check if wealth is booming this month (positive net cashflow)
  const now = new Date();
  const thisMonthTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const netIncome = thisMonthTransactions.reduce((acc, t) => {
    if (t.type === "income") return acc + t.amount;
    if (t.type === "expense") return acc - t.amount;
    return acc;
  }, 0);

  const isBooming = netIncome > 0;

  const themeColors: Record<string, { blob1: string; blob2: string; blob3: string }> = {
    emerald: {
      blob1: "rgba(16, 185, 129, 0.38)", // Emerald Green
      blob2: "rgba(245, 158, 11, 0.32)", // Luxury Gold / Amber
      blob3: "rgba(6, 78, 59, 0.50)",    // Deep Forest
    },
    cyberpunk: {
      blob1: "rgba(168, 85, 247, 0.38)", // Neon Purple
      blob2: "rgba(236, 72, 153, 0.35)", // Cyber Magenta
      blob3: "rgba(79, 70, 229, 0.45)",  // Deep Indigo
    },
    aurora: {
      blob1: "rgba(6, 182, 212, 0.38)",  // Arctic Cyan
      blob2: "rgba(52, 211, 153, 0.32)", // Northern Green Aurora
      blob3: "rgba(30, 58, 138, 0.48)",  // Deep Navy
    },
    obsidian: {
      blob1: "rgba(255, 255, 255, 0.14)", // Crystal Silver
      blob2: "rgba(148, 163, 184, 0.18)", // Slate Blue Sheen
      blob3: "rgba(15, 23, 42, 0.65)",    // Obsidian Black
    },
    dark: {
      blob1: "rgba(139, 92, 246, 0.22)",  // Subtle Purple
      blob2: "rgba(59, 130, 246, 0.18)",  // Soft Blue
      blob3: "rgba(15, 23, 42, 0.55)",    // Dark Indigo
    },
  };

  const colors = themeColors[theme] || themeColors.dark;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 transform-gpu">
      {/* Blob 1: Top Left */}
      <div
        style={{
          backgroundColor: colors.blob1,
          filter: "blur(70px)",
          willChange: "opacity, transform",
        }}
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-60 transition-all duration-1000 transform-gpu"
      />

      {/* Blob 2: Middle / Right */}
      <div
        style={{
          backgroundColor: colors.blob2,
          filter: "blur(70px)",
          willChange: "opacity, transform",
        }}
        className="absolute top-1/3 -right-20 w-96 h-96 rounded-full opacity-50 transition-all duration-1000 transform-gpu"
      />

      {/* Blob 3: Bottom Left / Center */}
      <div
        style={{
          backgroundColor: colors.blob3,
          filter: "blur(70px)",
          willChange: "opacity, transform",
        }}
        className="absolute bottom-10 left-1/4 w-80 h-80 rounded-full opacity-45 transition-all duration-1000 transform-gpu"
      />

      {/* Subtle Prosperity Pulse overlay when net income is positive */}
      {isBooming && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ duration: 2 }}
          style={{ backgroundColor: colors.blob1 }}
          className="absolute inset-0 mix-blend-screen transform-gpu"
        />
      )}
    </div>
  );
};

