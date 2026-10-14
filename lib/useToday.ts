"use client";

import { useSyncExternalStore } from "react";
import { toISO } from "./data";

const subscribe = () => () => {};

/** Bugünün tarihi (YYYY-MM-DD). Sunucuda ve ilk hidrasyonda boş string döner. */
export function useToday(): string {
  return useSyncExternalStore(
    subscribe,
    () => toISO(new Date()),
    () => "",
  );
}
