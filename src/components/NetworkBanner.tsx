import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function NetworkBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-rose px-4 py-2 text-sm font-medium text-white shadow-md z-50 relative">
      <WifiOff size={16} />
      <span>Tidak ada koneksi internet</span>
    </div>
  );
}
