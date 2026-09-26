export type Question = {
  id: string;
  letter: string;
  word: string;
  image: string;
  /**
   * Optional relative path to a recorded/generated Kòkò prompt for this question.
   * When it is missing or cannot be played, the game uses speech synthesis.
   */
  audio?: string | null;
};

export const QUESTION_BANK: Question[] = [
  { id: 'agbado', letter: 'A', word: 'Àgbàdo', image: '🌽', audio: null },
  { id: 'apple', letter: 'A', word: 'Apple', image: '🍎', audio: null },
  { id: 'ant', letter: 'A', word: 'Ant', image: '🐜', audio: null },
  { id: 'airplane', letter: 'A', word: 'Airplane', image: '✈️', audio: null },
  { id: 'banana', letter: 'B', word: 'Banana', image: '🍌', audio: null },
  { id: 'ball', letter: 'B', word: 'Ball', image: '⚽', audio: null },
  { id: 'bus', letter: 'B', word: 'Bus', image: '🚌', audio: null },
  { id: 'book', letter: 'B', word: 'Book', image: '📖', audio: null },
  { id: 'cat', letter: 'C', word: 'Cat', image: '🐱', audio: null },
  { id: 'car', letter: 'C', word: 'Car', image: '🚗', audio: null },
  { id: 'cake', letter: 'C', word: 'Cake', image: '🎂', audio: null },
  { id: 'cup', letter: 'C', word: 'Cup', image: '☕', audio: null },
  { id: 'drum', letter: 'D', word: 'Drum', image: '🥁', audio: null },
  { id: 'dog', letter: 'D', word: 'Dog', image: '🐶', audio: null },
  { id: 'duck', letter: 'D', word: 'Duck', image: '🦆', audio: null },
  { id: 'door', letter: 'D', word: 'Door', image: '🚪', audio: null },
  { id: 'egg', letter: 'E', word: 'Egg', image: '🥚', audio: null },
  { id: 'elephant', letter: 'E', word: 'Elephant', image: '🐘', audio: null },
  { id: 'envelope', letter: 'E', word: 'Envelope', image: '✉️', audio: null },
  { id: 'ear', letter: 'E', word: 'Ear', image: '👂', audio: null },
  { id: 'fish', letter: 'F', word: 'Fish', image: '🐟', audio: null },
  { id: 'frog', letter: 'F', word: 'Frog', image: '🐸', audio: null },
  { id: 'flower', letter: 'F', word: 'Flower', image: '🌸', audio: null },
  { id: 'fox', letter: 'F', word: 'Fox', image: '🦊', audio: null },
];

export const LETTERS = Array.from(new Set(QUESTION_BANK.map((question) => question.letter)));

export const SOUND_NEIGHBORS: Record<string, string[]> = {
  A: ['E', 'I', 'O'],
  B: ['D', 'P', 'V'],
  C: ['K', 'S', 'G'],
  D: ['B', 'T', 'G'],
  E: ['A', 'I', 'O'],
  F: ['V', 'P', 'S'],
};