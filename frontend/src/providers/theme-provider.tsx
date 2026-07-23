'use client';

import type { ReactNode } from 'react';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { env } from '@/config/env';

/**
 * ============================================================================
 * Theme Provider
 * ============================================================================
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Provide application theme.
 * - Support light/dark/system themes.
 * - Persist theme selection.
 * - Enable system preference detection.
 * ============================================================================
 */

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = 'tpp-theme';

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='system'
      enableSystem={env.features.darkMode}
      enableColorScheme
      disableTransitionOnChange
      storageKey={THEME_STORAGE_KEY}
    >
      {children}
    </NextThemesProvider>
  );
}
