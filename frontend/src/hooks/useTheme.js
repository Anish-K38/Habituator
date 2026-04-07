import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

/**
 * useTheme — watches efficiencyScore and applies a data-theme attribute
 * on <html> to switch between green / neutral / red CSS themes.
 */
export function useTheme() {
  const { efficiencyScore, token } = useApp();

  useEffect(() => {
    const root = document.documentElement;

    // Only apply dynamic theme when user is logged in
    if (!token) {
      root.removeAttribute('data-theme');
      return;
    }

    let theme = 'neutral';
    if (efficiencyScore >= 70) theme = 'green';
    else if (efficiencyScore < 40) theme = 'red';

    root.setAttribute('data-theme', theme);

    // Cleanup on logout
    return () => {
      root.removeAttribute('data-theme');
    };
  }, [efficiencyScore, token]);
}
