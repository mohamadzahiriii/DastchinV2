'use client';

import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'ganjineh-favorites';
const EMPTY: string[] = [];

let cache: string[] | null = null;
const listeners = new Set<() => void>();

function readStorage(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function getSnapshot(): string[] {
  if (cache === null) cache = readStorage();
  return cache;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function write(ids: string[]) {
  cache = ids;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage can be unavailable (private mode); the in-memory state still updates.
  }
  listeners.forEach((listener) => listener());
}

export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((id: string) => {
    const current = getSnapshot();
    write(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  }, []);

  return { ids, isFavorite: (id: string) => ids.includes(id), toggle };
}
