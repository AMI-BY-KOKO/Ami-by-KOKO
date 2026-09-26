import { LETTERS, QUESTION_BANK, SOUND_NEIGHBORS, type Question } from './questions';

export const SUPER_LETTER_CHALLENGE_LENGTH = 10;

export type SuperLetterChallengeQuestionType =
  | 'picture-to-letter'
  | 'hear-word-to-letter'
  | 'letter-to-picture'
  | 'beginning-sound-to-letter';

type LetterAnswerQuestionType = Exclude<SuperLetterChallengeQuestionType, 'letter-to-picture'>;

export type SuperLetterChallengeQuestion =
  | {
      id: string;
      type: LetterAnswerQuestionType;
      question: Question;
      choices: string[];
    }
  | {
      id: string;
      type: 'letter-to-picture';
      question: Question;
      choices: Question[];
    };

const LEVEL_5_WORD_IDS = [
  'apple',
  'banana',
  'ball',
  'cat',
  'dog',
  'drum',
  'egg',
  'fish',
  'flower',
] as const;

const QUESTION_TYPE_MIX: SuperLetterChallengeQuestionType[] = [
  'picture-to-letter',
  'hear-word-to-letter',
  'letter-to-picture',
  'beginning-sound-to-letter',
  'picture-to-letter',
  'hear-word-to-letter',
  'letter-to-picture',
  'beginning-sound-to-letter',
  'hear-word-to-letter',
  'beginning-sound-to-letter',
];

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function getLevel5Vocabulary(): Question[] {
  const questionsById = new Map<string, Question>(QUESTION_BANK.map((question) => [question.id, question]));
  return LEVEL_5_WORD_IDS.map((id) => {
    const question = questionsById.get(id);
    if (!question || !question.word.trim() || !question.image) {
      throw new Error(`Level 5 vocabulary is missing a usable question for "${id}".`);
    }
    return question;
  });
}

function makeLetterChoices(correctLetter: string, availableLetters: string[]): string[] {
  if (!availableLetters.includes(correctLetter) || availableLetters.length < 3) {
    throw new Error(`Level 5 needs three distinct letter choices for "${correctLetter}".`);
  }

  const preferredDistractors = SOUND_NEIGHBORS[correctLetter] ?? [];
  const candidates = Array.from(new Set([
    ...preferredDistractors.filter((letter) => availableLetters.includes(letter)),
    ...shuffle(availableLetters.filter((letter) => letter !== correctLetter)),
  ])).filter((letter) => letter !== correctLetter);
  const distractors = candidates.slice(0, 2);
  if (distractors.length !== 2) {
    throw new Error(`Level 5 could not find two distinct distractors for "${correctLetter}".`);
  }
  return shuffle([correctLetter, ...distractors]);
}

export function createSuperLetterChallengeQuestions(): SuperLetterChallengeQuestion[] {
  const vocabulary = getLevel5Vocabulary();
  const availableLetters = Array.from(new Set(vocabulary.map((question) => question.letter)));
  const allVocabularyOnce = shuffle(vocabulary);
  const extraQuestion = vocabulary[Math.floor(Math.random() * vocabulary.length)];
  const selectedQuestions = shuffle([...allVocabularyOnce, extraQuestion]);
  const questionTypes = shuffle(QUESTION_TYPE_MIX);

  return questionTypes.map((type, index) => {
    const question = selectedQuestions[index];
    const id = `level-5-${index + 1}-${type}-${question.id}`;

    if (type === 'letter-to-picture') {
      const distractors = shuffle(vocabulary.filter((candidate) => candidate.letter !== question.letter)).slice(0, 2);
      if (distractors.length !== 2) {
        throw new Error(`Level 5 could not find two picture distractors for "${question.id}".`);
      }
      return { id, type, question, choices: shuffle([question, ...distractors]) };
    }

    return { id, type, question, choices: makeLetterChoices(question.letter, availableLetters) };
  });
}