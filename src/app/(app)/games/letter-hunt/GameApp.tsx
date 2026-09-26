'use client';

import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/error-boundary';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';
import { Volume2, VolumeX, ArrowRight, RotateCcw, HelpCircle, Star, Sparkles, Check, LockKeyhole, ArrowLeft, Map } from 'lucide-react';
import NotFound from './pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { LETTERS, QUESTION_BANK, SOUND_NEIGHBORS, type Question } from './content/questions';
import {
  createSuperLetterChallengeQuestions,
  SUPER_LETTER_CHALLENGE_LENGTH,
  type SuperLetterChallengeQuestion,
} from './content/superLetterChallenge';
import {
  SuperLetterChallengeCompletionScreen,
  SuperLetterChallengeGameplayScreen,
  SuperLetterChallengeIntroScreen,
} from './components/SuperLetterChallengeScreens';
import { getKokoAudioPath, getQuestionAudioPath, useKokoAudio } from './audio/kokoAudio';

const queryClient = new QueryClient();

type Screen = 'welcome' | 'adventure-map' | 'how-to-play' | 'gameplay' | 'completion' | 'sound-safari-gameplay' | 'sound-safari-completion' | 'picture-hunt-intro' | 'picture-hunt-gameplay' | 'picture-hunt-completion' | 'sound-match-intro' | 'sound-match-gameplay' | 'sound-match-completion' | 'super-letter-challenge-intro' | 'super-letter-challenge-gameplay' | 'super-letter-challenge-completion';
const POSITIVE_FEEDBACK = [
  { text: 'Great job! 🎉', audioKey: 'greatJob' },
  { text: 'You got it! ⭐', audioKey: 'youGotIt' },
  { text: 'Amazing! 👏', audioKey: 'amazing' },
];
const LEVEL_5_POSITIVE_FEEDBACK = ['Great job! 🎉', 'You got it! ⭐', 'Amazing! 👏', 'Fantastic! 🌟'];
const PROGRESS_STORAGE_KEY = 'koko-learning-adventure-progress';
const LEVEL_2_PROGRESS_STORAGE_KEY = 'koko-learning-adventure-level-2-progress';
const LEVEL_3_PROGRESS_STORAGE_KEY = 'koko-learning-adventure-level-3-progress';
const LEVEL_4_PROGRESS_STORAGE_KEY = 'koko-learning-adventure-level-4-progress';
const LEVEL_5_PROGRESS_STORAGE_KEY = 'koko-learning-adventure-level-5-progress';
const SOUND_MATCH_SPEECH_RATE = 0.72;

type AdventureLevel = {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
};

type PictureHuntQuestionSet = {
  question: Question;
  choices: Question[];
};

type SoundMatchQuestionSet = {
  question: Question;
  choices: string[];
};

const ADVENTURE_LEVELS: AdventureLevel[] = [
  { id: 1, title: 'Letter Hunt', subtitle: 'Find the first letter', icon: '⭐' },
  { id: 2, title: 'Sound Safari', subtitle: 'Listen for the sounds', icon: '🦁' },
  { id: 3, title: 'Picture Hunt', subtitle: 'Match pictures and words', icon: '🖼️' },
  { id: 4, title: 'Sound Match', subtitle: 'Match sounds to letters', icon: '🎧' },
  { id: 5, title: 'Super Letter Challenge', subtitle: 'Show what you know', icon: '🏆' },
];

type CharacterName = 'koko' | 'ami';
type CharacterPose = 'front' | 'happy' | 'thinking' | 'correct' | 'celebrating';

const OFFICIAL_CHARACTER_ASSETS: Record<CharacterName, Record<CharacterPose, string>> = {
  koko: {
    front: `/assets/characters/koko/front.png`,
    happy: `/assets/characters/koko/happy.png`,
    thinking: `/assets/characters/koko/thinking.png`,
    correct: `/assets/characters/koko/correct.png`,
    celebrating: `/assets/characters/koko/celebrating.png`,
  },
  ami: {
    front: `/assets/characters/ami/front.png`,
    happy: `/assets/characters/ami/happy.png`,
    thinking: `/assets/characters/ami/thinking.png`,
    correct: `/assets/characters/ami/correct.png`,
    celebrating: `/assets/characters/ami/celebrating.png`,
  },
};

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function selectQuestions(): Question[] {
  return shuffle(QUESTION_BANK).slice(0, 8);
}

function selectPictureHuntQuestions(): PictureHuntQuestionSet[] {
  const pictureHuntQuestionPool = QUESTION_BANK.filter((candidate) => candidate.id !== 'agbado');
  return shuffle(pictureHuntQuestionPool).slice(0, 8).map((question) => {
    const distractors = shuffle(pictureHuntQuestionPool.filter((candidate) => candidate.letter !== question.letter)).slice(0, 2);
    return { question, choices: shuffle([question, ...distractors]) };
  });
}

function selectSoundMatchQuestions(): SoundMatchQuestionSet[] {
  const soundMatchQuestionPool = QUESTION_BANK.filter((candidate) => candidate.id !== 'agbado');
  return shuffle(soundMatchQuestionPool).slice(0, 8).map((question) => {
    const distractors = shuffle(LETTERS.filter((letter) => letter !== question.letter)).slice(0, 2);
    return { question, choices: shuffle([question.letter, ...distractors]) };
  });
}

function KokoMark({ small = false }: { small?: boolean }) {
  return (
    <div className={`koko-float relative flex shrink-0 items-center justify-center rounded-full bg-[#f4b942] shadow-[0_7px_0_#d68c31] ${small ? 'h-14 w-14' : 'h-40 w-40 sm:h-48 sm:w-48'}`} aria-label="Kòkò the friendly guide" data-testid="illustration-koko">
      <span className={`absolute -top-2 rounded-full bg-[#e98a71] ${small ? 'left-2 h-7 w-7' : 'left-5 h-16 w-16'}`} />
      <span className={`absolute -top-2 rounded-full bg-[#e98a71] ${small ? 'right-2 h-7 w-7' : 'right-5 h-16 w-16'}`} />
      <span className={`relative z-10 flex items-center justify-center rounded-full bg-[#f8cf68] ${small ? 'h-11 w-11' : 'h-32 w-32 sm:h-38 sm:w-38'}`}>
        <span className={`absolute rounded-full bg-[#173f46] ${small ? 'left-3 top-3 h-2 w-2' : 'left-8 top-9 h-4 w-4'}`} />
        <span className={`absolute rounded-full bg-[#173f46] ${small ? 'right-3 top-3 h-2 w-2' : 'right-8 top-9 h-4 w-4'}`} />
        <span className={`absolute rounded-full border-b-4 border-[#173f46] ${small ? 'bottom-2 h-3 w-5' : 'bottom-7 h-7 w-12'}`} />
        <span className={`absolute rounded-full bg-[#e98a71] ${small ? 'bottom-1 h-2 w-5' : 'bottom-5 h-4 w-10'}`} />
      </span>
    </div>
  );
}

function OfficialCharacterImage({ character, pose, className }: { character: CharacterName; pose: CharacterPose; className: string }) {
  const name = character === 'koko' ? 'Kòkò' : 'Àmì';
  const description = pose === 'thinking'
    ? 'is thinking about the question'
    : pose === 'correct'
      ? 'celebrates a correct answer'
      : pose === 'celebrating'
        ? 'celebrates completing the level'
        : pose === 'happy'
          ? 'greets you with a smile'
          : 'is here to help';
  return <img src={OFFICIAL_CHARACTER_ASSETS[character][pose]} alt={`${name} ${description}`} className={`block object-contain ${className}`} />;
}

function SoundToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="koko-button inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-[#b6d8d1] bg-[#fffdf5] px-4 py-2 text-sm font-bold text-[#173f46] shadow-[0_3px_0_#d7e9e3]"
      aria-pressed={enabled}
      aria-label={enabled ? 'Turn speech off' : 'Turn speech on'}
      data-testid="button-toggle-sound"
    >
      {enabled ? <Volume2 size={18} strokeWidth={2.5} /> : <VolumeX size={18} strokeWidth={2.5} />}
      <span className="hidden sm:inline">{enabled ? 'Sound on' : 'Sound off'}</span>
    </button>
  );
}

function ScreenFrame({ children, speechEnabled, onToggleSound }: { children: ReactNode; speechEnabled: boolean; onToggleSound: () => void }) {
  return (
    <main className="koko-app font-body min-h-[100dvh] text-[#173f46]">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col px-4 py-4 sm:px-8 sm:py-7">
        <header className="flex items-center justify-between">
          <button type="button" onClick={() => window.location.reload()} className="flex items-center gap-2 rounded-xl p-1 text-left" aria-label="Restart Letter Hunt" data-testid="button-brand-restart">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#173f46] font-display text-xl font-bold text-[#fff8df]">K</span>
            <span className="font-display text-lg font-semibold tracking-tight text-[#173f46]">Kòkò’s Learning Adventure</span>
          </button>
          <SoundToggle enabled={speechEnabled} onToggle={onToggleSound} />
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
        <footer className="pt-6 text-center text-xs font-semibold tracking-wide text-[#507277]">A little letter adventure, made for curious minds</footer>
      </div>
    </main>
  );
}

function WelcomeScreen({ onOpenAdventure, onHowToPlay }: { onOpenAdventure: () => void; onHowToPlay: () => void }) {
  return (
    <section className="koko-pop grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:py-14">
      <div className="order-2 text-center lg:order-1 lg:text-left">
         <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#dcefe9] px-4 py-2 text-sm font-bold text-[#24645c]"><Sparkles size={16} /> Kòkò’s Learning Adventure</p>
        <h1 className="font-display text-5xl font-bold leading-[.95] tracking-tight text-[#173f46] sm:text-7xl">Find the first<br /><span className="text-[#e77d64]">letter!</span></h1>
        <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-[#507277] sm:text-xl lg:mx-0">Help Kòkò match friendly objects to the letters that begin their names.</p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
           <button type="button" onClick={onOpenAdventure} className="koko-button inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#188878] px-7 text-lg font-bold text-[#fffdf5] shadow-[0_6px_0_#0f6259] sm:w-auto" data-testid="button-open-adventure">
             Explore adventure <ArrowRight size={23} strokeWidth={3} />
          </button>
          <button type="button" onClick={onHowToPlay} className="koko-button inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#b6d8d1] bg-[#fffdf5] px-6 text-base font-bold text-[#24645c] shadow-[0_4px_0_#d7e9e3] sm:w-auto" data-testid="button-how-to-play">
            <HelpCircle size={20} /> How to play
          </button>
        </div>
      </div>
      <div className="order-1 flex justify-center lg:order-2">
        <div className="relative">
          <span className="koko-sparkle absolute -left-5 top-8 text-3xl text-[#e77d64]">✦</span>
          <span className="koko-sparkle absolute -right-4 top-2 text-2xl text-[#188878]" style={{ animationDelay: '.3s' }}>✦</span>
          <div className="koko-card flex w-[min(88vw,31rem)] flex-col items-center rounded-[2.5rem] bg-[#fffdf5] px-7 pb-8 pt-10 sm:px-12">
            <div className="flex items-end justify-center gap-3">
              <OfficialCharacterImage character="koko" pose="happy" className="h-[89px] w-auto sm:h-[100px]" />
              <OfficialCharacterImage character="ami" pose="happy" className="h-[89px] w-auto sm:h-[100px]" />
            </div>
            <div className="mt-8 rounded-2xl bg-[#f7e6b4] px-5 py-3 text-center font-display text-xl font-semibold text-[#173f46]">
              “Ready to hunt for letters?”
            </div>
            <div className="mt-5 flex gap-4 text-4xl" aria-hidden="true"><span>🌽</span><span>🐱</span><span>🎈</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AdventureMapScreen({ level1Complete, level2Complete, level3Complete, level4Complete, level5Complete, onSelectLevel1, onSelectLevel2, onSelectLevel3, onSelectLevel4, onSelectLevel5, onBack }: { level1Complete: boolean; level2Complete: boolean; level3Complete: boolean; level4Complete: boolean; level5Complete: boolean; onSelectLevel1: () => void; onSelectLevel2: () => void; onSelectLevel3: () => void; onSelectLevel4: () => void; onSelectLevel5: () => void; onBack: () => void }) {
  return (
    <section className="koko-pop flex flex-1 items-center justify-center py-8 sm:py-12">
      <div className="koko-card w-full max-w-3xl rounded-[2rem] bg-[#fffdf5] px-5 py-7 sm:px-10 sm:py-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7e6b4] text-[#9b6b1a]"><Map size={29} strokeWidth={2.5} /></div>
          <p className="text-sm font-bold uppercase tracking-[.18em] text-[#e77d64]">Kòkò’s Learning Adventure</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-[#173f46] sm:text-5xl">Choose your adventure</h1>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-[#507277] sm:text-lg">Finish each level to discover what comes next.</p>
        </div>

        <div className="relative mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2">
          <div className="pointer-events-none absolute bottom-8 left-8 top-8 hidden w-1 rounded-full bg-[#dcefe9] sm:block" aria-hidden="true" />
          {ADVENTURE_LEVELS.map((level) => {
            const isLevel1 = level.id === 1;
            const isLevel2 = level.id === 2;
            const isLevel3 = level.id === 3;
            const isLevel4 = level.id === 4;
            const isLevel5 = level.id === 5;
            const isUnlocked = isLevel1 || (isLevel2 && level1Complete) || (isLevel3 && level2Complete) || (isLevel4 && level3Complete) || (isLevel5 && level4Complete);
            const isPlayable = isUnlocked;
            const isComplete = (isLevel1 && level1Complete) || (isLevel2 && level2Complete) || (isLevel3 && level3Complete) || (isLevel4 && level4Complete) || (isLevel5 && level5Complete);
            const cardClass = isUnlocked
              ? 'border-[#b6d8d1] bg-[#f1faf5] hover:border-[#188878] hover:bg-[#dcefe9]'
              : 'cursor-not-allowed border-[#e7ded0] bg-[#faf5e9] opacity-80';
            const cardContent = (
              <>
                <span className={`relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-3xl shadow-sm ${isUnlocked ? 'bg-[#fffdf5]' : 'bg-[#eee5d5]'}`}>{isComplete ? '✅' : isUnlocked ? level.icon : <LockKeyhole size={24} className="text-[#9d8f7b]" />}</span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="flex flex-wrap items-center gap-2 font-display text-xl font-bold text-[#173f46]">
                    <span>Level {level.id} · {level.title}</span>
                    {isComplete && <span className="rounded-full bg-[#f7e6b4] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#9b6b1a]">Complete</span>}
                    {isLevel2 && level1Complete && <span className="rounded-full bg-[#dcefe9] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#12685d]">Next</span>}
                    {isLevel3 && level2Complete && !level3Complete && <span className="rounded-full bg-[#dcefe9] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#12685d]">Next</span>}
                    {isLevel4 && level3Complete && !level4Complete && <span className="rounded-full bg-[#dcefe9] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#12685d]">Next</span>}
                    {isLevel5 && level4Complete && !level5Complete && <span className="rounded-full bg-[#dcefe9] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#12685d]">Next</span>}
                  </span>
                  <span className="mt-1 block text-sm font-medium text-[#507277]">{isLevel5 && level4Complete ? level5Complete ? 'Final challenge complete · Play again anytime' : 'Final mixed review · 10 questions' : isUnlocked ? level.subtitle : 'Complete the earlier levels first'}</span>
                </span>
                {isPlayable && <ArrowRight className="shrink-0 text-[#188878]" size={22} strokeWidth={3} />}
              </>
            );

            if (isLevel1) {
              return <button type="button" key={level.id} onClick={onSelectLevel1} className={`koko-button relative z-10 flex min-h-24 items-center gap-4 rounded-2xl border-2 p-4 text-left shadow-[0_4px_0_#d7e9e3] sm:col-span-2 sm:p-5 ${cardClass}`} data-testid="button-level-1">{cardContent}</button>;
            }
            if (isLevel2 && isUnlocked) {
              return <button type="button" key={level.id} onClick={onSelectLevel2} className={`koko-button relative z-10 flex min-h-24 items-center gap-4 rounded-2xl border-2 p-4 text-left shadow-[0_4px_0_#d7e9e3] sm:col-span-2 sm:p-5 ${cardClass}`} data-testid="button-level-2">{cardContent}</button>;
            }
            if (isLevel3 && isUnlocked) {
              return <button type="button" key={level.id} onClick={onSelectLevel3} className={`koko-button relative z-10 flex min-h-24 items-center gap-4 rounded-2xl border-2 p-4 text-left shadow-[0_4px_0_#d7e9e3] sm:col-span-2 sm:p-5 ${cardClass}`} data-testid="button-level-3">{cardContent}</button>;
            }
            if (isLevel4 && isUnlocked) {
              return <button type="button" key={level.id} onClick={onSelectLevel4} aria-label="Open Level 4 Sound Match" className={`koko-button relative z-10 flex min-h-24 items-center gap-4 rounded-2xl border-2 p-4 text-left shadow-[0_4px_0_#d7e9e3] sm:col-span-2 sm:p-5 ${cardClass}`} data-testid="button-level-4">{cardContent}</button>;
            }
            if (isLevel5 && isUnlocked) {
              return <button type="button" key={level.id} onClick={onSelectLevel5} aria-label="Open Level 5 Super Letter Challenge" className={`koko-button relative z-10 flex min-h-24 items-center gap-4 rounded-2xl border-2 p-4 text-left shadow-[0_4px_0_#d7e9e3] sm:col-span-2 sm:p-5 ${cardClass}`} data-testid="button-level-5">{cardContent}</button>;
            }
            return <button type="button" key={level.id} disabled className={`relative z-10 flex min-h-24 items-center gap-4 rounded-2xl border-2 p-4 text-left shadow-[0_4px_0_#e7ded0] sm:col-span-2 sm:p-5 ${cardClass}`} data-testid={`button-level-${level.id}`}>{cardContent}</button>;
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button type="button" onClick={onBack} className="koko-button inline-flex min-h-12 items-center gap-2 rounded-2xl border-2 border-[#b6d8d1] bg-[#fffdf5] px-6 font-bold text-[#24645c] shadow-[0_4px_0_#d7e9e3]" data-testid="button-back-welcome"><ArrowLeft size={19} /> Back</button>
        </div>
      </div>
    </section>
  );
}

function HowToPlayScreen({ onBegin, onBack }: { onBegin: () => void; onBack: () => void }) {
  return (
    <section className="koko-pop flex flex-1 items-center justify-center py-10">
      <div className="koko-card w-full max-w-2xl rounded-[2rem] bg-[#fffdf5] px-6 py-8 sm:px-12 sm:py-11">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex items-center gap-4"><KokoMark small /><div className="text-left"><p className="text-sm font-bold uppercase tracking-[.15em] text-[#e77d64]">Kòkò says</p><h1 className="font-display text-4xl font-bold">Let’s play!</h1></div></div>
          <p className="max-w-lg text-lg leading-relaxed text-[#507277]">Look at the object, say its name, and tap the letter that starts the word.</p>
        </div>
        <div className="my-8 grid gap-4 sm:grid-cols-3">
          <Instruction number="1" title="Look" text="See the object." icon="👀" color="bg-[#dcefe9]" />
          <Instruction number="2" title="Say it" text="Say its name." icon="🗣️" color="bg-[#f7e6b4]" />
          <Instruction number="3" title="Tap" text="Pick the first letter." icon="👆" color="bg-[#f8dcd4]" />
        </div>
        <div className="rounded-2xl border-2 border-dashed border-[#b6d8d1] bg-[#f1faf5] p-5 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#507277]">For example</p>
          <div className="mt-2 flex items-center justify-center gap-3 font-display text-2xl font-bold"><span className="text-4xl">🍌</span> Banana <span className="text-[#e77d64]">starts with B</span>!</div>
        </div>
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={onBack} className="koko-button min-h-14 rounded-2xl border-2 border-[#b6d8d1] bg-[#fffdf5] px-7 font-bold text-[#24645c] shadow-[0_4px_0_#d7e9e3]" data-testid="button-back-welcome">Back</button>
          <button type="button" onClick={onBegin} className="koko-button inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#188878] px-8 text-lg font-bold text-[#fffdf5] shadow-[0_6px_0_#0f6259]" data-testid="button-begin-hunt">Begin the hunt <ArrowRight size={23} strokeWidth={3} /></button>
        </div>
      </div>
    </section>
  );
}

function Instruction({ number, title, text, icon, color }: { number: string; title: string; text: string; icon: string; color: string }) {
  return (
    <div className={`rounded-2xl ${color} p-5 text-center`}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fffdf5] text-2xl font-bold shadow-sm">{icon}</div>
      <p className="mt-3 font-display text-xl font-bold"><span className="mr-1 text-[#e77d64]">{number}.</span>{title}</p>
      <p className="mt-1 text-sm font-medium text-[#507277]">{text}</p>
    </div>
  );
}

function GameplayScreen({ question, round, score, choices, feedback, selectedAnswer, onAnswer, onNext }: { question: Question; round: number; score: number; choices: string[]; feedback: string | null; selectedAnswer: string | null; onAnswer: (answer: string) => void; onNext: () => void }) {
  const isCorrect = selectedAnswer === question.letter;
  const prompt = round >= 7 ? 'Which letter makes the first sound?' : 'What letter does it start with?';
  return (
    <section className="koko-pop mx-auto flex w-full max-w-3xl flex-1 flex-col py-7 sm:py-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-end justify-between text-sm font-bold text-[#507277]"><span>Round {round} of 8</span><span data-testid="text-score">Score: {score}</span></div>
          <div className="h-4 overflow-hidden rounded-full bg-[#dcefe9]" role="progressbar" aria-valuenow={round} aria-valuemin={0} aria-valuemax={8} aria-label={`Round ${round} of 8`}><div className="h-full rounded-full bg-[#f4b942] transition-all duration-500" style={{ width: `${(round / 8) * 100}%` }} /></div>
        </div>
        <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-[#f7e6b4] font-display text-xl font-bold text-[#9b6b1a] sm:flex" aria-label={`${score} points`}>{score}<span className="ml-1 text-sm">★</span></div>
      </div>
      <div className="koko-card mt-8 flex flex-1 flex-col items-center rounded-[2rem] bg-[#fffdf5] px-5 py-7 sm:mt-10 sm:px-12 sm:py-10">
        <div className="mb-2 flex items-center gap-3 text-sm font-bold uppercase tracking-[.16em] text-[#188878]"><span className="h-2 w-2 rounded-full bg-[#e77d64]" /> Find the first letter <span className="h-2 w-2 rounded-full bg-[#e77d64]" /></div>
          <div className="mt-3 flex items-center justify-center gap-1 sm:gap-3">
            <div className="flex h-12 w-11 shrink-0 items-center justify-center sm:h-16 sm:w-12">
              <OfficialCharacterImage character="koko" pose={isCorrect ? 'correct' : 'thinking'} className="max-h-full max-w-full" />
            </div>
            <div className="koko-pop flex h-36 w-36 shrink-0 items-center justify-center rounded-[2rem] bg-[#f7e6b4] text-8xl shadow-[inset_0_-7px_0_#edcf83]" key={question.id} data-testid={`object-image-${question.id}`}>{question.image}</div>
            <div className="flex h-12 w-8 shrink-0 items-center justify-center sm:h-16 sm:w-11">
              <OfficialCharacterImage character="ami" pose={isCorrect ? 'correct' : 'thinking'} className="max-h-full max-w-full" />
            </div>
          </div>
         <h1 className="mt-5 font-display text-4xl font-bold text-[#173f46] sm:text-5xl">Listen carefully!</h1>
         <p className="mt-3 text-center text-lg font-medium text-[#507277]">{prompt}</p>
        <div className="mt-7 grid w-full max-w-lg grid-cols-3 gap-3 sm:gap-5" role="group" aria-label="Letter choices">
          {choices.map((choice) => {
            const isSelected = selectedAnswer === choice;
            const choiceClass = isSelected && choice === question.letter
              ? 'border-[#188878] bg-[#dcefe9] text-[#12685d] shadow-[0_5px_0_#a6cdc3]'
              : isSelected
                ? 'border-[#e77d64] bg-[#f8dcd4] text-[#aa4d3a] shadow-[0_5px_0_#eab9ad]'
                : 'border-[#b6d8d1] bg-[#fffdf5] text-[#173f46] shadow-[0_5px_0_#d7e9e3] hover:border-[#188878] hover:bg-[#f1faf5]';
            return <button type="button" key={choice} onClick={() => onAnswer(choice)} disabled={isCorrect} className={`koko-button min-h-20 rounded-2xl border-2 text-4xl font-bold sm:min-h-24 sm:text-5xl ${choiceClass} ${isSelected && choice !== question.letter ? 'koko-shake' : ''}`} aria-label={`Choose letter ${choice}`} data-testid={`button-letter-${choice}`}>{choice}{isSelected && choice === question.letter ? <Check className="ml-1 inline-block" size={24} strokeWidth={4} /> : null}</button>;
          })}
        </div>
        <div className="mt-6 min-h-16 text-center" aria-live="polite" data-testid="status-feedback">
          {feedback && <div className={`koko-pop rounded-2xl px-5 py-3 font-display text-2xl font-bold ${isCorrect ? 'bg-[#dcefe9] text-[#12685d]' : 'bg-[#f8dcd4] text-[#aa4d3a]'}`}>{feedback}</div>}
        </div>
        {isCorrect && <button type="button" onClick={onNext} className="koko-button mt-1 inline-flex min-h-14 items-center gap-3 rounded-2xl bg-[#e77d64] px-8 text-lg font-bold text-[#fffdf5] shadow-[0_6px_0_#b95b49]" data-testid="button-next-round">{round === 8 ? 'See my stars' : 'Next object'} <ArrowRight size={22} strokeWidth={3} /></button>}
      </div>
    </section>
  );
}

function SoundSafariGameplayScreen({ round, score, choices, feedback, selectedAnswer, onAnswer, onNext, onListenAgain, question }: { round: number; score: number; choices: string[]; feedback: string | null; selectedAnswer: string | null; onAnswer: (answer: string) => void; onNext: () => void; onListenAgain: () => void; question: Question }) {
  const isCorrect = selectedAnswer === question.letter;
  return (
    <section className="koko-pop mx-auto flex w-full max-w-3xl flex-1 flex-col py-7 sm:py-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-end justify-between text-sm font-bold text-[#507277]"><span>Round {round} of 8</span><span data-testid="text-sound-safari-score">Score: {score}</span></div>
          <div className="h-4 overflow-hidden rounded-full bg-[#dcefe9]" role="progressbar" aria-valuenow={round} aria-valuemin={0} aria-valuemax={8} aria-label={`Sound Safari round ${round} of 8`}><div className="h-full rounded-full bg-[#f4b942] transition-all duration-500" style={{ width: `${(round / 8) * 100}%` }} /></div>
        </div>
        <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-[#f7e6b4] font-display text-xl font-bold text-[#9b6b1a] sm:flex" aria-label={`${score} points`}>{score}<span className="ml-1 text-sm">★</span></div>
      </div>
      <div className="koko-card mt-8 flex flex-1 flex-col items-center rounded-[2rem] bg-[#fffdf5] px-5 py-7 sm:mt-10 sm:px-12 sm:py-10">
        <div className="mb-2 flex items-center gap-3 text-sm font-bold uppercase tracking-[.16em] text-[#188878]"><span className="h-2 w-2 rounded-full bg-[#e77d64]" /> Sound Safari <span className="h-2 w-2 rounded-full bg-[#e77d64]" /></div>
        <div className="mt-5 flex items-center justify-center gap-3">
          <div className="koko-pop flex h-36 w-36 shrink-0 items-center justify-center rounded-[2rem] bg-[#dcefe9] shadow-[inset_0_-7px_0_#a6cdc3]" aria-label="Listen to Kòkò's spoken word"><Volume2 size={76} strokeWidth={1.7} className="text-[#188878]" /></div>
          <div className="flex h-16 w-12 shrink-0 items-center justify-center sm:h-20 sm:w-16">
            <OfficialCharacterImage character="ami" pose={isCorrect ? 'correct' : 'thinking'} className="max-h-full max-w-full" />
          </div>
        </div>
        <h1 className="mt-5 font-display text-4xl font-bold text-[#173f46] sm:text-5xl">Listen carefully!</h1>
        <p className="mt-3 text-center text-lg font-medium text-[#507277]">Listen to Kòkò, then choose the first letter.</p>
        <button type="button" onClick={onListenAgain} className="koko-button mt-5 inline-flex min-h-12 items-center gap-2 rounded-2xl border-2 border-[#b6d8d1] bg-[#f1faf5] px-6 font-bold text-[#12685d] shadow-[0_4px_0_#d7e9e3]" data-testid="button-listen-again"><Volume2 size={20} /> Listen Again</button>
        <div className="mt-7 grid w-full max-w-lg grid-cols-3 gap-3 sm:gap-5" role="group" aria-label="Sound Safari letter choices">
          {choices.map((choice) => {
            const isSelected = selectedAnswer === choice;
            const choiceClass = isSelected && choice === question.letter
              ? 'border-[#188878] bg-[#dcefe9] text-[#12685d] shadow-[0_5px_0_#a6cdc3]'
              : isSelected
                ? 'border-[#e77d64] bg-[#f8dcd4] text-[#aa4d3a] shadow-[0_5px_0_#eab9ad]'
                : 'border-[#b6d8d1] bg-[#fffdf5] text-[#173f46] shadow-[0_5px_0_#d7e9e3] hover:border-[#188878] hover:bg-[#f1faf5]';
            return <button type="button" key={choice} onClick={() => onAnswer(choice)} disabled={isCorrect} className={`koko-button min-h-20 rounded-2xl border-2 text-4xl font-bold sm:min-h-24 sm:text-5xl ${choiceClass} ${isSelected && choice !== question.letter ? 'koko-shake' : ''}`} aria-label={`Choose letter ${choice}`} data-testid={`button-sound-safari-letter-${choice}`}>{choice}{isSelected && choice === question.letter ? <Check className="ml-1 inline-block" size={24} strokeWidth={4} /> : null}</button>;
          })}
        </div>
        <div className="mt-6 min-h-16 text-center" aria-live="polite" data-testid="sound-safari-feedback">
          {feedback && <div className={`koko-pop rounded-2xl px-5 py-3 font-display text-2xl font-bold ${isCorrect ? 'bg-[#dcefe9] text-[#12685d]' : 'bg-[#f8dcd4] text-[#aa4d3a]'}`}>{feedback}</div>}
        </div>
        {isCorrect && <button type="button" onClick={onNext} className="koko-button mt-1 inline-flex min-h-14 items-center gap-3 rounded-2xl bg-[#e77d64] px-8 text-lg font-bold text-[#fffdf5] shadow-[0_6px_0_#b95b49]" data-testid="button-sound-safari-next">{round === 8 ? 'See my stars' : 'Next sound'} <ArrowRight size={22} strokeWidth={3} /></button>}
      </div>
    </section>
  );
}

function CompletionScreen({ score, onPlayAgain, onBackToAdventure, onNextLevel }: { score: number; onPlayAgain: () => void; onBackToAdventure: () => void; onNextLevel?: () => void }) {
  const stars = score >= 7 ? 3 : score >= 4 ? 2 : 1;
  const message = score === 8 ? 'Letter legend!' : score >= 6 ? 'You are a letter star!' : 'Every try helps you grow!';
  return (
    <section className="koko-pop flex flex-1 items-center justify-center py-8 sm:py-12">
      <div className="koko-card relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-[#fffdf5] px-6 py-9 text-center sm:px-12 sm:py-12">
        <span className="koko-sparkle absolute left-8 top-8 text-3xl text-[#f4b942]">✦</span><span className="koko-sparkle absolute right-8 top-14 text-2xl text-[#e77d64]" style={{ animationDelay: '.25s' }}>✦</span>
        <OfficialCharacterImage character="koko" pose="celebrating" className="mx-auto h-[82px] w-[111px] sm:h-[108px] sm:w-[146px]" />
          <p className="mt-5 text-sm font-bold uppercase tracking-[.18em] text-[#e77d64]">Level 1 · Letter Hunt</p>
         <h1 className="mt-2 font-display text-5xl font-bold text-[#173f46] sm:text-6xl" data-testid="text-completion-title">Level 1 Complete!</h1>
         <p className="mt-2 font-display text-2xl font-bold text-[#188878]">{message}</p>
        <div className="my-6 flex justify-center gap-1" aria-label={`${stars} out of 3 stars`} data-testid="text-stars">{[1, 2, 3].map((star) => <Star key={star} size={48} fill={star <= stars ? '#f4b942' : '#e7ded0'} color={star <= stars ? '#d68c31' : '#d4c9b7'} strokeWidth={1.5} className={star <= stars ? 'koko-pop' : ''} style={{ animationDelay: `${star * .08}s` }} />)}</div>
        <div className="mx-auto max-w-sm rounded-2xl bg-[#dcefe9] px-6 py-5"><p className="font-display text-3xl font-bold text-[#12685d]" data-testid="text-final-score">{score} / 8</p><p className="mt-1 font-medium text-[#507277]">letters found</p></div>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-[#507277]">You practiced listening, looking, and matching today. Give yourself a big high-five!</p>
         <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
           <button type="button" onClick={onPlayAgain} className="koko-button inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#188878] px-8 text-lg font-bold text-[#fffdf5] shadow-[0_6px_0_#0f6259]" data-testid="button-play-again"><RotateCcw size={21} strokeWidth={3} /> Play again</button>
            {onNextLevel && <button type="button" onClick={onNextLevel} className="koko-button inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#e77d64] px-7 text-lg font-bold text-[#fffdf5] shadow-[0_6px_0_#b95b49]" data-testid="button-next-level">Next Level <span aria-hidden="true">→</span></button>}
           <button type="button" onClick={onBackToAdventure} className="koko-button inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-[#b6d8d1] bg-[#fffdf5] px-7 font-bold text-[#24645c] shadow-[0_4px_0_#d7e9e3]" data-testid="button-back-to-adventure"><Map size={20} /> Back to Adventure</button>
         </div>
      </div>
    </section>
  );
}

function SoundSafariCompletionScreen({ score, onReplay, onBackToAdventure, onNextLevel }: { score: number; onReplay: () => void; onBackToAdventure: () => void; onNextLevel: () => void }) {
  const stars = score >= 7 ? 3 : score >= 4 ? 2 : 1;
  const message = score === 8 ? 'Sound safari expert!' : score >= 6 ? 'You are a listening star!' : 'Every listen helps you grow!';
  return (
    <section className="koko-pop flex flex-1 items-center justify-center py-8 sm:py-12">
      <div className="koko-card relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-[#fffdf5] px-6 py-9 text-center sm:px-12 sm:py-12">
        <span className="koko-sparkle absolute left-8 top-8 text-3xl text-[#f4b942]">✦</span><span className="koko-sparkle absolute right-8 top-14 text-2xl text-[#e77d64]" style={{ animationDelay: '.25s' }}>✦</span>
        <OfficialCharacterImage character="koko" pose="happy" className="mx-auto h-20 w-auto" />
        <p className="mt-5 text-sm font-bold uppercase tracking-[.18em] text-[#e77d64]">Level 2 · Sound Safari</p>
        <h1 className="mt-2 font-display text-5xl font-bold text-[#173f46] sm:text-6xl" data-testid="text-sound-safari-completion-title">Sound Safari Complete!</h1>
        <p className="mt-2 font-display text-2xl font-bold text-[#188878]">{message}</p>
        <div className="my-6 flex justify-center gap-1" aria-label={`${stars} out of 3 stars`} data-testid="text-sound-safari-stars">{[1, 2, 3].map((star) => <Star key={star} size={48} fill={star <= stars ? '#f4b942' : '#e7ded0'} color={star <= stars ? '#d68c31' : '#d4c9b7'} strokeWidth={1.5} className={star <= stars ? 'koko-pop' : ''} style={{ animationDelay: `${star * .08}s` }} />)}</div>
        <div className="mx-auto max-w-sm rounded-2xl bg-[#dcefe9] px-6 py-5"><p className="font-display text-3xl font-bold text-[#12685d]" data-testid="text-sound-safari-final-score">{score} / 8</p><p className="mt-1 font-medium text-[#507277]">sounds matched</p></div>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-[#507277]">You listened closely and found the first sounds. Give yourself a big high-five!</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={onReplay} className="koko-button inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#188878] px-7 text-lg font-bold text-[#fffdf5] shadow-[0_6px_0_#0f6259]" data-testid="button-replay-sound-safari"><RotateCcw size={21} strokeWidth={3} /> Replay Level</button>
          <button type="button" onClick={onNextLevel} className="koko-button inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#e77d64] px-7 text-lg font-bold text-[#fffdf5] shadow-[0_6px_0_#b95b49]" data-testid="button-next-level-sound-safari">Next Level <span aria-hidden="true">→</span></button>
          <button type="button" onClick={onBackToAdventure} className="koko-button inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-[#b6d8d1] bg-[#fffdf5] px-6 font-bold text-[#24645c] shadow-[0_4px_0_#d7e9e3]" data-testid="button-back-to-adventure-sound-safari"><Map size={20} /> Back to Adventure</button>
        </div>
      </div>
    </section>
  );
}

function PictureHuntIntroScreen({ onStart, onBackToAdventure }: { onStart: () => void; onBackToAdventure: () => void }) {
  return (
    <section className="koko-pop flex flex-1 items-center justify-center py-8 sm:py-12">
      <div className="koko-card relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-[#fffdf5] px-6 py-10 text-center sm:px-12 sm:py-12">
        <span className="koko-sparkle absolute left-8 top-8 text-3xl text-[#f4b942]">✦</span>
        <span className="koko-sparkle absolute right-8 top-14 text-2xl text-[#e77d64]" style={{ animationDelay: '.25s' }}>✦</span>
        <OfficialCharacterImage character="koko" pose="happy" className="mx-auto h-[92px] w-auto sm:h-[108px]" />
        <p className="mt-5 text-sm font-bold uppercase tracking-[.18em] text-[#e77d64]">Level 3 · Picture Hunt</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-[#173f46] sm:text-5xl">Picture Hunt</h1>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-[#507277]">Kòkò needs your help! Find the picture that starts with the letter.</p>
        <div className="mt-8 flex flex-col-reverse justify-center gap-3 sm:flex-row">
          <button type="button" onClick={onBackToAdventure} className="koko-button inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-[#b6d8d1] bg-[#fffdf5] px-7 font-bold text-[#24645c] shadow-[0_4px_0_#d7e9e3]" data-testid="button-picture-hunt-back"><Map size={20} /> Back to Adventure</button>
          <button type="button" onClick={onStart} className="koko-button inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#188878] px-8 text-lg font-bold text-[#fffdf5] shadow-[0_6px_0_#0f6259]" data-testid="button-start-picture-hunt">Start the hunt <ArrowRight size={23} strokeWidth={3} /></button>
        </div>
      </div>
    </section>
  );
}

function PictureHuntGameplayScreen({ question, round, score, selectedAnswer, feedback, onAnswer }: { question: PictureHuntQuestionSet; round: number; score: number; selectedAnswer: string | null; feedback: string | null; onAnswer: (answer: string) => void }) {
  const targetQuestion = question.question;
  const isCorrect = selectedAnswer === targetQuestion.id;
  return (
    <section className="koko-pop mx-auto flex w-full max-w-3xl flex-1 flex-col py-7 sm:py-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-end justify-between text-sm font-bold text-[#507277]"><span data-testid="text-picture-hunt-round">Question {round} of 8</span><span data-testid="text-picture-hunt-score">Score: {score}</span></div>
          <div className="h-4 overflow-hidden rounded-full bg-[#dcefe9]" role="progressbar" aria-valuenow={round} aria-valuemin={0} aria-valuemax={8} aria-label={`Question ${round} of 8`}><div className="h-full rounded-full bg-[#f4b942] transition-all duration-500" style={{ width: `${(round / 8) * 100}%` }} /></div>
        </div>
        <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-[#f7e6b4] font-display text-xl font-bold text-[#9b6b1a] sm:flex" aria-label={`${score} points`}>{score}<span className="ml-1 text-sm">★</span></div>
      </div>
      <div className="koko-card mt-8 flex flex-1 flex-col items-center rounded-[2rem] bg-[#fffdf5] px-4 py-7 sm:mt-10 sm:px-12 sm:py-10">
        <div className="mb-2 flex items-center gap-3 text-sm font-bold uppercase tracking-[.16em] text-[#188878]"><span className="h-2 w-2 rounded-full bg-[#e77d64]" /> Picture Hunt <span className="h-2 w-2 rounded-full bg-[#e77d64]" /></div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <OfficialCharacterImage character="koko" pose={isCorrect ? 'correct' : 'thinking'} className="h-12 w-auto sm:h-14" />
          <p className="text-center text-base font-semibold text-[#507277] sm:text-lg">Which picture starts with this letter?</p>
        </div>
        <div className="mt-5 grid h-28 w-28 place-items-center rounded-[1.75rem] bg-[#f7e6b4] font-display text-7xl font-bold text-[#173f46] shadow-[inset_0_-7px_0_#edcf83] sm:h-32 sm:w-32 sm:text-8xl" role="img" aria-label={`Target letter ${targetQuestion.letter}`} data-testid="picture-hunt-target-letter">{targetQuestion.letter}</div>
        <div className="mt-7 grid w-full max-w-lg grid-cols-3 gap-2 sm:gap-4" role="group" aria-label="Picture choices">
          {question.choices.map((choice, index) => {
            const isSelected = selectedAnswer === choice.id;
            const choiceClass = isSelected && choice.id === targetQuestion.id
              ? 'border-[#188878] bg-[#dcefe9] text-[#12685d] shadow-[0_5px_0_#a6cdc3]'
              : isSelected
                ? 'border-[#e77d64] bg-[#f8dcd4] text-[#aa4d3a] shadow-[0_5px_0_#eab9ad]'
                : 'border-[#b6d8d1] bg-[#fffdf5] text-[#173f46] shadow-[0_5px_0_#d7e9e3] hover:border-[#188878] hover:bg-[#f1faf5]';
            return (
              <button
                type="button"
                key={choice.id}
                onClick={() => onAnswer(choice.id)}
                disabled={isCorrect}
                aria-label={`Picture of ${choice.word}`}
                aria-pressed={isSelected}
                className={`koko-button flex min-h-28 items-center justify-center rounded-2xl border-2 px-2 text-5xl sm:min-h-36 sm:text-6xl ${choiceClass}`}
                data-testid={`button-picture-hunt-choice-${choice.id}`}
              >
                <span aria-hidden="true">{choice.image}</span>
                <span className="sr-only">Picture choice {index + 1}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-6 min-h-14 text-center" aria-live="polite" data-testid="picture-hunt-feedback">
          {feedback && <div className={`koko-pop rounded-2xl px-5 py-3 font-display text-2xl font-bold ${isCorrect ? 'bg-[#dcefe9] text-[#12685d]' : 'bg-[#f8dcd4] text-[#aa4d3a]'}`}>{feedback}</div>}
        </div>
      </div>
    </section>
  );
}

function PictureHuntCompletionScreen({ score, onPlayAgain, onBackToAdventure, onNextLevel }: { score: number; onPlayAgain: () => void; onBackToAdventure: () => void; onNextLevel: () => void }) {
  const stars = score >= 7 ? 3 : score >= 4 ? 2 : 1;
  const message = score === 8 ? 'Picture Hunt expert!' : score >= 6 ? 'You are a picture star!' : 'Every try helps you grow!';
  return (
    <section className="koko-pop flex flex-1 items-center justify-center py-8 sm:py-12">
      <div className="koko-card relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-[#fffdf5] px-6 py-9 text-center sm:px-12 sm:py-12">
        <span className="koko-sparkle absolute left-8 top-8 text-3xl text-[#f4b942]">✦</span><span className="koko-sparkle absolute right-8 top-14 text-2xl text-[#e77d64]" style={{ animationDelay: '.25s' }}>✦</span>
        <OfficialCharacterImage character="koko" pose="celebrating" className="mx-auto h-[82px] w-[111px] sm:h-[108px] sm:w-[146px]" />
        <p className="mt-5 text-sm font-bold uppercase tracking-[.18em] text-[#e77d64]">Level 3 · Picture Hunt</p>
        <h1 className="mt-2 font-display text-5xl font-bold text-[#173f46] sm:text-6xl" data-testid="text-picture-hunt-completion-title">Level 3 Complete!</h1>
        <p className="mt-2 font-display text-2xl font-bold text-[#188878]">{message}</p>
        <div className="my-6 flex justify-center gap-1" aria-label={`${stars} out of 3 stars`} data-testid="text-picture-hunt-stars">{[1, 2, 3].map((star) => <Star key={star} size={48} fill={star <= stars ? '#f4b942' : '#e7ded0'} color={star <= stars ? '#d68c31' : '#d4c9b7'} strokeWidth={1.5} className={star <= stars ? 'koko-pop' : ''} style={{ animationDelay: `${star * .08}s` }} />)}</div>
        <div className="mx-auto max-w-sm rounded-2xl bg-[#dcefe9] px-6 py-5"><p className="font-display text-3xl font-bold text-[#12685d]" data-testid="text-picture-hunt-final-score">{score} / 8</p><p className="mt-1 font-medium text-[#507277]">pictures matched</p></div>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-[#507277]">You matched letters to pictures. Give yourself a big high-five!</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={onPlayAgain} className="koko-button inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#188878] px-8 text-lg font-bold text-[#fffdf5] shadow-[0_6px_0_#0f6259]" data-testid="button-replay-picture-hunt"><RotateCcw size={21} strokeWidth={3} /> Play Again</button>
          <button type="button" onClick={onNextLevel} className="koko-button inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#e77d64] px-7 text-lg font-bold text-[#fffdf5] shadow-[0_6px_0_#b95b49]" data-testid="button-next-level-picture-hunt">Next Level <span aria-hidden="true">→</span></button>
          <button type="button" onClick={onBackToAdventure} className="koko-button inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-[#b6d8d1] bg-[#fffdf5] px-7 font-bold text-[#24645c] shadow-[0_4px_0_#d7e9e3]" data-testid="button-back-to-adventure-picture-hunt"><Map size={20} /> Back to Adventure</button>
        </div>
      </div>
    </section>
  );
}

function SoundMatchIntroScreen({ onStart, onBackToAdventure }: { onStart: () => void; onBackToAdventure: () => void }) {
  return (
    <section className="koko-pop flex flex-1 items-center justify-center py-8 sm:py-12">
      <div className="koko-card relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-[#fffdf5] px-5 py-9 text-center sm:px-12 sm:py-12">
        <span className="koko-sparkle absolute left-6 top-6 text-2xl text-[#f4b942] sm:left-8 sm:top-8 sm:text-3xl">✦</span>
        <span className="koko-sparkle absolute right-6 top-10 text-2xl text-[#e77d64] sm:right-8 sm:top-14 sm:text-3xl" style={{ animationDelay: '.25s' }}>✦</span>
        <OfficialCharacterImage character="koko" pose="happy" className="mx-auto h-[92px] w-auto sm:h-[108px]" />
        <p className="mt-5 text-sm font-bold uppercase tracking-[.18em] text-[#e77d64]">Level 4 · Sound Match</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-[#173f46] sm:text-5xl">Sound Match</h1>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-[#507277]">Listen carefully and find the letter that matches the beginning sound!</p>
        <div className="mt-8 flex flex-col-reverse justify-center gap-3 sm:flex-row">
          <button type="button" onClick={onBackToAdventure} className="koko-button inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-[#b6d8d1] bg-[#fffdf5] px-6 font-bold text-[#24645c] shadow-[0_4px_0_#d7e9e3]" data-testid="button-sound-match-back"><Map size={20} /> Back to Adventure</button>
          <button type="button" onClick={onStart} className="koko-button inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#188878] px-8 text-lg font-bold text-[#fffdf5] shadow-[0_6px_0_#0f6259]" data-testid="button-start-sound-match">Start <ArrowRight size={23} strokeWidth={3} /></button>
        </div>
      </div>
    </section>
  );
}

function SoundMatchGameplayScreen({ question, round, score, selectedAnswer, feedback, onAnswer, onNext, onListenAgain }: { question: SoundMatchQuestionSet; round: number; score: number; selectedAnswer: string | null; feedback: string | null; onAnswer: (answer: string) => void; onNext: () => void; onListenAgain: () => void }) {
  const targetLetter = question.question.letter;
  const isCorrect = selectedAnswer === targetLetter;
  const characterPose: CharacterPose = isCorrect ? 'correct' : feedback ? 'happy' : 'thinking';
  return (
    <section className="koko-pop mx-auto flex w-full max-w-3xl flex-1 flex-col py-6 sm:py-10">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-end justify-between gap-3 text-sm font-bold text-[#507277]">
            <span data-testid="text-sound-match-round">Question {round} of 8</span>
            <span data-testid="text-sound-match-score">Score: {score}</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-[#dcefe9]" role="progressbar" aria-valuenow={round} aria-valuemin={0} aria-valuemax={8} aria-label={`Question ${round} of 8`}>
            <div className="h-full rounded-full bg-[#f4b942] transition-all duration-500" style={{ width: `${(round / 8) * 100}%` }} />
          </div>
        </div>
        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f7e6b4] font-display text-xl font-bold text-[#9b6b1a] sm:flex" aria-label={`${score} points`}>{score}<span className="ml-1 text-sm">★</span></div>
      </div>

      <div className="koko-card mt-6 flex flex-1 flex-col items-center rounded-[2rem] bg-[#fffdf5] px-4 py-6 sm:mt-9 sm:px-12 sm:py-9">
        <div className="mb-2 flex items-center gap-3 text-sm font-bold uppercase tracking-[.16em] text-[#188878]"><span className="h-2 w-2 rounded-full bg-[#e77d64]" /> Sound Match <span className="h-2 w-2 rounded-full bg-[#e77d64]" /></div>
        <OfficialCharacterImage character="koko" pose={characterPose} className="mt-2 h-[72px] w-auto sm:h-[88px]" />
        <h1 className="mt-2 text-center font-display text-2xl font-bold text-[#173f46] sm:text-3xl">Listen, then choose the first letter</h1>
        <div className="mt-4 grid h-24 w-24 place-items-center rounded-[1.75rem] bg-[#dcefe9] text-[#188878] shadow-[inset_0_-7px_0_#a6cdc3] sm:h-28 sm:w-28" aria-hidden="true">
          <Volume2 size={54} strokeWidth={1.8} />
        </div>
        <button type="button" onClick={onListenAgain} className="koko-button mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border-2 border-[#b6d8d1] bg-[#f1faf5] px-6 font-bold text-[#12685d] shadow-[0_4px_0_#d7e9e3]" data-testid="button-sound-match-listen-again"><Volume2 size={20} /> Listen Again</button>
        <div className="mt-6 grid w-full max-w-lg grid-cols-3 gap-2 sm:mt-7 sm:gap-4" role="group" aria-label="Sound Match letter choices">
          {question.choices.map((choice) => {
            const isSelected = selectedAnswer === choice;
            const choiceClass = isSelected && choice === targetLetter
              ? 'border-[#188878] bg-[#dcefe9] text-[#12685d] shadow-[0_5px_0_#a6cdc3]'
              : isSelected
                ? 'border-[#e77d64] bg-[#f8dcd4] text-[#aa4d3a] shadow-[0_5px_0_#eab9ad]'
                : 'border-[#b6d8d1] bg-[#fffdf5] text-[#173f46] shadow-[0_5px_0_#d7e9e3] hover:border-[#188878] hover:bg-[#f1faf5]';
            return (
              <button
                type="button"
                key={choice}
                onClick={() => onAnswer(choice)}
                disabled={isCorrect}
                aria-label={`Choose letter ${choice}`}
                aria-pressed={isSelected}
                className={`koko-button min-h-[4.5rem] rounded-2xl border-2 text-4xl font-bold sm:min-h-24 sm:text-5xl ${choiceClass} ${isSelected && choice !== targetLetter ? 'koko-shake' : ''}`}
                data-testid={`button-sound-match-letter-${choice}`}
              >
                {choice}{isSelected && choice === targetLetter ? <Check className="ml-1 inline-block" size={24} strokeWidth={4} /> : null}
              </button>
            );
          })}
        </div>
        <div className="mt-5 min-h-12 text-center" aria-live="polite" data-testid="sound-match-feedback">
          {feedback && <div className={`koko-pop rounded-2xl px-5 py-2 font-display text-2xl font-bold ${isCorrect ? 'bg-[#dcefe9] text-[#12685d]' : 'bg-[#f8dcd4] text-[#aa4d3a]'}`}>{feedback}</div>}
        </div>
        {isCorrect && <button type="button" onClick={onNext} className="koko-button mt-1 inline-flex min-h-14 items-center gap-3 rounded-2xl bg-[#e77d64] px-8 text-lg font-bold text-[#fffdf5] shadow-[0_6px_0_#b95b49]" data-testid="button-sound-match-next">{round === 8 ? 'See my stars' : 'Next question'} <ArrowRight size={22} strokeWidth={3} /></button>}
      </div>
    </section>
  );
}

function SoundMatchCompletionScreen({ score, onPlayAgain, onBackToAdventure, onNextLevel }: { score: number; onPlayAgain: () => void; onBackToAdventure: () => void; onNextLevel: () => void }) {
  const stars = score >= 7 ? 3 : score >= 4 ? 2 : 1;
  const message = score === 8 ? 'Sound Match superstar!' : score >= 6 ? 'You are a listening star!' : 'Every try helps you grow!';
  return (
    <section className="koko-pop flex flex-1 items-center justify-center py-8 sm:py-12">
      <div className="koko-card relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-[#fffdf5] px-5 py-8 text-center sm:px-12 sm:py-12">
        <span className="koko-sparkle absolute left-6 top-6 text-2xl text-[#f4b942] sm:left-8 sm:top-8 sm:text-3xl">✦</span>
        <span className="koko-sparkle absolute right-6 top-10 text-2xl text-[#e77d64] sm:right-8 sm:top-14 sm:text-3xl" style={{ animationDelay: '.25s' }}>✦</span>
        <OfficialCharacterImage character="koko" pose="celebrating" className="mx-auto h-[82px] w-[111px] sm:h-[108px] sm:w-[146px]" />
        <p className="mt-5 text-sm font-bold uppercase tracking-[.18em] text-[#e77d64]">Level 4 · Sound Match</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-[#173f46] sm:text-6xl" data-testid="text-sound-match-completion-title">Level 4 Complete!</h1>
        <p className="mt-2 font-display text-2xl font-bold text-[#188878]">{message}</p>
        <div className="my-6 flex justify-center gap-1" aria-label={`${stars} out of 3 stars`} data-testid="text-sound-match-stars">
          {[1, 2, 3].map((star) => <Star key={star} size={48} fill={star <= stars ? '#f4b942' : '#e7ded0'} color={star <= stars ? '#d68c31' : '#d4c9b7'} strokeWidth={1.5} className={star <= stars ? 'koko-pop' : ''} style={{ animationDelay: `${star * .08}s` }} />)}
        </div>
        <div className="mx-auto max-w-sm rounded-2xl bg-[#dcefe9] px-6 py-5"><p className="font-display text-3xl font-bold text-[#12685d]" data-testid="text-sound-match-final-score">{score} / 8</p><p className="mt-1 font-medium text-[#507277]">sounds matched</p></div>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-[#507277]">You listened closely and found the beginning sounds. Give yourself a big high-five!</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
          <button type="button" onClick={onPlayAgain} className="koko-button inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#188878] px-7 text-lg font-bold text-[#fffdf5] shadow-[0_6px_0_#0f6259]" data-testid="button-replay-sound-match"><RotateCcw size={21} strokeWidth={3} /> Play Again</button>
          <button type="button" onClick={onNextLevel} className="koko-button inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#e77d64] px-7 text-lg font-bold text-[#fffdf5] shadow-[0_6px_0_#b95b49]" data-testid="button-next-level-sound-match">Next Level <span aria-hidden="true">→</span></button>
          <button type="button" onClick={onBackToAdventure} className="koko-button inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-[#b6d8d1] bg-[#fffdf5] px-6 font-bold text-[#24645c] shadow-[0_4px_0_#d7e9e3]" data-testid="button-back-to-adventure-sound-match"><Map size={20} /> Back to Adventure</button>
        </div>
      </div>
    </section>
  );
}

interface GameAppProps {
  childId: string;
  supabaseProgress: any;
  onLevelComplete: (level: number, score: number) => Promise<void>;
}

function GameApp(props: GameAppProps) {
  const { childId, supabaseProgress, onLevelComplete } = props;
  const [screen, setScreen] = useState<Screen>('welcome');
  const [speechEnabled, setSpeechEnabled] = useState(true);

  // Initialize level completion from Supabase progress
  const [level1Complete, setLevel1Complete] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return supabaseProgress?.isLevelComplete(1) ?? window.localStorage.getItem(PROGRESS_STORAGE_KEY) === 'complete';
    } catch {
      return false;
    }
  });
  const [level2Complete, setLevel2Complete] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return supabaseProgress?.isLevelComplete(2) ?? window.localStorage.getItem(LEVEL_2_PROGRESS_STORAGE_KEY) === 'complete';
    } catch {
      return false;
    }
  });
  const [level3Complete, setLevel3Complete] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return supabaseProgress?.isLevelComplete(3) ?? window.localStorage.getItem(LEVEL_3_PROGRESS_STORAGE_KEY) === 'complete';
    } catch {
      return false;
    }
  });
  const [level4Complete, setLevel4Complete] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return supabaseProgress?.isLevelComplete(4) ?? window.localStorage.getItem(LEVEL_4_PROGRESS_STORAGE_KEY) === 'complete';
    } catch {
      return false;
    }
  });
  const [level5Complete, setLevel5Complete] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return supabaseProgress?.isLevelComplete(5) ?? window.localStorage.getItem(LEVEL_5_PROGRESS_STORAGE_KEY) === 'complete';
    } catch {
      return false;
    }
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [soundSafariQuestions, setSoundSafariQuestions] = useState<Question[]>([]);
  const [soundSafariRound, setSoundSafariRound] = useState(0);
  const [soundSafariScore, setSoundSafariScore] = useState(0);
  const [soundSafariChoices, setSoundSafariChoices] = useState<string[]>([]);
  const [soundSafariFeedback, setSoundSafariFeedback] = useState<string | null>(null);
  const [soundSafariSelectedAnswer, setSoundSafariSelectedAnswer] = useState<string | null>(null);
  const [pictureHuntQuestions, setPictureHuntQuestions] = useState<PictureHuntQuestionSet[]>([]);
  const [pictureHuntRound, setPictureHuntRound] = useState(0);
  const [pictureHuntScore, setPictureHuntScore] = useState(0);
  const [pictureHuntFeedback, setPictureHuntFeedback] = useState<string | null>(null);
  const [pictureHuntSelectedAnswer, setPictureHuntSelectedAnswer] = useState<string | null>(null);
  const [soundMatchQuestions, setSoundMatchQuestions] = useState<SoundMatchQuestionSet[]>([]);
  const [soundMatchRound, setSoundMatchRound] = useState(0);
  const [soundMatchScore, setSoundMatchScore] = useState(0);
  const [soundMatchFeedback, setSoundMatchFeedback] = useState<string | null>(null);
  const [soundMatchSelectedAnswer, setSoundMatchSelectedAnswer] = useState<string | null>(null);
  const [superLetterChallengeQuestions, setSuperLetterChallengeQuestions] = useState<SuperLetterChallengeQuestion[]>([]);
  const [superLetterChallengeRound, setSuperLetterChallengeRound] = useState(0);
  const [superLetterChallengeScore, setSuperLetterChallengeScore] = useState(0);
  const [superLetterChallengeFeedback, setSuperLetterChallengeFeedback] = useState<string | null>(null);
  const [superLetterChallengeSelectedAnswer, setSuperLetterChallengeSelectedAnswer] = useState<string | null>(null);
  const { play: playKokoPhrase, stop: stopKokoAudio } = useKokoAudio(speechEnabled);

  const question = questions[round];
  const soundSafariQuestion = soundSafariQuestions[soundSafariRound];
  const pictureHuntQuestion = pictureHuntQuestions[pictureHuntRound];
  const soundMatchQuestion = soundMatchQuestions[soundMatchRound];
  const superLetterChallengeQuestion = superLetterChallengeQuestions[superLetterChallengeRound];

  const openAdventure = useCallback(() => {
    setScreen('adventure-map');
  }, []);

  const markLevel1Complete = useCallback(async () => {
    setLevel1Complete(true);
    try {
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, 'complete');
      await onLevelComplete(1, score);
    } catch (error) {
      console.error('Error marking level 1 complete:', error);
    }
  }, [score, onLevelComplete]);

  const markLevel2Complete = useCallback(async () => {
    setLevel2Complete(true);
    try {
      window.localStorage.setItem(LEVEL_2_PROGRESS_STORAGE_KEY, 'complete');
      await onLevelComplete(2, soundSafariScore);
    } catch (error) {
      console.error('Error marking level 2 complete:', error);
    }
  }, [soundSafariScore, onLevelComplete]);

  const markLevel3Complete = useCallback(async () => {
    setLevel3Complete(true);
    try {
      window.localStorage.setItem(LEVEL_3_PROGRESS_STORAGE_KEY, 'complete');
      await onLevelComplete(3, pictureHuntScore);
    } catch (error) {
      console.error('Error marking level 3 complete:', error);
    }
  }, [pictureHuntScore, onLevelComplete]);

  const markLevel4Complete = useCallback(async () => {
    setLevel4Complete(true);
    try {
      window.localStorage.setItem(LEVEL_4_PROGRESS_STORAGE_KEY, 'complete');
      await onLevelComplete(4, soundMatchScore);
    } catch (error) {
      console.error('Error marking level 4 complete:', error);
    }
  }, [soundMatchScore, onLevelComplete]);

  const markLevel5Complete = useCallback(async () => {
    setLevel5Complete(true);
    try {
      window.localStorage.setItem(LEVEL_5_PROGRESS_STORAGE_KEY, 'complete');
      await onLevelComplete(5, superLetterChallengeScore);
    } catch (error) {
      console.error('Error marking level 5 complete:', error);
    }
  }, [superLetterChallengeScore, onLevelComplete]);

  const prepareChoices = useCallback((nextQuestion: Question, roundIndex: number) => {
    const distractorPool = roundIndex >= 3
      ? SOUND_NEIGHBORS[nextQuestion.letter] ?? LETTERS
      : LETTERS;
    const distractors = shuffle(Array.from(new Set(distractorPool)))
      .filter((letter) => letter !== nextQuestion.letter)
      .slice(0, 2);
    const fallbackLetters = shuffle(LETTERS.filter((letter) => ![nextQuestion.letter, ...distractors].includes(letter)));
    const uniqueChoices = [nextQuestion.letter, ...distractors, ...fallbackLetters].slice(0, 3);
    setChoices(shuffle(Array.from(new Set(uniqueChoices))));
  }, []);

  const prepareSoundSafariChoices = useCallback((nextQuestion: Question, roundIndex: number) => {
    const distractorPool = roundIndex >= 3
      ? SOUND_NEIGHBORS[nextQuestion.letter] ?? LETTERS
      : LETTERS;
    const distractors = shuffle(Array.from(new Set(distractorPool)))
      .filter((letter) => letter !== nextQuestion.letter)
      .slice(0, 2);
    const fallbackLetters = shuffle(LETTERS.filter((letter) => ![nextQuestion.letter, ...distractors].includes(letter)));
    const uniqueChoices = [nextQuestion.letter, ...distractors, ...fallbackLetters].slice(0, 3);
    setSoundSafariChoices(shuffle(Array.from(new Set(uniqueChoices))));
  }, []);

  const speakQuestion = useCallback((nextQuestion: Question, roundIndex: number) => {
    const word = typeof nextQuestion.word === 'string' ? nextQuestion.word.trim() : '';
    const promptOnly = roundIndex >= 6
      ? 'Which letter makes the first sound?'
      : 'What letter does it start with?';
    if (!word) {
      playKokoPhrase(promptOnly, getKokoAudioPath('instructions', 'howToPlay'));
      return;
    }

    const text = roundIndex >= 6
      ? `${word}! Which letter makes the first sound?`
      : roundIndex >= 3
        ? `${nextQuestion.letter}... ${word}... What letter does it start with?`
        : `${word}! What letter does it start with?`;
    playKokoPhrase(text, getQuestionAudioPath(nextQuestion));
  }, [playKokoPhrase]);

  const speakSoundSafariQuestion = useCallback((nextQuestion: Question) => {
    const word = typeof nextQuestion.word === 'string' ? nextQuestion.word.trim() : '';
    const text = word ? `${word}! What letter does it start with?` : 'What letter does it start with?';
    playKokoPhrase(text, getQuestionAudioPath(nextQuestion));
  }, [playKokoPhrase]);

  const speakSoundMatchQuestion = useCallback((nextQuestion: Question) => {
    const word = typeof nextQuestion.word === 'string' ? nextQuestion.word.trim() : '';
    if (word) {
      playKokoPhrase(word, getQuestionAudioPath(nextQuestion), {
        browserSpeechRate: SOUND_MATCH_SPEECH_RATE,
      });
    }
  }, [playKokoPhrase]);

  const speakSuperLetterChallengeQuestion = useCallback((nextQuestion: SuperLetterChallengeQuestion) => {
    if (nextQuestion.type !== 'hear-word-to-letter' && nextQuestion.type !== 'beginning-sound-to-letter') return;
    const word = typeof nextQuestion.question.word === 'string' ? nextQuestion.question.word.trim() : '';
    if (word) {
      playKokoPhrase(word, null, { browserSpeechRate: SOUND_MATCH_SPEECH_RATE });
    }
  }, [playKokoPhrase]);

  const startGame = useCallback(() => {
    const nextQuestions = selectQuestions();
    setQuestions(nextQuestions);
    setRound(0);
    setScore(0);
    setFeedback(null);
    setSelectedAnswer(null);
    prepareChoices(nextQuestions[0], 0);
    setScreen('gameplay');
    speakQuestion(nextQuestions[0], 0);
  }, [prepareChoices, speakQuestion]);

  const startSoundSafari = useCallback(() => {
    if (!level1Complete) {
      setScreen('adventure-map');
      return;
    }
    const nextQuestions = selectQuestions();
    setSoundSafariQuestions(nextQuestions);
    setSoundSafariRound(0);
    setSoundSafariScore(0);
    setSoundSafariFeedback(null);
    setSoundSafariSelectedAnswer(null);
    prepareSoundSafariChoices(nextQuestions[0], 0);
    setScreen('sound-safari-gameplay');
    speakSoundSafariQuestion(nextQuestions[0]);
  }, [level1Complete, prepareSoundSafariChoices, speakSoundSafariQuestion]);

  const startPictureHunt = useCallback(() => {
    if (!level2Complete) {
      setScreen('adventure-map');
      return;
    }
    setPictureHuntQuestions(selectPictureHuntQuestions());
    setPictureHuntRound(0);
    setPictureHuntScore(0);
    setPictureHuntFeedback(null);
    setPictureHuntSelectedAnswer(null);
    setScreen('picture-hunt-gameplay');
  }, [level2Complete]);

  const openPictureHunt = useCallback(() => {
    if (!level2Complete) {
      setScreen('adventure-map');
      return;
    }
    setScreen('picture-hunt-intro');
  }, [level2Complete]);

  const startSoundMatch = useCallback(() => {
    stopKokoAudio();
    if (!level3Complete) {
      setScreen('adventure-map');
      return;
    }
    setSoundMatchQuestions(selectSoundMatchQuestions());
    setSoundMatchRound(0);
    setSoundMatchScore(0);
    setSoundMatchFeedback(null);
    setSoundMatchSelectedAnswer(null);
    setScreen('sound-match-gameplay');
  }, [level3Complete, stopKokoAudio]);

  const openSoundMatch = useCallback(() => {
    if (!level3Complete) {
      setScreen('adventure-map');
      return;
    }
    setScreen('sound-match-intro');
  }, [level3Complete]);

  const startSuperLetterChallenge = useCallback(() => {
    stopKokoAudio();
    if (!level4Complete) {
      setScreen('adventure-map');
      return;
    }
    setSuperLetterChallengeQuestions(createSuperLetterChallengeQuestions());
    setSuperLetterChallengeRound(0);
    setSuperLetterChallengeScore(0);
    setSuperLetterChallengeFeedback(null);
    setSuperLetterChallengeSelectedAnswer(null);
    setScreen('super-letter-challenge-gameplay');
  }, [level4Complete, stopKokoAudio]);

  const openSuperLetterChallenge = useCallback(() => {
    if (!level4Complete) {
      setScreen('adventure-map');
      return;
    }
    setScreen('super-letter-challenge-intro');
  }, [level4Complete]);

  useEffect(() => {
    if (screen === 'welcome') playKokoPhrase('Welcome to Kòkò’s Learning Adventure!', getKokoAudioPath('instructions', 'welcome'));
    if (screen === 'adventure-map') {
      const mapPrompt = level5Complete
        ? 'Great job! You completed the final Super Letter Challenge.'
        : level4Complete
          ? 'Choose your adventure. Level 5 is unlocked!'
          : level3Complete
            ? 'Choose your adventure. Sound Match is unlocked!'
            : level2Complete
              ? 'Choose your adventure. Picture Hunt is now unlocked!'
              : level1Complete
                ? 'Choose your adventure. Sound Safari is now unlocked!'
                : 'Choose your adventure. Letter Hunt is ready to play.';
      playKokoPhrase(mapPrompt, getKokoAudioPath('instructions', 'adventureMap'));
    }
    if (screen === 'how-to-play') playKokoPhrase('Look at the object, say its name, and tap the letter that starts the word.', getKokoAudioPath('instructions', 'howToPlay'));
    if (screen === 'completion') playKokoPhrase(`You found ${score} out of 8 letters. Great playing!`);
    if (screen === 'sound-safari-completion') playKokoPhrase(`You matched ${soundSafariScore} out of 8 sounds. Great listening!`, getKokoAudioPath('instructions', 'soundSafari'));
    if (screen === 'picture-hunt-intro') playKokoPhrase('Picture Hunt! Kòkò needs your help. Find the picture that starts with the letter.', getKokoAudioPath('instructions', 'pictureHunt'));
    if (screen === 'picture-hunt-gameplay' && pictureHuntQuestion) playKokoPhrase(`Which picture starts with the letter ${pictureHuntQuestion.question.letter}?`);
    if (screen === 'picture-hunt-completion') playKokoPhrase(`You matched ${pictureHuntScore} out of 8 pictures. Great playing!`);
    if (screen === 'sound-match-intro') playKokoPhrase('Sound Match! Listen carefully and find the letter that matches the beginning sound!');
    if (screen === 'sound-match-completion') playKokoPhrase(`You matched ${soundMatchScore} out of 8 sounds. Great listening!`);
    if (screen === 'super-letter-challenge-intro') playKokoPhrase('Super Letter Challenge! Look, listen, and show what you know!');
    if (screen === 'super-letter-challenge-completion') playKokoPhrase(`You completed Kòkò’s Letter Adventure with a score of ${superLetterChallengeScore} out of ${SUPER_LETTER_CHALLENGE_LENGTH}.`);
  }, [level1Complete, level2Complete, level3Complete, level4Complete, level5Complete, pictureHuntQuestion?.question.id, pictureHuntQuestion?.question.letter, pictureHuntScore, playKokoPhrase, screen, score, soundMatchScore, soundSafariScore, superLetterChallengeScore]);

  useEffect(() => {
    if (screen === 'sound-match-gameplay' && soundMatchQuestion) {
      speakSoundMatchQuestion(soundMatchQuestion.question);
    }
  }, [screen, soundMatchQuestion?.question.id, speakSoundMatchQuestion]);

  useEffect(() => {
    if (screen === 'super-letter-challenge-gameplay' && superLetterChallengeQuestion) {
      speakSuperLetterChallengeQuestion(superLetterChallengeQuestion);
    }
  }, [screen, speakSuperLetterChallengeQuestion, superLetterChallengeQuestion?.id]);

  useEffect(() => {
    if (screen !== 'picture-hunt-gameplay' || !pictureHuntQuestion || pictureHuntSelectedAnswer !== pictureHuntQuestion.question.id) return;

    const timeoutId = window.setTimeout(() => {
      if (pictureHuntRound === pictureHuntQuestions.length - 1) {
        markLevel3Complete();
        setScreen('picture-hunt-completion');
        return;
      }
      setPictureHuntRound((currentRound) => currentRound + 1);
      setPictureHuntSelectedAnswer(null);
      setPictureHuntFeedback(null);
    }, 900);

    return () => window.clearTimeout(timeoutId);
  }, [markLevel3Complete, pictureHuntQuestion, pictureHuntRound, pictureHuntQuestions.length, pictureHuntSelectedAnswer, screen]);

  const toggleSound = useCallback(() => {
    setSpeechEnabled((enabled) => {
      if (enabled) stopKokoAudio();
      return !enabled;
    });
  }, [stopKokoAudio]);

  const chooseAnswer = (answer: string) => {
    if (!question || selectedAnswer === question.letter) return;
    setSelectedAnswer(answer);
    if (answer === question.letter) {
      const nextScore = score + 1;
      setScore(nextScore);
      const praise = POSITIVE_FEEDBACK[Math.floor(Math.random() * POSITIVE_FEEDBACK.length)];
      setFeedback(praise.text);
      playKokoPhrase(praise.text.replace(/[🎉⭐👏]/gu, ''), getKokoAudioPath('feedback', praise.audioKey));
    } else {
      setFeedback('Try again! 💛');
      playKokoPhrase('Try again!', getKokoAudioPath('feedback', 'tryAgain'));
      window.setTimeout(() => {
        setSelectedAnswer((current) => current === answer ? null : current);
        setFeedback((current) => current === 'Try again! 💛' ? null : current);
      }, 700);
    }
  };

  const chooseSoundSafariAnswer = (answer: string) => {
    if (!soundSafariQuestion || soundSafariSelectedAnswer === soundSafariQuestion.letter) return;
    setSoundSafariSelectedAnswer(answer);
    if (answer === soundSafariQuestion.letter) {
      const nextScore = soundSafariScore + 1;
      setSoundSafariScore(nextScore);
      const praise = POSITIVE_FEEDBACK[Math.floor(Math.random() * POSITIVE_FEEDBACK.length)];
      setSoundSafariFeedback(praise.text);
      playKokoPhrase(praise.text.replace(/[🎉⭐👏]/gu, ''), getKokoAudioPath('feedback', praise.audioKey));
    } else {
      setSoundSafariFeedback('Listen once more! 💛');
      playKokoPhrase('Listen once more!', getKokoAudioPath('feedback', 'listenOnceMore'));
      window.setTimeout(() => {
        setSoundSafariSelectedAnswer((current) => current === answer ? null : current);
        setSoundSafariFeedback((current) => current === 'Listen once more! 💛' ? null : current);
      }, 700);
    }
  };

  const choosePictureHuntAnswer = useCallback((answer: string) => {
    if (!pictureHuntQuestion || pictureHuntSelectedAnswer === pictureHuntQuestion.question.id) return;
    setPictureHuntSelectedAnswer(answer);
    if (answer === pictureHuntQuestion.question.id) {
      setPictureHuntScore((currentScore) => currentScore + 1);
      const praise = POSITIVE_FEEDBACK[Math.floor(Math.random() * POSITIVE_FEEDBACK.length)];
      setPictureHuntFeedback(praise.text);
      playKokoPhrase(praise.text.replace(/[🎉⭐👏]/gu, ''), getKokoAudioPath('feedback', praise.audioKey));
    } else {
      setPictureHuntFeedback('Try again! 💛');
      playKokoPhrase('Try again!', getKokoAudioPath('feedback', 'tryAgain'));
    }
  }, [pictureHuntQuestion, pictureHuntSelectedAnswer, playKokoPhrase]);

  const chooseSoundMatchAnswer = useCallback((answer: string) => {
    if (!soundMatchQuestion || soundMatchSelectedAnswer === soundMatchQuestion.question.letter) return;
    setSoundMatchSelectedAnswer(answer);
    if (answer === soundMatchQuestion.question.letter) {
      setSoundMatchScore((currentScore) => currentScore + 1);
      const praise = POSITIVE_FEEDBACK[Math.floor(Math.random() * POSITIVE_FEEDBACK.length)];
      setSoundMatchFeedback(praise.text);
      playKokoPhrase(praise.text.replace(/[🎉⭐👏]/gu, ''), getKokoAudioPath('feedback', praise.audioKey));
      return;
    }

    setSoundMatchFeedback('Try again! 💛');
    playKokoPhrase('Try again!', getKokoAudioPath('feedback', 'tryAgain'));
    window.setTimeout(() => {
      setSoundMatchSelectedAnswer((currentAnswer) => currentAnswer === answer ? null : currentAnswer);
      setSoundMatchFeedback((currentFeedback) => currentFeedback === 'Try again! 💛' ? null : currentFeedback);
    }, 700);
  }, [playKokoPhrase, soundMatchQuestion, soundMatchSelectedAnswer]);

  const chooseSuperLetterChallengeAnswer = useCallback((answer: string) => {
    if (!superLetterChallengeQuestion) return;
    const correctAnswer = superLetterChallengeQuestion.type === 'letter-to-picture'
      ? superLetterChallengeQuestion.question.id
      : superLetterChallengeQuestion.question.letter;
    if (superLetterChallengeSelectedAnswer === correctAnswer) return;

    setSuperLetterChallengeSelectedAnswer(answer);
    if (answer === correctAnswer) {
      setSuperLetterChallengeScore((currentScore) => currentScore + 1);
      const praise = LEVEL_5_POSITIVE_FEEDBACK[Math.floor(Math.random() * LEVEL_5_POSITIVE_FEEDBACK.length)];
      setSuperLetterChallengeFeedback(praise);
      playKokoPhrase(praise.replace(/[🎉⭐👏🌟]/gu, ''));
      return;
    }

    setSuperLetterChallengeFeedback('Try again! 💛');
    playKokoPhrase('Try again!');
    window.setTimeout(() => {
      setSuperLetterChallengeSelectedAnswer((currentAnswer) => currentAnswer === answer ? null : currentAnswer);
      setSuperLetterChallengeFeedback((currentFeedback) => currentFeedback === 'Try again! 💛' ? null : currentFeedback);
    }, 700);
  }, [playKokoPhrase, superLetterChallengeQuestion, superLetterChallengeSelectedAnswer]);

  const nextRound = () => {
    if (round === questions.length - 1) {
      markLevel1Complete();
      setScreen('completion');
      return;
    }
    const nextRoundIndex = round + 1;
    setRound(nextRoundIndex);
    setSelectedAnswer(null);
    setFeedback(null);
    prepareChoices(questions[nextRoundIndex], nextRoundIndex);
    speakQuestion(questions[nextRoundIndex], nextRoundIndex);
  };

  const nextSoundSafariRound = () => {
    if (soundSafariRound === soundSafariQuestions.length - 1) {
      markLevel2Complete();
      setScreen('sound-safari-completion');
      return;
    }
    const nextRoundIndex = soundSafariRound + 1;
    setSoundSafariRound(nextRoundIndex);
    setSoundSafariSelectedAnswer(null);
    setSoundSafariFeedback(null);
    prepareSoundSafariChoices(soundSafariQuestions[nextRoundIndex], nextRoundIndex);
    speakSoundSafariQuestion(soundSafariQuestions[nextRoundIndex]);
  };

  const nextSoundMatchRound = useCallback(() => {
    stopKokoAudio();
    if (soundMatchRound === soundMatchQuestions.length - 1) {
      markLevel4Complete();
      setScreen('sound-match-completion');
      return;
    }
    setSoundMatchRound((currentRound) => currentRound + 1);
    setSoundMatchSelectedAnswer(null);
    setSoundMatchFeedback(null);
  }, [markLevel4Complete, soundMatchQuestions.length, soundMatchRound, stopKokoAudio]);

  const nextSuperLetterChallengeRound = useCallback(() => {
    stopKokoAudio();
    if (superLetterChallengeRound === SUPER_LETTER_CHALLENGE_LENGTH - 1) {
      markLevel5Complete();
      setScreen('super-letter-challenge-completion');
      return;
    }
    setSuperLetterChallengeRound((currentRound) => currentRound + 1);
    setSuperLetterChallengeSelectedAnswer(null);
    setSuperLetterChallengeFeedback(null);
  }, [markLevel5Complete, stopKokoAudio, superLetterChallengeRound]);

  const content = useMemo(() => {
    if (screen === 'adventure-map') return <AdventureMapScreen level1Complete={level1Complete} level2Complete={level2Complete} level3Complete={level3Complete} level4Complete={level4Complete} level5Complete={level5Complete} onSelectLevel1={startGame} onSelectLevel2={startSoundSafari} onSelectLevel3={openPictureHunt} onSelectLevel4={openSoundMatch} onSelectLevel5={openSuperLetterChallenge} onBack={() => setScreen('welcome')} />;
    if (screen === 'how-to-play') return <HowToPlayScreen onBegin={startGame} onBack={() => setScreen('welcome')} />;
    if (screen === 'gameplay' && question) return <GameplayScreen question={question} round={round + 1} score={score} choices={choices} feedback={feedback} selectedAnswer={selectedAnswer} onAnswer={chooseAnswer} onNext={nextRound} />;
    if (screen === 'completion') return <CompletionScreen score={score} onPlayAgain={startGame} onBackToAdventure={openAdventure} onNextLevel={startSoundSafari} />;
    if (screen === 'sound-safari-gameplay' && soundSafariQuestion) return <SoundSafariGameplayScreen question={soundSafariQuestion} round={soundSafariRound + 1} score={soundSafariScore} choices={soundSafariChoices} feedback={soundSafariFeedback} selectedAnswer={soundSafariSelectedAnswer} onAnswer={chooseSoundSafariAnswer} onNext={nextSoundSafariRound} onListenAgain={() => speakSoundSafariQuestion(soundSafariQuestion)} />;
    if (screen === 'sound-safari-completion') return <SoundSafariCompletionScreen score={soundSafariScore} onReplay={startSoundSafari} onBackToAdventure={openAdventure} onNextLevel={openPictureHunt} />;
    if (screen === 'picture-hunt-intro') return <PictureHuntIntroScreen onStart={startPictureHunt} onBackToAdventure={openAdventure} />;
    if (screen === 'picture-hunt-gameplay' && pictureHuntQuestion) return <PictureHuntGameplayScreen question={pictureHuntQuestion} round={pictureHuntRound + 1} score={pictureHuntScore} selectedAnswer={pictureHuntSelectedAnswer} feedback={pictureHuntFeedback} onAnswer={choosePictureHuntAnswer} />;
    if (screen === 'picture-hunt-completion') return <PictureHuntCompletionScreen score={pictureHuntScore} onPlayAgain={startPictureHunt} onBackToAdventure={openAdventure} onNextLevel={openAdventure} />;
    if (screen === 'sound-match-intro') return <SoundMatchIntroScreen onStart={startSoundMatch} onBackToAdventure={openAdventure} />;
    if (screen === 'sound-match-gameplay' && soundMatchQuestion) return <SoundMatchGameplayScreen question={soundMatchQuestion} round={soundMatchRound + 1} score={soundMatchScore} selectedAnswer={soundMatchSelectedAnswer} feedback={soundMatchFeedback} onAnswer={chooseSoundMatchAnswer} onNext={nextSoundMatchRound} onListenAgain={() => speakSoundMatchQuestion(soundMatchQuestion.question)} />;
    if (screen === 'sound-match-completion') return <SoundMatchCompletionScreen score={soundMatchScore} onPlayAgain={startSoundMatch} onBackToAdventure={openAdventure} onNextLevel={openAdventure} />;
    if (screen === 'super-letter-challenge-intro') return <SuperLetterChallengeIntroScreen CharacterImage={OfficialCharacterImage} onStart={startSuperLetterChallenge} onBackToAdventure={openAdventure} />;
    if (screen === 'super-letter-challenge-gameplay' && superLetterChallengeQuestion) return <SuperLetterChallengeGameplayScreen CharacterImage={OfficialCharacterImage} question={superLetterChallengeQuestion} round={superLetterChallengeRound + 1} score={superLetterChallengeScore} selectedAnswer={superLetterChallengeSelectedAnswer} feedback={superLetterChallengeFeedback} onAnswer={chooseSuperLetterChallengeAnswer} onNext={nextSuperLetterChallengeRound} onListenAgain={() => speakSuperLetterChallengeQuestion(superLetterChallengeQuestion)} />;
    if (screen === 'super-letter-challenge-completion') return <SuperLetterChallengeCompletionScreen CharacterImage={OfficialCharacterImage} score={superLetterChallengeScore} onPlayAgain={startSuperLetterChallenge} onBackToAdventure={openAdventure} />;
    return <WelcomeScreen onOpenAdventure={openAdventure} onHowToPlay={() => setScreen('how-to-play')} />;
  }, [choices, choosePictureHuntAnswer, chooseSoundMatchAnswer, chooseSuperLetterChallengeAnswer, feedback, level1Complete, level2Complete, level3Complete, level4Complete, level5Complete, nextSuperLetterChallengeRound, openAdventure, openPictureHunt, openSoundMatch, openSuperLetterChallenge, pictureHuntFeedback, pictureHuntQuestion, pictureHuntRound, pictureHuntScore, pictureHuntSelectedAnswer, question, round, score, screen, selectedAnswer, soundMatchFeedback, soundMatchQuestion, soundMatchRound, soundMatchScore, soundMatchSelectedAnswer, soundSafariChoices, soundSafariFeedback, soundSafariQuestion, soundSafariRound, soundSafariScore, soundSafariSelectedAnswer, speakSoundMatchQuestion, speakSuperLetterChallengeQuestion, startGame, startPictureHunt, startSoundMatch, startSoundSafari, startSuperLetterChallenge, superLetterChallengeFeedback, superLetterChallengeQuestion, superLetterChallengeRound, superLetterChallengeScore, superLetterChallengeSelectedAnswer]);

  return <ScreenFrame speechEnabled={speechEnabled} onToggleSound={toggleSound}>{content}</ScreenFrame>;
}

export default GameApp;