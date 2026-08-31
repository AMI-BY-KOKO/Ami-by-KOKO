/**
 * Multi-language word datasets for Word Builder game.
 * Each language has its own curated vocabulary appropriate for early literacy.
 *
 * Structure:
 * - Level 1: 2-letter words (8 words)
 * - Level 2: Simple 3-letter CVC words (10 words)
 * - Level 3: Harder 3-letter words (10 words)
 * - Level 4: 4-letter words (12 words)
 * - Level 5: Challenge 4-letter words (12 words)
 */

import type { Language } from "@/types";
import type { Word } from "@/lib/wordBuilder/types";

// ─── ENGLISH WORDS ──────────────────────────────────────────────────────────

const ENGLISH_WORDS: Word[] = [
  // LEVEL 1 — 2-letter words
  { id: "en-l1-am", word: "AM", language: "english", level: 1, category: "verbs", difficulty: 1, enabled: true },
  { id: "en-l1-an", word: "AN", language: "english", level: 1, category: "articles", difficulty: 1, enabled: true },
  { id: "en-l1-at", word: "AT", language: "english", level: 1, category: "prepositions", difficulty: 1, enabled: true },
  { id: "en-l1-in", word: "IN", language: "english", level: 1, category: "prepositions", difficulty: 1, enabled: true },
  { id: "en-l1-is", word: "IS", language: "english", level: 1, category: "verbs", difficulty: 1, enabled: true },
  { id: "en-l1-it", word: "IT", language: "english", level: 1, category: "pronouns", difficulty: 1, enabled: true },
  { id: "en-l1-on", word: "ON", language: "english", level: 1, category: "prepositions", difficulty: 1, enabled: true },
  { id: "en-l1-up", word: "UP", language: "english", level: 1, category: "prepositions", difficulty: 1, enabled: true },

  // LEVEL 2 — Simple 3-letter CVC words
  { id: "en-l2-cat", word: "CAT", language: "english", level: 2, category: "animals", image: "🐱", difficulty: 1, enabled: true },
  { id: "en-l2-dog", word: "DOG", language: "english", level: 2, category: "animals", image: "🐕", difficulty: 1, enabled: true },
  { id: "en-l2-sun", word: "SUN", language: "english", level: 2, category: "nature", image: "☀️", difficulty: 1, enabled: true },
  { id: "en-l2-bus", word: "BUS", language: "english", level: 2, category: "transport", image: "🚌", difficulty: 1, enabled: true },
  { id: "en-l2-map", word: "MAP", language: "english", level: 2, category: "objects", image: "🗺️", difficulty: 2, enabled: true },
  { id: "en-l2-hat", word: "HAT", language: "english", level: 2, category: "clothing", image: "🎩", difficulty: 2, enabled: true },
  { id: "en-l2-fan", word: "FAN", language: "english", level: 2, category: "objects", image: "🤍", difficulty: 2, enabled: true },
  { id: "en-l2-bag", word: "BAG", language: "english", level: 2, category: "objects", image: "👜", difficulty: 2, enabled: true },
  { id: "en-l2-bed", word: "BED", language: "english", level: 2, category: "home", image: "🛏️", difficulty: 2, enabled: true },
  { id: "en-l2-pen", word: "PEN", language: "english", level: 2, category: "objects", image: "🖊️", difficulty: 2, enabled: true },

  // LEVEL 3 — Harder 3-letter words
  { id: "en-l3-cup", word: "CUP", language: "english", level: 3, category: "objects", image: "🥤", difficulty: 1, enabled: true },
  { id: "en-l3-fox", word: "FOX", language: "english", level: 3, category: "animals", image: "🦊", difficulty: 1, enabled: true },
  { id: "en-l3-ran", word: "RAN", language: "english", level: 3, category: "verbs", difficulty: 2, enabled: true },
  { id: "en-l3-sit", word: "SIT", language: "english", level: 3, category: "verbs", difficulty: 2, enabled: true },
  { id: "en-l3-run", word: "RUN", language: "english", level: 3, category: "verbs", difficulty: 2, enabled: true },
  { id: "en-l3-hit", word: "HIT", language: "english", level: 3, category: "verbs", difficulty: 2, enabled: true },
  { id: "en-l3-bug", word: "BUG", language: "english", level: 3, category: "animals", image: "🐛", difficulty: 2, enabled: true },
  { id: "en-l3-big", word: "BIG", language: "english", level: 3, category: "adjectives", difficulty: 2, enabled: true },
  { id: "en-l3-pig", word: "PIG", language: "english", level: 3, category: "animals", image: "🐷", difficulty: 3, enabled: true },
  { id: "en-l3-dug", word: "DUG", language: "english", level: 3, category: "verbs", difficulty: 3, enabled: true },

  // LEVEL 4 — 4-letter words
  { id: "en-l4-fish", word: "FISH", language: "english", level: 4, category: "animals", image: "🐟", difficulty: 1, enabled: true },
  { id: "en-l4-book", word: "BOOK", language: "english", level: 4, category: "objects", image: "📖", difficulty: 1, enabled: true },
  { id: "en-l4-ball", word: "BALL", language: "english", level: 4, category: "objects", image: "⚽", difficulty: 1, enabled: true },
  { id: "en-l4-tree", word: "TREE", language: "english", level: 4, category: "nature", image: "🌳", difficulty: 1, enabled: true },
  { id: "en-l4-star", word: "STAR", language: "english", level: 4, category: "nature", image: "⭐", difficulty: 2, enabled: true },
  { id: "en-l4-milk", word: "MILK", language: "english", level: 4, category: "food", image: "🥛", difficulty: 2, enabled: true },
  { id: "en-l4-home", word: "HOME", language: "english", level: 4, category: "home", image: "🏠", difficulty: 2, enabled: true },
  { id: "en-l4-play", word: "PLAY", language: "english", level: 4, category: "verbs", difficulty: 2, enabled: true },
  { id: "en-l4-cake", word: "CAKE", language: "english", level: 4, category: "food", image: "🍰", difficulty: 2, enabled: true },
  { id: "en-l4-bird", word: "BIRD", language: "english", level: 4, category: "animals", image: "🕊️", difficulty: 3, enabled: true },
  { id: "en-l4-rain", word: "RAIN", language: "english", level: 4, category: "weather", image: "🌧️", difficulty: 3, enabled: true },
  { id: "en-l4-hand", word: "HAND", language: "english", level: 4, category: "body", image: "✋", difficulty: 3, enabled: true },

  // LEVEL 5 — Challenge 4-letter words
  { id: "en-l5-jump", word: "JUMP", language: "english", level: 5, category: "verbs", difficulty: 1, enabled: true },
  { id: "en-l5-kick", word: "KICK", language: "english", level: 5, category: "verbs", difficulty: 1, enabled: true },
  { id: "en-l5-help", word: "HELP", language: "english", level: 5, category: "verbs", difficulty: 1, enabled: true },
  { id: "en-l5-rock", word: "ROCK", language: "english", level: 5, category: "objects", difficulty: 2, enabled: true },
  { id: "en-l5-rich", word: "RICH", language: "english", level: 5, category: "adjectives", difficulty: 2, enabled: true },
  { id: "en-l5-math", word: "MATH", language: "english", level: 5, category: "subjects", difficulty: 2, enabled: true },
  { id: "en-l5-face", word: "FACE", language: "english", level: 5, category: "body", image: "😊", difficulty: 2, enabled: true },
  { id: "en-l5-race", word: "RACE", language: "english", level: 5, category: "verbs", difficulty: 3, enabled: true },
  { id: "en-l5-rice", word: "RICE", language: "english", level: 5, category: "food", image: "🍚", difficulty: 3, enabled: true },
  { id: "en-l5-mice", word: "MICE", language: "english", level: 5, category: "animals", image: "🐭", difficulty: 3, enabled: true },
  { id: "en-l5-once", word: "ONCE", language: "english", level: 5, category: "adverbs", difficulty: 3, enabled: true },
  { id: "en-l5-nice", word: "NICE", language: "english", level: 5, category: "adjectives", difficulty: 3, enabled: true },
];

// ─── YORÙBÁ WORDS ──────────────────────────────────────────────────────────

const YORUBA_WORDS: Word[] = [
  // LEVEL 1 — 2-letter words
  { id: "yo-l1-bi", word: "BI", language: "yoruba", level: 1, category: "verbs", difficulty: 1, enabled: true },
  { id: "yo-l1-ni", word: "NI", language: "yoruba", level: 1, category: "verbs", difficulty: 1, enabled: true },
  { id: "yo-l1-ti", word: "TI", language: "yoruba", level: 1, category: "prepositions", difficulty: 1, enabled: true },
  { id: "yo-l1-yi", word: "YI", language: "yoruba", level: 1, category: "verbs", difficulty: 1, enabled: true },
  { id: "yo-l1-je", word: "JẸ", language: "yoruba", level: 1, category: "verbs", difficulty: 1, enabled: true },
  { id: "yo-l1-pa", word: "PA", language: "yoruba", level: 1, category: "verbs", difficulty: 1, enabled: true },
  { id: "yo-l1-se", word: "SẸ", language: "yoruba", level: 1, category: "verbs", difficulty: 1, enabled: true },
  { id: "yo-l1-wo", word: "WO", language: "yoruba", level: 1, category: "verbs", difficulty: 1, enabled: true },

  // LEVEL 2 — Simple 3-letter words
  { id: "yo-l2-aja", word: "AJA", language: "yoruba", level: 2, category: "animals", image: "🐕", difficulty: 1, enabled: true },
  { id: "yo-l2-eko", word: "ẸKỌ", language: "yoruba", level: 2, category: "food", image: "🥘", difficulty: 1, enabled: true },
  { id: "yo-l2-ile", word: "ILẸ", language: "yoruba", level: 2, category: "home", image: "🏠", difficulty: 1, enabled: true },
  { id: "yo-l2-eye", word: "ẸYẸ", language: "yoruba", level: 2, category: "animals", image: "🦅", difficulty: 1, enabled: true },
  { id: "yo-l2-ori", word: "ORI", language: "yoruba", level: 2, category: "body", image: "👤", difficulty: 2, enabled: true },
  { id: "yo-l2-ise", word: "IṢẸ", language: "yoruba", level: 2, category: "verbs", difficulty: 2, enabled: true },
  { id: "yo-l2-iwe", word: "IWẸ", language: "yoruba", level: 2, category: "objects", image: "📖", difficulty: 2, enabled: true },
  { id: "yo-l2-igbe", word: "IGBE", language: "yoruba", level: 2, category: "objects", difficulty: 2, enabled: true },
  { id: "yo-l2-elu", word: "ELU", language: "yoruba", level: 2, category: "animals", image: "🦌", difficulty: 2, enabled: true },
  { id: "yo-l2-ise", word: "IṢẸ", language: "yoruba", level: 2, category: "work", difficulty: 2, enabled: true },

  // LEVEL 3 — Harder 3-letter words
  { id: "yo-l3-omi", word: "OMI", language: "yoruba", level: 3, category: "nature", image: "💧", difficulty: 1, enabled: true },
  { id: "yo-l3-oja", word: "OJA", language: "yoruba", level: 3, category: "places", difficulty: 1, enabled: true },
  { id: "yo-l3-ise", word: "IṢẸ", language: "yoruba", level: 3, category: "work", difficulty: 2, enabled: true },
  { id: "yo-l3-aro", word: "ARO", language: "yoruba", level: 3, category: "nature", difficulty: 2, enabled: true },
  { id: "yo-l3-ide", word: "IDẸ", language: "yoruba", level: 3, category: "objects", difficulty: 2, enabled: true },
  { id: "yo-l3-apa", word: "APA", language: "yoruba", level: 3, category: "body", image: "💪", difficulty: 2, enabled: true },
  { id: "yo-l3-eko", word: "ẸKỌ", language: "yoruba", level: 3, category: "food", difficulty: 2, enabled: true },
  { id: "yo-l3-ire", word: "IRẸ", language: "yoruba", level: 3, category: "adjectives", difficulty: 3, enabled: true },
  { id: "yo-l3-osi", word: "OSI", language: "yoruba", level: 3, category: "adjectives", difficulty: 3, enabled: true },
  { id: "yo-l3-aye", word: "AYẸ", language: "yoruba", level: 3, category: "nature", difficulty: 3, enabled: true },

  // LEVEL 4 — 4-letter words
  { id: "yo-l4-oniko", word: "ONIKO", language: "yoruba", level: 4, category: "places", difficulty: 1, enabled: true },
  { id: "yo-l4-malu", word: "MALU", language: "yoruba", level: 4, category: "animals", image: "🐄", difficulty: 1, enabled: true },
  { id: "yo-l4-igba", word: "IGBA", language: "yoruba", level: 4, category: "objects", difficulty: 1, enabled: true },
  { id: "yo-l4-yam", word: "YAM", language: "yoruba", level: 4, category: "food", image: "🥔", difficulty: 1, enabled: true },
  { id: "yo-l4-rira", word: "RIRA", language: "yoruba", level: 4, category: "verbs", difficulty: 2, enabled: true },
  { id: "yo-l4-dide", word: "DIDẸ", language: "yoruba", level: 4, category: "verbs", difficulty: 2, enabled: true },
  { id: "yo-l4-jade", word: "JADẸ", language: "yoruba", level: 4, category: "verbs", difficulty: 2, enabled: true },
  { id: "yo-l4-bino", word: "BINO", language: "yoruba", level: 4, category: "adjectives", difficulty: 2, enabled: true },
  { id: "yo-l4-gidi", word: "GIDI", language: "yoruba", level: 4, category: "adjectives", difficulty: 3, enabled: true },
  { id: "yo-l4-faya", word: "FAYA", language: "yoruba", level: 4, category: "nature", image: "🔥", difficulty: 3, enabled: true },
  { id: "yo-l4-ojiji", word: "OJIJI", language: "yoruba", level: 4, category: "nature", difficulty: 3, enabled: true },
  { id: "yo-l4-kini", word: "KINI", language: "yoruba", level: 4, category: "adjectives", difficulty: 3, enabled: true },

  // LEVEL 5 — Challenge 4-letter words
  { id: "yo-l5-fili", word: "FILI", language: "yoruba", level: 5, category: "verbs", difficulty: 1, enabled: true },
  { id: "yo-l5-toto", word: "TOTO", language: "yoruba", level: 5, category: "adjectives", difficulty: 1, enabled: true },
  { id: "yo-l5-jore", word: "JORẸ", language: "yoruba", level: 5, category: "verbs", difficulty: 1, enabled: true },
  { id: "yo-l5-tani", word: "TANI", language: "yoruba", level: 5, category: "adjectives", difficulty: 2, enabled: true },
  { id: "yo-l5-gara", word: "GARA", language: "yoruba", level: 5, category: "verbs", difficulty: 2, enabled: true },
  { id: "yo-l5-dede", word: "DẸDẸ", language: "yoruba", level: 5, category: "verbs", difficulty: 2, enabled: true },
  { id: "yo-l5-femi", word: "FEMI", language: "yoruba", level: 5, category: "places", difficulty: 2, enabled: true },
  { id: "yo-l5-baba", word: "BABA", language: "yoruba", level: 5, category: "family", image: "👨", difficulty: 3, enabled: true },
  { id: "yo-l5-iya", word: "IYA", language: "yoruba", level: 5, category: "family", image: "👩", difficulty: 3, enabled: true },
  { id: "yo-l5-omo", word: "OMO", language: "yoruba", level: 5, category: "family", difficulty: 3, enabled: true },
  { id: "yo-l5-aiye", word: "AIYẸ", language: "yoruba", level: 5, category: "nature", difficulty: 3, enabled: true },
  { id: "yo-l5-alaro", word: "ALARO", language: "yoruba", level: 5, category: "places", difficulty: 3, enabled: true },
];

// ─── FRENCH WORDS ────────────────────────────────────────────────────────────

const FRENCH_WORDS: Word[] = [
  // LEVEL 1 — 2-letter words
  { id: "fr-l1-je", word: "JE", language: "french", level: 1, category: "pronouns", difficulty: 1, enabled: true },
  { id: "fr-l1-tu", word: "TU", language: "french", level: 1, category: "pronouns", difficulty: 1, enabled: true },
  { id: "fr-l1-un", word: "UN", language: "french", level: 1, category: "articles", difficulty: 1, enabled: true },
  { id: "fr-l1-et", word: "ET", language: "french", level: 1, category: "conjunctions", difficulty: 1, enabled: true },
  { id: "fr-l1-ou", word: "OU", language: "french", level: 1, category: "conjunctions", difficulty: 1, enabled: true },
  { id: "fr-l1-au", word: "AU", language: "french", level: 1, category: "prepositions", difficulty: 1, enabled: true },
  { id: "fr-l1-du", word: "DU", language: "french", level: 1, category: "prepositions", difficulty: 1, enabled: true },
  { id: "fr-l1-de", word: "DE", language: "french", level: 1, category: "prepositions", difficulty: 1, enabled: true },

  // LEVEL 2 — Simple 3-letter words
  { id: "fr-l2-cat", word: "CAT", language: "french", level: 2, category: "animals", image: "🐱", difficulty: 1, enabled: true },
  { id: "fr-l2-rat", word: "RAT", language: "french", level: 2, category: "animals", image: "🐭", difficulty: 1, enabled: true },
  { id: "fr-l2-par", word: "PAR", language: "french", level: 2, category: "prepositions", difficulty: 1, enabled: true },
  { id: "fr-l2-bus", word: "BUS", language: "french", level: 2, category: "transport", image: "🚌", difficulty: 1, enabled: true },
  { id: "fr-l2-jeu", word: "JEU", language: "french", level: 2, category: "objects", image: "🎮", difficulty: 2, enabled: true },
  { id: "fr-l2-été", word: "ÉTÉ", language: "french", level: 2, category: "weather", image: "☀️", difficulty: 2, enabled: true },
  { id: "fr-l2-oui", word: "OUI", language: "french", level: 2, category: "verbs", difficulty: 2, enabled: true },
  { id: "fr-l2-non", word: "NON", language: "french", level: 2, category: "verbs", difficulty: 2, enabled: true },
  { id: "fr-l2-lit", word: "LIT", language: "french", level: 2, category: "furniture", image: "🛏️", difficulty: 2, enabled: true },
  { id: "fr-l2-feu", word: "FEU", language: "french", level: 2, category: "nature", image: "🔥", difficulty: 2, enabled: true },

  // LEVEL 3 — Harder 3-letter words
  { id: "fr-l3-eau", word: "EAU", language: "french", level: 3, category: "nature", image: "💧", difficulty: 1, enabled: true },
  { id: "fr-l3-arc", word: "ARC", language: "french", level: 3, category: "nature", image: "🌈", difficulty: 1, enabled: true },
  { id: "fr-l3-ouf", word: "OUF", language: "french", level: 3, category: "adjectives", difficulty: 2, enabled: true },
  { id: "fr-l3-rue", word: "RUE", language: "french", level: 3, category: "places", difficulty: 2, enabled: true },
  { id: "fr-l3-roi", word: "ROI", language: "french", level: 3, category: "people", image: "👑", difficulty: 2, enabled: true },
  { id: "fr-l3-sou", word: "SOU", language: "french", level: 3, category: "money", difficulty: 2, enabled: true },
  { id: "fr-l3-fou", word: "FOU", language: "french", level: 3, category: "adjectives", difficulty: 2, enabled: true },
  { id: "fr-l3-une", word: "UNE", language: "french", level: 3, category: "articles", difficulty: 2, enabled: true },
  { id: "fr-l3-six", word: "SIX", language: "french", level: 3, category: "numbers", difficulty: 3, enabled: true },
  { id: "fr-l3-dix", word: "DIX", language: "french", level: 3, category: "numbers", difficulty: 3, enabled: true },

  // LEVEL 4 — 4-letter words
  { id: "fr-l4-chat", word: "CHAT", language: "french", level: 4, category: "animals", image: "🐱", difficulty: 1, enabled: true },
  { id: "fr-l4-chien", word: "CHIEN", language: "french", level: 4, category: "animals", image: "🐕", difficulty: 1, enabled: true },
  { id: "fr-l4-soleil", word: "SOLEIL", language: "french", level: 4, category: "nature", image: "☀️", difficulty: 1, enabled: true },
  { id: "fr-l4-livre", word: "LIVRE", language: "french", level: 4, category: "objects", image: "📖", difficulty: 1, enabled: true },
  { id: "fr-l4-arbre", word: "ARBRE", language: "french", level: 4, category: "nature", image: "🌳", difficulty: 2, enabled: true },
  { id: "fr-l4-main", word: "MAIN", language: "french", level: 4, category: "body", image: "✋", difficulty: 2, enabled: true },
  { id: "fr-l4-pain", word: "PAIN", language: "french", level: 4, category: "food", image: "🥖", difficulty: 2, enabled: true },
  { id: "fr-l4-pied", word: "PIED", language: "french", level: 4, category: "body", image: "🦶", difficulty: 2, enabled: true },
  { id: "fr-l4-lune", word: "LUNE", language: "french", level: 4, category: "nature", image: "🌙", difficulty: 3, enabled: true },
  { id: "fr-l4-maison", word: "MAISON", language: "french", level: 4, category: "home", image: "🏠", difficulty: 3, enabled: true },
  { id: "fr-l4-papier", word: "PAPIER", language: "french", level: 4, category: "objects", difficulty: 3, enabled: true },
  { id: "fr-l4-couleur", word: "COULEUR", language: "french", level: 4, category: "adjectives", difficulty: 3, enabled: true },

  // LEVEL 5 — Challenge 4-letter words
  { id: "fr-l5-jouer", word: "JOUER", language: "french", level: 5, category: "verbs", difficulty: 1, enabled: true },
  { id: "fr-l5-danser", word: "DANSER", language: "french", level: 5, category: "verbs", difficulty: 1, enabled: true },
  { id: "fr-l5-manger", word: "MANGER", language: "french", level: 5, category: "verbs", difficulty: 1, enabled: true },
  { id: "fr-l5-aller", word: "ALLER", language: "french", level: 5, category: "verbs", difficulty: 2, enabled: true },
  { id: "fr-l5-sauter", word: "SAUTER", language: "french", level: 5, category: "verbs", difficulty: 2, enabled: true },
  { id: "fr-l5-rire", word: "RIRE", language: "french", level: 5, category: "verbs", difficulty: 2, enabled: true },
  { id: "fr-l5-bleu", word: "BLEU", language: "french", level: 5, category: "colors", image: "🔵", difficulty: 2, enabled: true },
  { id: "fr-l5-rouge", word: "ROUGE", language: "french", level: 5, category: "colors", image: "🔴", difficulty: 3, enabled: true },
  { id: "fr-l5-jaune", word: "JAUNE", language: "french", level: 5, category: "colors", image: "🟡", difficulty: 3, enabled: true },
  { id: "fr-l5-vert", word: "VERT", language: "french", level: 5, category: "colors", image: "🟢", difficulty: 3, enabled: true },
  { id: "fr-l5-noir", word: "NOIR", language: "french", level: 5, category: "colors", difficulty: 3, enabled: true },
  { id: "fr-l5-blanc", word: "BLANC", language: "french", level: 5, category: "colors", difficulty: 3, enabled: true },
];

// ─── Word Dataset Index ────────────────────────────────────────────────────

export const WORD_DATASETS: Record<string, Word[]> = {
  english: ENGLISH_WORDS,
  yoruba: YORUBA_WORDS,
  french: FRENCH_WORDS,
};

/**
 * Get words for a specific language and level
 */
export function getWordsForLevel(language: Language, level: 1 | 2 | 3 | 4 | 5): Word[] {
  const dataset = WORD_DATASETS[language] ?? [];
  return dataset.filter(w => w.level === level && w.enabled);
}

/**
 * Get a random word from a level
 */
export function getRandomWord(language: Language, level: 1 | 2 | 3 | 4 | 5): Word | null {
  const words = getWordsForLevel(language, level);
  if (words.length === 0) return null;
  return words[Math.floor(Math.random() * words.length)];
}

/**
 * Shuffle an array (Fisher-Yates)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Get all words for a specific language
 */
export function getAllWords(language: Language): Word[] {
  return WORD_DATASETS[language] ?? [];
}
