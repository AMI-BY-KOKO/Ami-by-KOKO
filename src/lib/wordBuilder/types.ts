/**
 * Word Builder game types and data models.
 * Supports multi-language word building with language-specific progression.
 */

import type { Language } from "@/types";

// ─── Language Configuration ─────────────────────────────────────────────────

export interface LanguageOption {
  id: Language;
  displayName: string;
  nativeName: string;
  locale: string;
  flag: string;
  description: string;
  playLabel: string;
  locked?: boolean; // true for languages requiring paid access
}

export const LANGUAGE_OPTIONS: Record<Language, LanguageOption> = {
  english: {
    id: "english",
    displayName: "English",
    nativeName: "English",
    locale: "en",
    flag: "🇬🇧",
    description: "Build English words!",
    playLabel: "PLAY",
    locked: false,
  },
  yoruba: {
    id: "yoruba",
    displayName: "Yorùbá",
    nativeName: "Yorùbá",
    locale: "yo",
    flag: "🇳🇬",
    description: "Ṣẹ̀dá àwọn ọ̀rọ̀ Yorùbá!",
    playLabel: "ṢERÉ",
    locked: true, // paid access
  },
  french: {
    id: "french",
    displayName: "Français",
    nativeName: "Français",
    locale: "fr",
    flag: "🇫🇷",
    description: "Construis des mots !",
    playLabel: "JOUER",
    locked: false,
  },
  igbo: {
    id: "igbo",
    displayName: "Igbo",
    nativeName: "Igbo",
    locale: "ig",
    flag: "🇳🇬",
    description: "Megharia okwu!",
    playLabel: "GWUO",
    locked: true,
  },
  hausa: {
    id: "hausa",
    displayName: "Hausa",
    nativeName: "Hausa",
    locale: "ha",
    flag: "🇳🇬",
    description: "Buga kalmomi!",
    playLabel: "GWUO",
    locked: true,
  },
};

// ─── Word Data Model ────────────────────────────────────────────────────────

export interface Word {
  id: string;
  word: string;
  language: Language;
  level: 1 | 2 | 3 | 4 | 5;
  category: string;
  image?: string; // emoji or URL
  translation?: string;
  difficulty: number; // 1–5 within the level
  enabled: boolean;
}

export interface WordChallenge {
  word: Word;
  letters: string[]; // shuffled
  correctOrder: string[]; // solution
  distractorLetters: string[]; // extra tiles
}

// ─── Game State ────────────────────────────────────────────────────────────

export interface WordBuilderProgress {
  id: string;
  user_id: string;
  language: Language;
  current_level: number;
  current_word_index: number;
  words_completed: number;
  stars_earned: number;
  streak_count: number;
  last_streak_date: string; // ISO date
  word_garden_seeds: number;
  daily_word_completed_today: boolean;
  last_daily_word_date: string; // ISO date
  mastered_words: string[]; // word IDs
  achievements?: AchievementType[]; // unlocked achievement IDs
  last_synced: string; // ISO timestamp
}

export interface DailyWordState {
  word: Word;
  completed: boolean;
  bonus_stars: number;
}

// ─── Level Configuration ───────────────────────────────────────────────────

export interface LevelConfig {
  level: 1 | 2 | 3 | 4 | 5;
  name: string;
  description: string;
  wordLengths: number[]; // e.g. [2] for level 1, [3] for level 2
  wordsPerLevel: number;
  distractorLetterCount: number;
  hintsAvailable: number;
  timeLimit?: number; // milliseconds; null for no limit
  showPictures: boolean;
  showAudio: boolean;
}

export const LEVEL_CONFIGS: Record<number, LevelConfig> = {
  1: {
    level: 1,
    name: "🌱 Letter Garden",
    description: "Meet your letter friends!",
    wordLengths: [2],
    wordsPerLevel: 8,
    distractorLetterCount: 0,
    hintsAvailable: 3,
    showPictures: true,
    showAudio: true,
  },
  2: {
    level: 2,
    name: "🛤️ Little Word Path",
    description: "Your first words await!",
    wordLengths: [3],
    wordsPerLevel: 10,
    distractorLetterCount: 1,
    hintsAvailable: 3,
    showPictures: true,
    showAudio: true,
  },
  3: {
    level: 3,
    name: "🌳 Word Forest",
    description: "Explore new words!",
    wordLengths: [3],
    wordsPerLevel: 10,
    distractorLetterCount: 2,
    hintsAvailable: 2,
    showPictures: true,
    showAudio: true,
  },
  4: {
    level: 4,
    name: "🏘️ Kòkò's Village",
    description: "Build bigger words!",
    wordLengths: [4],
    wordsPerLevel: 12,
    distractorLetterCount: 2,
    hintsAvailable: 2,
    showPictures: true,
    showAudio: true,
  },
  5: {
    level: 5,
    name: "🏆 Kòkò Challenge",
    description: "Ready for the ultimate challenge?",
    wordLengths: [4],
    wordsPerLevel: 12,
    distractorLetterCount: 3,
    hintsAvailable: 1,
    showPictures: true,
    showAudio: true,
  },
};

// ─── Game Modes (Architecture for future expansion) ─────────────────────────

export type GameMode = "BUILD" | "LISTEN" | "FIND";

export interface GameModeConfig {
  id: GameMode;
  name: string;
  description: string;
  implementedFor: Language[];
  requirements?: {
    audioRequired?: boolean;
    imageRequired?: boolean;
  };
}

export const GAME_MODE_CONFIGS: Record<GameMode, GameModeConfig> = {
  BUILD: {
    id: "BUILD",
    name: "Letter Puzzle",
    description: "Arrange letters to build words",
    implementedFor: ["english", "yoruba", "french", "igbo", "hausa"],
  },
  LISTEN: {
    id: "LISTEN",
    name: "Sound Challenge",
    description: "Hear a word, spell it out",
    implementedFor: [],
    requirements: {
      audioRequired: true,
    },
  },
  FIND: {
    id: "FIND",
    name: "Word Hunt",
    description: "Find the word from picture clues",
    implementedFor: [],
    requirements: {
      imageRequired: true,
    },
  },
};

// ─── Achievements ──────────────────────────────────────────────────────────

export type AchievementType = 
  | "first-word"
  | "first-level"
  | "streak-3"
  | "streak-7"
  | "streak-14"
  | "streak-30"
  | "language-explorer"
  | "all-levels"
  | "word-collector";

export interface Achievement {
  id: AchievementType;
  emoji: string;
  label: string;
  description: string;
  unlockCondition: string;
  unlocked?: boolean;
  unlockedAt?: string; // ISO timestamp
}

export const ACHIEVEMENTS: Record<AchievementType, Achievement> = {
  "first-word": {
    id: "first-word",
    emoji: "🌱",
    label: "First Word",
    description: "Build your first word",
    unlockCondition: "Complete any word",
  },
  "first-level": {
    id: "first-level",
    emoji: "🎯",
    label: "Level Master",
    description: "Complete Level 1",
    unlockCondition: "Complete all words in Level 1",
  },
  "streak-3": {
    id: "streak-3",
    emoji: "🔥",
    label: "3-Day Streak",
    description: "3 days in a row",
    unlockCondition: "Play for 3 consecutive days",
  },
  "streak-7": {
    id: "streak-7",
    emoji: "🌿",
    label: "7-Day Streak",
    description: "7 days in a row",
    unlockCondition: "Play for 7 consecutive days",
  },
  "streak-14": {
    id: "streak-14",
    emoji: "🌳",
    label: "14-Day Streak",
    description: "14 days in a row",
    unlockCondition: "Play for 14 consecutive days",
  },
  "streak-30": {
    id: "streak-30",
    emoji: "👑",
    label: "30-Day Legend",
    description: "30 days in a row",
    unlockCondition: "Play for 30 consecutive days",
  },
  "language-explorer": {
    id: "language-explorer",
    emoji: "🌍",
    label: "Language Explorer",
    description: "Master multiple languages",
    unlockCondition: "Reach Level 3 in 2 different languages",
  },
  "all-levels": {
    id: "all-levels",
    emoji: "🏆",
    label: "Champion",
    description: "Complete all levels",
    unlockCondition: "Finish all 5 levels",
  },
  "word-collector": {
    id: "word-collector",
    emoji: "📚",
    label: "Word Collector",
    description: "Master 50 words",
    unlockCondition: "Collect 50 mastered words",
  },
};

// ─── Kòkò Feedback Messages ────────────────────────────────────────────────

export interface KokoDialogue {
  greeting: string;
  correct: string[];
  almost: string[];
  hint: string[];
  levelComplete: string[];
  newRecord: string[];
}

export const KOKO_DIALOGUE: Record<Language, KokoDialogue> = {
  english: {
    greeting: "Ready to explore a new world?",
    correct: [
      "Brilliant! You got it!",
      "YES! Perfect word!",
      "Amazing! You're a word wizard!",
      "Fantastic! That's the one!",
      "Excellent! Kòkò is so proud!",
      "You nailed it!",
      "What a champion!",
      "That's it! Well done!",
    ],
    almost: [
      "Almost there! Try again!",
      "You're so close! One more time!",
      "Nearly! Let's keep going!",
      "Don't give up! You can do it!",
      "So close! Try once more!",
      "Keep your eyes on the letters!",
    ],
    hint: [
      "Listen carefully to the sounds…",
      "Think about which letter makes that sound…",
      "Look at the picture! What is it?",
      "Tap the letters in order!",
      "You're on the right track…",
      "Remember: tap them carefully!",
    ],
    levelComplete: [
      "Level complete! You did it!",
      "Wow! You're a Word Builder master!",
      "Amazing journey! New world unlocked!",
      "You've earned your place here!",
      "Incredible! Ready for the next adventure?",
    ],
    newRecord: [
      "WOW! New high score!",
      "You're on fire! Incredible streak!",
      "Amazing performance! Kòkò loves it!",
      "You're becoming a real champion!",
    ],
  },
  yoruba: {
    greeting: "Ṣẹ̀dá àti kọ́ àwọn ọ̀rọ̀ tuntun?",
    correct: [
      "Dáradára! Ó wúlò gan-an!",
      "Ooo! Iyìmó rẹ!",
      "Ó bàjẹ́! Ọ̀rọ̀ naa!",
      "Ààbò! Iyẹn ni!",
      "Kòkò fẹ́ràn ẹ mó!",
      "Ìyìmó ẹ tó bẹ̀rẹ̀!",
      "Ẹ jẹ ọ̀rọ̀ ti!",
      "Àbí ẹ ṣe é pẹ̀lú?",
    ],
    almost: [
      "Àlá rẹ̀! Jẹ́ ká gbìyànjú lẹ́ẹ̀kọ̀!",
      "Ó ku kéré! Ọ̀kan síi!",
      "Kù àlá! Jẹ́ ká tẹ̀sìwájú!",
      "Ìdáramó àti àkọlé!",
      "O dé èkó! Ọ̀kan síi!",
      "Wo àwọn lẹ́tà rẹ̀ dáradára!",
    ],
    hint: [
      "Gbo ní kálukálù…",
      "Èwo ni ẹ̀dè ti? Wo!",
      "Wo àwòrán náà! Kí ni?",
      "Tẹ̀ àwọn lẹ́tà ní òfin!",
      "Ẹ̀ on ní òná tó!",
      "Tẹ̀ wọ́n ní ìjánu!",
    ],
    levelComplete: [
      "Ìpele kumplìtì! Ẹ ṣe é!",
      "Ayé! Ẹ jẹ Olùkọ́ àwọn ọ̀rọ̀!",
      "Ìrìnkere tó lẹ́wà! Àgbà tuntun!",
      "Ẹ jẹ ní ibadandun!",
      "Ó ní ìyìmó gan-an! Àgbà tuntun?",
    ],
    newRecord: [
      "Ooo! Ìṣiro tuntun!",
      "Ẹ jẹ ina! Òye tó ga!",
      "Ó ní ìyìmó gan-an! Kòkò fẹ́ràn ẹ!",
      "Ẹ̀ on jẹ Ọ̀kúta tó gidi!",
    ],
  },
  french: {
    greeting: "Prêt à explorer de nouveaux mondes?",
    correct: [
      "Bravo! Tu as trouvé!",
      "OUI! Mot parfait!",
      "Incroyable! Tu es un magicien des mots!",
      "Fantastique! C'est celui-là!",
      "Excellent! Kòkò est si fier!",
      "Tu as réussi!",
      "Quel champion!",
      "C'est ça! Bien joué!",
    ],
    almost: [
      "Presque! Essaie encore!",
      "Tu es si proche! Une de plus!",
      "Presque! Continuons!",
      "N'abandonne pas! Tu peux le faire!",
      "Si proche! Réessaie!",
      "Regarde bien les lettres!",
    ],
    hint: [
      "Écoute bien le son…",
      "Pense à la lettre qui fait ce son…",
      "Regarde l'image! Qu'est-ce que c'est?",
      "Appuie les lettres dans l'ordre!",
      "Tu es sur la bonne voie…",
      "Appuie-les avec soin!",
    ],
    levelComplete: [
      "Niveau complété! Tu as réussi!",
      "Wow! Tu es maître des mots!",
      "Incroyable! Nouveau monde débloqué!",
      "Tu as méritée ta place ici!",
      "Fantastique! Prêt pour la prochaine aventure?",
    ],
    newRecord: [
      "WOW! Nouveau record!",
      "Tu es en feu! Incroyable série!",
      "Performance incroyable! Kòkò l'adore!",
      "Tu deviens un vrai champion!",
    ],
  },
  igbo: {
    greeting: "Ị chọrọ ịbuo ọkwa ụfọdụ?",
    correct: [
      "Mma! Ị chụtara!",
      "Ọ! Okwu zuru ezu!",
      "Ụka! Ị bụ onye mmụta!",
      "Okwu ahụ!",
      "Kòkò hụrụ gị nwere ọbịọbị!",
    ],
    almost: [
      "Nso! Gbaghara ọzọ!",
      "Ụfọdụ! Karịa!",
      "Nso! Gbaghara!",
      "Emighi! Ị nwere ike!",
    ],
    hint: [
      "Nụ nke ọma…",
      "Chere okwu ahụ…",
      "Hụ foto! Kedu ihe o bụ?",
      "Tụa okwu ahụ!",
    ],
    levelComplete: [
      "Ọkwa kumplìtì! Ị ṣe é!",
      "Ụka! Ị bụ onye mmụta okwu!",
      "Ụka! Okwu ọhụrụ!",
    ],
    newRecord: [
      "Ụka! Ụzọ ọhụrụ!",
      "Ị nọ n'ọkụ! Nnịta!",
      "Ụka! Kòkò hụrụ!",
    ],
  },
  hausa: {
    greeting: "Kuna shirye kawai tambaya!",
    correct: [
      "Kyau! Ka samu shi!",
      "Ah! Kalma! Daidai!",
      "Abin mamaki! Ka yi sa'a!",
      "Anan ne! Kusan!",
      "Kòkò yana son ka sosai!",
    ],
    almost: [
      "Kusan! Ka sake gwada!",
      "Kusa! Sake damu!",
      "Kusan! Tsoron!",
      "Kar ka dame! Ka iya yin shi!",
    ],
    hint: [
      "Saurara kalma…",
      "Tunani game da kalma…",
      "Dubo hoton! Me ne ne?",
      "Buguga kalma!",
    ],
    levelComplete: [
      "Wajen kumplìtì! Ka iya yin shi!",
      "Abin mamaki! Ka yi sa'a!",
      "Abin mamaki! Sabuwar kasua!",
    ],
    newRecord: [
      "Abin mamaki! Sabuwar ƴarjaje!",
      "Kika yi sa'a! Ƴarjaje!",
      "Abin mamaki! Kòkò yana son!",
    ],
  },
};

// ─── Game Flow Messages ─────────────────────────────────────────────────────

export const INSTRUCTION_TEXT: Record<Language, string> = {
  english: "Build the word!",
  yoruba: "Kọ́ ọ̀rọ̀ náà!",
  french: "Construis le mot !",
  igbo: "Megharia okwu!",
  hausa: "Buga kalmomi!",
};

export const COMPLETION_TEXT: Record<Language, string> = {
  english: "Level Complete!",
  yoruba: "Ìpele Kumplìtì!",
  french: "Niveau Complété!",
  igbo: "Ọkwa Kumplìtì!",
  hausa: "Jiya Kumplìtì!",
};
