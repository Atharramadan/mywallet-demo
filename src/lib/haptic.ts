export const haptic = {
  // Getaran halus (untuk menekan tombol biasa atau ngetik PIN)
  light: () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  },
  
  // Getaran sedang (untuk toggle switch atau aksi sedang)
  medium: () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }
  },
  
  // Getaran sukses (untuk menyimpan transaksi, sukses)
  success: () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([20, 50, 40]);
    }
  },
  
  // Getaran peringatan/error
  error: () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([50, 50, 50, 50, 50]);
    }
  }
};
