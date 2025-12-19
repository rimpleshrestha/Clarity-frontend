import { create } from "zustand";

interface DailyPromptState {
  question: string | null;
  category: string | null;
  setPrompt: (prompt: { question: string; category: string }) => void;
  clearPrompt: () => void;
}

export const useDailyPromptStore = create<DailyPromptState>((set) => ({
  question: null,
  category: null,

  setPrompt: (prompt) =>
    set({
      question: prompt.question,
      category: prompt.category,
    }),

  clearPrompt: () =>
    set({
      question: null,
      category: null,
    }),
}));
