import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { AppIcon } from "../lib/icons";
import { Mascot } from "./Mascot";
import { formatCurrency } from "../lib/formatters";
import { Copy, Check, TrendingUp, Zap, Banknote, Wallet } from "lucide-react";

interface VirtualCard3DProps {
  id?: string;
  name: string;
  balance: number;
  color: string;
  icon: string;
  showBalance: boolean;
  onClick?: () => void;
  className?: string;
  cardNumber?: string;
}

type AccountCategory = "bank" | "investment" | "ewallet" | "cash" | "general";

function getAccountCategory(name: string, icon: string): { type: AccountCategory; label: string } {
  const n = name.toLowerCase();
  const i = icon.toLowerCase();

  // 1. RDN / Investasi / Saham / Kripto / Reksadana
  if (/rdn|reksa|saham|invest|bibit|bareksa|ajaib|stock|crypto|kripto|pluang|binance|indodax|emas|gold|trading/.test(n) || /trending|line-chart|pie-chart|candlestick|coins|bitcoin/.test(i)) {
    return { type: "investment", label: "Investasi & RDN" };
  }

  // 2. E-Wallet / Dompet Digital
  if (/gopay|ovo|dana|shopee|spay|linkaja|wallet|dompet|pay|saku|emoney|flazz|tap/.test(n) || /wallet|smartphone|qr|nfc|phone/.test(i)) {
    return { type: "ewallet", label: "Dompet Digital" };
  }

  // 3. Kas / Tunai
  if (/kas|tunai|cash|celengan|uang|hari|fisik|dompet fisik/.test(n) || /banknote|coins|money|cash|pocket|wallet-cards/.test(i)) {
    return { type: "cash", label: 'Uang Tunai / Kas' };
  }

  // 4. Bank / Kartu Debit / Kredit
  if (/bank|bca|mandiri|bni|bri|bsi|cimb|jago|seabank|blu|neo|debit|kredit|card|cc|rekening/.test(n) || /credit-card|landmark|building|university/.test(i)) {
    return { type: "bank", label: "Rekening Bank" };
  }

  return { type: "general", label: "Akun Keuangan" };
}

export const VirtualCard3D: React.FC<VirtualCard3DProps> = ({
  name,
  balance,
  color,
  icon,
  showBalance,
  onClick,
  className = "",
  cardNumber = "•••• 8892",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const { type: accountType, label: accountLabel } = getAccountCategory(name, icon);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate cursor position relative to card center (-0.5 to +0.5)
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;

    // Subtle & elegant tilt angles (max 10 degrees)
    setRotateX(-y * 10);
    setRotateY(x * 10);

    // Set glare coordinates (0% to 100%)
    setGlareX(((e.clientX - rect.left) / width) * 100);
    setGlareY(((e.clientY - rect.top) / height) * 100);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlareX(50);
    setGlareY(50);
  };

  const handleCopyBalance = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(balance.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Ensure card has a subtle, elegant luxury feel
  const isDarkColor = color === "#000000" || color === "#1a1a1a" || color.includes("black") || color.includes("1e1e");
  const cardBgStyle = isDarkColor
    ? { background: "linear-gradient(135deg, #22202d 0%, #100e17 100%)" }
    : { backgroundColor: color, backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.25) 100%)" };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
        scale: isHovered ? 1.02 : 1,
        y: isHovered ? -3 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      style={{
        ...cardBgStyle,
        transformStyle: "preserve-3d",
        perspective: "1000px",
        willChange: "transform",
      }}
      className={`relative min-w-52 max-w-56 h-32 rounded-2xl p-3.5 text-white shadow-md cursor-pointer select-none overflow-hidden transition-all duration-300 border border-white/15 ${
        isHovered ? "shadow-xl ring-1 ring-white/30" : "shadow-sm"
      } ${className}`}
    >
      {/* 1. Subtle Elegant Shimmer / Glare Layer */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 mix-blend-overlay"
        style={{
          opacity: isHovered ? 0.35 : 0,
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.2) 40%, transparent 70%)`,
        }}
      />

      {/* 2. Secondary Metallic Sheen Overlay */}
      <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent pointer-events-none opacity-30 z-10" />

      {/* 3. Subtle Watermark Mascot */}
      <div className="absolute -right-2 -bottom-3 opacity-10 pointer-events-none grayscale brightness-200 z-0">
        <Mascot mood="idle" size={80} />
      </div>

      {/* Top Right Quick Copy Button ONLY (No Overlap) */}
      <div className="absolute top-3 right-3 z-30">
        <button
          onClick={handleCopyBalance}
          title="Salin Saldo"
          className="p-1 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition-all border border-white/15 backdrop-blur-sm text-white/90 flex items-center justify-center shadow-2xs"
        >
          {copied ? <Check size={12} className="text-emerald-300" /> : <Copy size={12} />}
        </button>
      </div>

      {/* 4. Card Content Layer */}
      <div
        className="relative z-30 flex flex-col justify-between h-full"
        style={{ transform: "translateZ(10px)" }}
      >
        {/* Top Bar: Icon, Account Name & Label grouped neatly */}
        <div className="flex items-center gap-2 pr-8">
          <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-inner shrink-0">
            <AppIcon name={icon} size={16} className="text-white drop-shadow-2xs" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white tracking-wide truncate drop-shadow-2xs">{name}</p>
            <p className="text-[10px] text-white/75 truncate font-medium">
              {accountLabel}
            </p>
          </div>
        </div>

        {/* Middle Bar: Differentiated based on account category */}
        <div className="flex items-center justify-between my-0.5">
          {accountType === "bank" && (
            <>
              {/* Compact EMV Chip for Bank Accounts */}
              <div className="w-6 h-4 rounded-xs bg-linear-to-br from-amber-200/90 via-amber-300/80 to-amber-500/80 border border-amber-200/50 shadow-2xs relative overflow-hidden flex items-center justify-center">
                <div className="w-full h-px bg-amber-800/30 absolute top-1/2 -translate-y-1/2" />
                <div className="h-full w-px bg-amber-800/30 absolute left-1/2 -translate-x-1/2" />
                <div className="w-2 h-1 rounded-2xs border border-amber-800/40 bg-amber-200/40" />
              </div>
              <span className="font-mono text-[11px] font-medium tracking-wider text-white/80 select-none">
                {cardNumber}
              </span>
            </>
          )}

          {accountType === "investment" && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-200 font-medium bg-black/15 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-2xs">
              <TrendingUp size={12} className="text-emerald-300 shrink-0" />
              <span className="truncate">Portofolio Investasi</span>
            </div>
          )}

          {accountType === "ewallet" && (
            <div className="flex items-center gap-1 text-[11px] text-sky-200 font-medium bg-black/15 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-2xs">
              <Zap size={12} className="text-sky-300 shrink-0" />
              <span className="truncate">Dompet Instan</span>
            </div>
          )}

          {accountType === "cash" && (
            <div className="flex items-center gap-1 text-[11px] text-amber-200 font-medium bg-black/15 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-2xs">
              <Banknote size={12} className="text-amber-300 shrink-0" />
              <span className="truncate">Uang Tunai (Liquid)</span>
            </div>
          )}

          {accountType === "general" && (
            <div className="flex items-center gap-1 text-[11px] text-white/80 font-medium bg-black/15 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-2xs">
              <Wallet size={12} className="text-white/80 shrink-0" />
              <span className="truncate">Akun Aktif</span>
            </div>
          )}
        </div>

        {/* Bottom Bar: Balance */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] text-white/70 uppercase tracking-wider font-medium">Total Saldo</p>
            <p className="font-display text-base font-bold tabular-nums tracking-tight text-white drop-shadow-2xs">
              {showBalance ? formatCurrency(balance) : "Rp ••••••••"}
            </p>
          </div>
          
          <div className="text-right">
            <span className="font-display text-[10px] font-medium tracking-tight text-white/60">
              MyWallet
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
