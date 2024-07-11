import { useEffect, useSyncExternalStore } from "react";
import { Reader } from "./reader";

let listeners = new Set<() => void>();
let state = {
  reading: false,
  readingId: "",
  available: false,
};
let reader: {
  available: boolean;
  startRead: (id: string, prefix?: string) => void;
  stopRead: () => void;
} | null = null;

export const readingStore = {
  startReading: (id: string, prefix?: string) => {
    state = { ...state, readingId: id, reading: true };
    reader?.startRead(id, prefix);
  },
  stopReading: () => {
    state = { ...state, reading: false };
    reader?.stopRead();
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        reader?.stopRead();
      }
    };
  },
  getSnapShot: () => {
    return state;
  },
};

type initProps = {
  excludeChildIds?: string[];
};

function init(props: initProps) {
  if ("speechSynthesis" in window && "SpeechSynthesisUtterance" in window) {
    state = { ...state, available: true };
    reader = Reader({
      onStop: () => {
        state = { ...state, reading: false };
        emitChange();
      },
      onStart: () => {
        state = { ...state, reading: true };
        emitChange();
      },
      excludeChildIds: props?.excludeChildIds,
    });
    emitChange();
  }
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

type useTextReadingProps = {
  excludeChildIds?: string[];
};
export const useTextReading = (props?: useTextReadingProps) => {
  const { reading, readingId, available } = useSyncExternalStore(
    readingStore.subscribe,
    readingStore.getSnapShot,
    () => state,
  );

  const handleReading = (id: string, prefix?: string) => {
    readingStore.startReading(id, prefix);
  };

  const handleStopReading = () => {
    readingStore.stopReading();
  };

  useEffect(() => {
    if (!available) {
      init({
        excludeChildIds: props?.excludeChildIds,
      });
    }
  }, [available, props?.excludeChildIds]);

  return {
    reading,
    readingId,
    handleReading,
    handleStopReading,
    available,
  };
};
