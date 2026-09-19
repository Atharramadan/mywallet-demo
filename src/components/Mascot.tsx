interface MascotProps {
  mood?: 'happy' | 'idle' | 'excited' | 'thinking' | 'sleepy';
  size?: number;
  className?: string;
}

/**
 * Momo — maskot mochi ungu MyWallet.
 * Bentuk blob minimalis (bukan hewan spesifik) supaya orisinal dan tidak
 * meniru referensi hamster. Ekspresi berubah lewat prop `mood`.
 */
export function Mascot({ mood = 'idle', size = 96, className = '' }: MascotProps) {
  const eyes = () => {
    switch (mood) {
      case 'happy':
      case 'excited':
        return (
          <>
            <path d="M36 46 Q40 40 44 46" stroke="#201C34" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            <path d="M56 46 Q60 40 64 46" stroke="#201C34" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          </>
        );
      case 'sleepy':
        return (
          <>
            <path d="M35 47 H45" stroke="#201C34" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M55 47 H65" stroke="#201C34" strokeWidth="3.2" strokeLinecap="round" />
          </>
        );
      case 'thinking':
        return (
          <>
            <circle cx="40" cy="45" r="3.2" fill="#201C34" />
            <circle cx="60" cy="42" r="3.2" fill="#201C34" />
          </>
        );
      default:
        return (
          <>
            <circle cx="40" cy="45" r="3.6" fill="#201C34" />
            <circle cx="60" cy="45" r="3.6" fill="#201C34" />
          </>
        );
    }
  };

  const mouth = () => {
    switch (mood) {
      case 'happy':
        return <path d="M42 58 Q50 66 58 58" stroke="#201C34" strokeWidth="3.2" fill="none" strokeLinecap="round" />;
      case 'excited':
        return <ellipse cx="50" cy="60" rx="7" ry="5.5" fill="#201C34" />;
      case 'sleepy':
        return <ellipse cx="50" cy="59" rx="3.5" ry="2" fill="#201C34" />;
      case 'thinking':
        return <path d="M44 60 Q50 58 56 61" stroke="#201C34" strokeWidth="3" fill="none" strokeLinecap="round" />;
      default:
        return <path d="M43 58 Q50 63 57 58" stroke="#201C34" strokeWidth="3" fill="none" strokeLinecap="round" />;
    }
  };

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`Maskot Momo — ${mood}`}
    >
      {/* Telinga */}
      <ellipse cx="30" cy="22" rx="9" ry="12" fill="#B4A7F5" transform="rotate(-20 30 22)" />
      <ellipse cx="70" cy="22" rx="9" ry="12" fill="#B4A7F5" transform="rotate(20 70 22)" />

      {/* Badan blob */}
      <path
        d="M50 14 C74 14 86 34 86 56 C86 78 70 90 50 90 C30 90 14 78 14 56 C14 34 26 14 50 14 Z"
        fill="#7C6FE0"
      />

      {/* Highlight lembut */}
      <ellipse cx="34" cy="38" rx="9" ry="6" fill="#ffffff" opacity="0.18" />

      {/* Pipi blush */}
      <ellipse cx="32" cy="54" rx="6" ry="4" fill="#FF8DA1" opacity="0.55" />
      <ellipse cx="68" cy="54" rx="6" ry="4" fill="#FF8DA1" opacity="0.55" />

      {eyes()}
      {mouth()}

      {/* Koin kecil yang dipegang */}
      {(mood === 'excited' || mood === 'happy') && (
        <circle cx="50" cy="80" r="6" fill="#FFB088" stroke="#fff" strokeWidth="1.5" />
      )}
    </svg>
  );
}
