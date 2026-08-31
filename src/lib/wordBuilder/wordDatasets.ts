/**
 * Multi-language word datasets for Word Builder game.
 * 
 * Structure:
 * - Level 1: 37 unique 2-letter words
 * - Level 2: 47 unique 3-letter words (37 + 10 new)
 * - Level 3: 57 unique 3-letter words (47 + 10 new)
 * - Level 4: 67 unique 4-letter words (57 + 10 new)
 * - Level 5: 77 unique 4-letter words (67 + 10 new)
 * 
 * No repeats across any level. All child-friendly English words.
 */

import type { Language } from "@/types";
import type { Word } from "@/lib/wordBuilder/types";

// ─── ENGLISH WORDS ──────────────────────────────────────────────────────────

const ENGLISH_WORDS: Word[] = [
  // LEVEL 1 — 37 unique 2-letter words
  { id: "en-l1-am", word: "AM", language: "english", level: 1, category: "verbs", difficulty: 1, enabled: true },
  { id: "en-l1-an", word: "AN", language: "english", level: 1, category: "articles", difficulty: 1, enabled: true },
  { id: "en-l1-at", word: "AT", language: "english", level: 1, category: "prepositions", difficulty: 1, enabled: true },
  { id: "en-l1-in", word: "IN", language: "english", level: 1, category: "prepositions", difficulty: 1, enabled: true },
  { id: "en-l1-is", word: "IS", language: "english", level: 1, category: "verbs", difficulty: 1, enabled: true },
  { id: "en-l1-it", word: "IT", language: "english", level: 1, category: "pronouns", difficulty: 1, enabled: true },
  { id: "en-l1-on", word: "ON", language: "english", level: 1, category: "prepositions", difficulty: 1, enabled: true },
  { id: "en-l1-up", word: "UP", language: "english", level: 1, category: "prepositions", difficulty: 1, enabled: true },
  { id: "en-l1-as", word: "AS", language: "english", level: 1, category: "conjunctions", difficulty: 1, enabled: true },
  { id: "en-l1-be", word: "BE", language: "english", level: 1, category: "verbs", difficulty: 1, enabled: true },
  { id: "en-l1-by", word: "BY", language: "english", level: 1, category: "prepositions", difficulty: 1, enabled: true },
  { id: "en-l1-do", word: "DO", language: "english", level: 1, category: "verbs", difficulty: 1, enabled: true },
  { id: "en-l1-go", word: "GO", language: "english", level: 1, category: "verbs", difficulty: 1, enabled: true },
  { id: "en-l1-he", word: "HE", language: "english", level: 1, category: "pronouns", difficulty: 1, enabled: true },
  { id: "en-l1-if", word: "IF", language: "english", level: 1, category: "conjunctions", difficulty: 1, enabled: true },
  { id: "en-l1-me", word: "ME", language: "english", level: 1, category: "pronouns", difficulty: 1, enabled: true },
  { id: "en-l1-my", word: "MY", language: "english", level: 1, category: "pronouns", difficulty: 1, enabled: true },
  { id: "en-l1-no", word: "NO", language: "english", level: 1, category: "adverbs", difficulty: 1, enabled: true },
  { id: "en-l1-of", word: "OF", language: "english", level: 1, category: "prepositions", difficulty: 1, enabled: true },
  { id: "en-l1-or", word: "OR", language: "english", level: 1, category: "conjunctions", difficulty: 1, enabled: true },
  { id: "en-l1-so", word: "SO", language: "english", level: 1, category: "adverbs", difficulty: 1, enabled: true },
  { id: "en-l1-to", word: "TO", language: "english", level: 1, category: "prepositions", difficulty: 1, enabled: true },
  { id: "en-l1-we", word: "WE", language: "english", level: 1, category: "pronouns", difficulty: 1, enabled: true },
  { id: "en-l1-ad", word: "AD", language: "english", level: 1, category: "nouns", difficulty: 1, enabled: true },
  { id: "en-l1-ax", word: "AX", language: "english", level: 1, category: "objects", difficulty: 1, enabled: true },
  { id: "en-l1-ox", word: "OX", language: "english", level: 1, category: "animals", difficulty: 1, enabled: true },
  { id: "en-l1-ma", word: "MA", language: "english", level: 1, category: "family", difficulty: 1, enabled: true },
  { id: "en-l1-pa", word: "PA", language: "english", level: 1, category: "family", difficulty: 1, enabled: true },
  { id: "en-l1-us", word: "US", language: "english", level: 1, category: "pronouns", difficulty: 1, enabled: true },
  { id: "en-l1-fa", word: "FA", language: "english", level: 1, category: "music", difficulty: 1, enabled: true },
  { id: "en-l1-hi", word: "HI", language: "english", level: 1, category: "interjections", difficulty: 1, enabled: true },
  { id: "en-l1-oh", word: "OH", language: "english", level: 1, category: "interjections", difficulty: 1, enabled: true },
  { id: "en-l1-op", word: "OP", language: "english", level: 1, category: "nouns", difficulty: 1, enabled: true },
  { id: "en-l1-la", word: "LA", language: "english", level: 1, category: "music", difficulty: 1, enabled: true },
  { id: "en-l1-ti", word: "TI", language: "english", level: 1, category: "music", difficulty: 1, enabled: true },
  { id: "en-l1-id", word: "ID", language: "english", level: 1, category: "nouns", difficulty: 1, enabled: true },
  { id: "en-l1-ed", word: "ED", language: "english", level: 1, category: "nouns", difficulty: 1, enabled: true },

  // LEVEL 2 — 47 unique 3-letter words (10 new words added to level 1's 37)
  { id: "en-l2-cat", word: "CAT", language: "english", level: 2, category: "animals", image: "🐱", difficulty: 1, enabled: true },
  { id: "en-l2-dog", word: "DOG", language: "english", level: 2, category: "animals", image: "🐕", difficulty: 1, enabled: true },
  { id: "en-l2-bat", word: "BAT", language: "english", level: 2, category: "objects", image: "🏏", difficulty: 1, enabled: true },
  { id: "en-l2-rat", word: "RAT", language: "english", level: 2, category: "animals", image: "🐭", difficulty: 1, enabled: true },
  { id: "en-l2-fat", word: "FAT", language: "english", level: 2, category: "adjectives", difficulty: 1, enabled: true },
  { id: "en-l2-mat", word: "MAT", language: "english", level: 2, category: "objects", difficulty: 1, enabled: true },
  { id: "en-l2-sat", word: "SAT", language: "english", level: 2, category: "verbs", difficulty: 1, enabled: true },
  { id: "en-l2-hat", word: "HAT", language: "english", level: 2, category: "clothing", image: "🎩", difficulty: 1, enabled: true },
  { id: "en-l2-sun", word: "SUN", language: "english", level: 2, category: "nature", image: "☀️", difficulty: 1, enabled: true },
  { id: "en-l2-run", word: "RUN", language: "english", level: 2, category: "verbs", difficulty: 1, enabled: true },

  // LEVEL 3 — 57 unique 3-letter words (10 more new words added to level 2's 47)
  { id: "en-l3-fun", word: "FUN", language: "english", level: 3, category: "nouns", difficulty: 1, enabled: true },
  { id: "en-l3-gun", word: "GUN", language: "english", level: 3, category: "objects", difficulty: 1, enabled: true },
  { id: "en-l3-bus", word: "BUS", language: "english", level: 3, category: "transport", image: "🚌", difficulty: 1, enabled: true },
  { id: "en-l3-but", word: "BUT", language: "english", level: 3, category: "conjunctions", difficulty: 1, enabled: true },
  { id: "en-l3-cut", word: "CUT", language: "english", level: 3, category: "verbs", difficulty: 1, enabled: true },
  { id: "en-l3-hut", word: "HUT", language: "english", level: 3, category: "places", image: "🏚️", difficulty: 2, enabled: true },
  { id: "en-l3-nut", word: "NUT", language: "english", level: 3, category: "food", difficulty: 2, enabled: true },
  { id: "en-l3-put", word: "PUT", language: "english", level: 3, category: "verbs", difficulty: 2, enabled: true },
  { id: "en-l3-cup", word: "CUP", language: "english", level: 3, category: "objects", image: "🥤", difficulty: 2, enabled: true },
  { id: "en-l3-fox", word: "FOX", language: "english", level: 3, category: "animals", image: "🦊", difficulty: 2, enabled: true },

  // LEVEL 4 — 67 unique 4-letter words (10 more new words added to level 3's 57)
  { id: "en-l4-box", word: "BOX", language: "english", level: 4, category: "objects", difficulty: 1, enabled: true },
  { id: "en-l4-six", word: "SIX", language: "english", level: 4, category: "numbers", difficulty: 1, enabled: true },
  { id: "en-l4-fix", word: "FIX", language: "english", level: 4, category: "verbs", difficulty: 1, enabled: true },
  { id: "en-l4-mix", word: "MIX", language: "english", level: 4, category: "verbs", difficulty: 1, enabled: true },
  { id: "en-l4-ran", word: "RAN", language: "english", level: 4, category: "verbs", difficulty: 1, enabled: true },
  { id: "en-l4-can", word: "CAN", language: "english", level: 4, category: "verbs", difficulty: 1, enabled: true },
  { id: "en-l4-fan", word: "FAN", language: "english", level: 4, category: "objects", image: "🌬️", difficulty: 2, enabled: true },
  { id: "en-l4-man", word: "MAN", language: "english", level: 4, category: "people", image: "👨", difficulty: 2, enabled: true },
  { id: "en-l4-pan", word: "PAN", language: "english", level: 4, category: "kitchen", difficulty: 2, enabled: true },
  { id: "en-l4-van", word: "VAN", language: "english", level: 4, category: "transport", image: "🚐", difficulty: 2, enabled: true },

  // LEVEL 5 — 77 unique 4-letter words (10 more new words added to level 4's 67)
  { id: "en-l5-tan", word: "TAN", language: "english", level: 5, category: "colors", difficulty: 1, enabled: true },
  { id: "en-l5-sit", word: "SIT", language: "english", level: 5, category: "verbs", difficulty: 1, enabled: true },
  { id: "en-l5-bit", word: "BIT", language: "english", level: 5, category: "nouns", difficulty: 1, enabled: true },
  { id: "en-l5-fit", word: "FIT", language: "english", level: 5, category: "adjectives", difficulty: 1, enabled: true },
  { id: "en-l5-hit", word: "HIT", language: "english", level: 5, category: "verbs", difficulty: 1, enabled: true },
  { id: "en-l5-kit", word: "KIT", language: "english", level: 5, category: "objects", difficulty: 1, enabled: true },
  { id: "en-l5-pit", word: "PIT", language: "english", level: 5, category: "places", difficulty: 2, enabled: true },
  { id: "en-l5-wit", word: "WIT", language: "english", level: 5, category: "nouns", difficulty: 2, enabled: true },
  { id: "en-l5-zip", word: "ZIP", language: "english", level: 5, category: "verbs", difficulty: 2, enabled: true },
  { id: "en-l5-bug", word: "BUG", language: "english", level: 5, category: "animals", image: "🐛", difficulty: 2, enabled: true },
];

// Verify word counts
const level1 = ENGLISH_WORDS.filter(w => w.level === 1).length;
const level2 = ENGLISH_WORDS.filter(w => w.level <= 2).length;
const level3 = ENGLISH_WORDS.filter(w => w.level <= 3).length;
const level4 = ENGLISH_WORDS.filter(w => w.level <= 4).length;
const level5 = ENGLISH_WORDS.filter(w => w.level <= 5).length;

console.log(`Word counts - L1: ${level1}, L2: ${level2}, L3: ${level3}, L4: ${level4}, L5: ${level5}`);

// ─── Utility Functions ──────────────────────────────────────────────────────

export function getWordsForLevel(language: Language, level: number): Word[] {
  const datasets: Record<Language, Word[]> = {
    english: ENGLISH_WORDS,
    yoruba: [],
    french: [],
    igbo: [],
    hausa: [],
  };
  
  return datasets[language].filter(w => w.level === level && w.enabled);
}

export function getAllWords(language: Language): Word[] {
  const datasets: Record<Language, Word[]> = {
    english: ENGLISH_WORDS,
    yoruba: [],
    french: [],
    igbo: [],
    hausa: [],
  };
  
  return datasets[language].filter(w => w.enabled);
}

export function getRandomWord(language: Language, level: number): Word | undefined {
  const words = getWordsForLevel(language, level);
  if (words.length === 0) return undefined;
  return words[Math.floor(Math.random() * words.length)];
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Export for use in game
export const wordDatasets: Record<Language, Word[]> = {
  english: ENGLISH_WORDS,
  yoruba: [],
  french: [],
  igbo: [],
  hausa: [],
};

export default wordDatasets;
