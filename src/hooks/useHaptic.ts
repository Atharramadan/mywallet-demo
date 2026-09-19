import { useCallback } from 'react';

/**
 * A hook to trigger haptic feedback on mobile devices.
 * Uses the native Navigator.vibrate API if available.
 */
export function useHaptic() {
  const trigger = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof window === 'undefined' || !window.navigator || !window.navigator.vibrate) {
      return;
    }

    try {
      switch (type) {
        case 'light':
          window.navigator.vibrate(10);
          break;
        case 'medium':
          window.navigator.vibrate(20);
          break;
        case 'heavy':
          window.navigator.vibrate([30, 50, 30]);
          break;
        default:
          window.navigator.vibrate(10);
      }
    } catch (e) {
      // Ignore vibration errors on unsupported devices
    }
  }, []);

  return { trigger };
}
