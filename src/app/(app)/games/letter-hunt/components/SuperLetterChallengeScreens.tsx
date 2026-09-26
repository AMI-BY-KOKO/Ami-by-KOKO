import type { ComponentType } from 'react';
import { ArrowLeft, ArrowRight, Check, Map, RotateCcw, Star, Volume2 } from 'lucide-react';
import {
  SUPER_LETTER_CHALLENGE_LENGTH,
  type SuperLetterChallengeQuestion,
} from '../content/superLetterChallenge';

type CharacterImageProps = {
  character: 'koko' | 'ami';
  pose: 'front' | 'happy' | 'thinking' | 'correct' | 'celebrating';
  className: string;
};

type CharacterImageComponent = ComponentType<CharacterImageProps>;

export function SuperLetterChallengeIntroScreen({
  CharacterImage,
  onStart,
  onBackToAdventure,
}: {
  CharacterImage: CharacterImageComponent;
  onStart: () => void;
  onBackToAdventure: () => void;
}) {
  return (
    <section className="koko-pop flex flex-1 items-center justify-center py-8 sm:py-12">
      <div className="koko-card w-full max-w-2xl rounded-[2rem] bg-[#fffdf5] px-6 py-9 text-center sm:px-12 sm:py-12">
        <div className="flex items-center justify-center gap-3">
          <CharacterImage character="koko" pose="happy" className="h-[92px] w-auto sm:h-[108px]" />
          <CharacterImage character="ami" pose="happy" className="h-[68px] w-auto sm:h-[80px]" />
        </div>
        <p className="mt-5 text-sm font-bold uppercase tracking-[.18em] text-[#e77d64]">Level 5 · Final Challenge</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-[#173f46] sm:text-5xl">Super Letter Challenge</h1>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-[#507277]">
          Look, listen, and show Kòkò and Àmì what you know!
        </p>
        <p className="mt-2 font-semibold text-[#188878]">10 mixed questions · You can try again anytime.</p>
        <div className="mt-8 flex flex-col-reverse justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onBackToAdventure}
            className="koko-button inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-[#b6d8d1] bg-[#fffdf5] px-7 font-bold text-[#24645c] shadow-[0_4px_0_#d7e9e3]"
            data-testid="button-level-5-intro-back"
          >
            <ArrowLeft size={20} /> Back to Adventure Map
          </button>
          <button
            type="button"
            onClick={onStart}
            className="koko-button inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#188878] px-8 text-lg font-bold text-[#fffdf5] shadow-[0_6px_0_#0f6259]"
            data-testid="button-level-5-start"
          >
            Start Challenge <ArrowRight size={23} strokeWidth={3} />
          </button>
        </div>
      </div>
    </section>
  );
}

export function SuperLetterChallengeGameplayScreen({
  CharacterImage,
  question,
  round,
  score,
  selectedAnswer,
  feedback,
  onAnswer,
  onNext,
  onListenAgain,
}: {
  CharacterImage: CharacterImageComponent;
  question: SuperLetterChallengeQuestion;
  round: number;
  score: number;
  selectedAnswer: string | null;
  feedback: string | null;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  onListenAgain: () => void;
}) {
  const isPictureChoice = question.type === 'letter-to-picture';
  const isSoundQuestion = question.type === 'hear-word-to-letter' || question.type === 'beginning-sound-to-letter';
  const correctAnswer = isPictureChoice ? question.question.id : question.question.letter;
  const isCorrect = selectedAnswer === correctAnswer;
  const characterPose = isCorrect ? 'correct' : feedback ? 'happy' : 'thinking';
  const prompt = question.type === 'picture-to-letter'
    ? 'Look at the picture. Which letter starts its name?'
    : question.type === 'hear-word-to-letter'
      ? 'Listen to the word, then choose its first letter.'
      : question.type === 'letter-to-picture'
        ? 'Find a picture that begins with this letter.'
        : 'Listen for the beginning sound, then choose its letter.';

  return (
    <section className="koko-pop mx-auto flex w-full max-w-3xl flex-1 flex-col py-6 sm:py-10">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-end justify-between gap-3 text-sm font-bold text-[#507277]">
            <span data-testid="text-level-5-round">Question {round} of {SUPER_LETTER_CHALLENGE_LENGTH}</span>
            <span data-testid="text-level-5-score">Score: {score}</span>
          </div>
          <div
            className="h-4 overflow-hidden rounded-full bg-[#dcefe9]"
            role="progressbar"
            aria-valuenow={round}
            aria-valuemin={0}
            aria-valuemax={SUPER_LETTER_CHALLENGE_LENGTH}
            aria-label={`Question ${round} of ${SUPER_LETTER_CHALLENGE_LENGTH}`}
            data-testid="progress-level-5"
          >
            <div className="h-full rounded-full bg-[#f4b942] transition-all duration-500" style={{ width: `${(round / SUPER_LETTER_CHALLENGE_LENGTH) * 100}%` }} />
          </div>
        </div>
        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f7e6b4] font-display text-xl font-bold text-[#9b6b1a] sm:flex" aria-label={`${score} points`}>
          {score}<span className="ml-1 text-sm">★</span>
        </div>
      </div>

      <div
        className="koko-card mt-6 flex flex-1 flex-col items-center rounded-[2rem] bg-[#fffdf5] px-4 py-6 sm:mt-9 sm:px-12 sm:py-9"
        data-testid="level-5-question-card"
        data-question-type={question.type}
        data-question-id={question.question.id}
      >
        <div className="mb-2 flex items-center gap-3 text-sm font-bold uppercase tracking-[.16em] text-[#188878]">
          <span className="h-2 w-2 rounded-full bg-[#e77d64]" /> Super Letter Challenge <span className="h-2 w-2 rounded-full bg-[#e77d64]" />
        </div>
        <CharacterImage character="koko" pose={characterPose} className="mt-2 h-[68px] w-auto sm:h-[78px]" />
        <h1 className="mt-2 text-center font-display text-2xl font-bold text-[#173f46] sm:text-3xl" data-testid="text-level-5-prompt">
          {prompt}
        </h1>

        {question.type === 'picture-to-letter' && (
          <div
            className="mt-5 grid h-32 w-32 place-items-center rounded-[1.75rem] bg-[#f7e6b4] text-7xl shadow-[inset_0_-7px_0_#edcf83] sm:h-36 sm:w-36 sm:text-8xl"
            role="img"
            aria-label="Picture clue"
            data-testid="level-5-picture-clue"
          >
            {question.question.image}
          </div>
        )}

        {isSoundQuestion && (
          <>
            <div
              className="mt-5 grid h-28 w-28 place-items-center rounded-[1.75rem] bg-[#dcefe9] text-[#188878] shadow-[inset_0_-7px_0_#a6cdc3] sm:h-32 sm:w-32"
              role="img"
              aria-label="Spoken word clue"
              data-testid="level-5-sound-clue"
            >
              <Volume2 size={62} strokeWidth={1.8} />
            </div>
            <button
              type="button"
              onClick={onListenAgain}
              className="koko-button mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border-2 border-[#b6d8d1] bg-[#f1faf5] px-6 font-bold text-[#12685d] shadow-[0_4px_0_#d7e9e3]"
              data-testid="button-level-5-listen-again"
            >
              <Volume2 size={20} /> Listen Again
            </button>
          </>
        )}

        {question.type === 'letter-to-picture' && (
          <div
            className="mt-5 grid h-28 w-28 place-items-center rounded-[1.75rem] bg-[#f7e6b4] font-display text-7xl font-bold text-[#173f46] shadow-[inset_0_-7px_0_#edcf83] sm:h-32 sm:w-32 sm:text-8xl"
            role="img"
            aria-label={`Target letter ${question.question.letter}`}
            data-testid="level-5-target-letter"
          >
            {question.question.letter}
          </div>
        )}

        {isPictureChoice ? (
          <div className="mt-6 grid w-full max-w-lg grid-cols-3 gap-2 sm:mt-7 sm:gap-4" role="group" aria-label="Picture choices">
            {question.choices.map((choice, index) => {
              const isSelected = selectedAnswer === choice.id;
              const choiceClass = isSelected && isCorrect
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
                  aria-label={`Picture choice ${index + 1}`}
                  aria-pressed={isSelected}
                  className={`koko-button flex min-h-28 items-center justify-center rounded-2xl border-2 px-2 text-5xl sm:min-h-36 sm:text-6xl ${choiceClass}`}
                  data-testid={`button-level-5-picture-${choice.id}`}
                >
                  <span aria-hidden="true">{choice.image}</span>
                  <span className="sr-only">Picture choice {index + 1}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 grid w-full max-w-lg grid-cols-3 gap-2 sm:mt-7 sm:gap-4" role="group" aria-label="Letter choices">
            {question.choices.map((choice) => {
              const isSelected = selectedAnswer === choice;
              const choiceClass = isSelected && isCorrect
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
                  className={`koko-button min-h-20 rounded-2xl border-2 text-4xl font-bold sm:min-h-24 sm:text-5xl ${choiceClass} ${isSelected && !isCorrect ? 'koko-shake' : ''}`}
                  data-testid={`button-level-5-letter-${choice}`}
                >
                  {choice}{isSelected && isCorrect ? <Check className="ml-1 inline-block" size={24} strokeWidth={4} /> : null}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-5 min-h-12 text-center" aria-live="polite" data-testid="level-5-feedback">
          {feedback && (
            <div className={`koko-pop rounded-2xl px-5 py-2 font-display text-2xl font-bold ${isCorrect ? 'bg-[#dcefe9] text-[#12685d]' : 'bg-[#f8dcd4] text-[#aa4d3a]'}`}>
              {feedback}
            </div>
          )}
        </div>
        {isCorrect && (
          <button
            type="button"
            onClick={onNext}
            className="koko-button mt-1 inline-flex min-h-14 items-center gap-3 rounded-2xl bg-[#e77d64] px-8 text-lg font-bold text-[#fffdf5] shadow-[0_6px_0_#b95b49]"
            data-testid="button-level-5-next"
          >
            {round === SUPER_LETTER_CHALLENGE_LENGTH ? 'Finish challenge' : 'Next question'} <ArrowRight size={22} strokeWidth={3} />
          </button>
        )}
      </div>
    </section>
  );
}

export function SuperLetterChallengeCompletionScreen({
  CharacterImage,
  score,
  onPlayAgain,
  onBackToAdventure,
}: {
  CharacterImage: CharacterImageComponent;
  score: number;
  onPlayAgain: () => void;
  onBackToAdventure: () => void;
}) {
  const stars = score >= 8 ? 3 : score >= 5 ? 2 : 1;
  return (
    <section className="koko-pop flex flex-1 items-center justify-center py-8 sm:py-12">
      <div className="koko-card relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-[#fffdf5] px-5 py-8 text-center sm:px-12 sm:py-12">
        <span className="koko-sparkle absolute left-6 top-6 text-2xl text-[#f4b942] sm:left-8 sm:top-8 sm:text-3xl">✦</span>
        <span className="koko-sparkle absolute right-6 top-10 text-2xl text-[#e77d64] sm:right-8 sm:top-14 sm:text-3xl" style={{ animationDelay: '.25s' }}>✦</span>
        <div className="flex items-end justify-center gap-3">
          <CharacterImage character="koko" pose="celebrating" className="h-[92px] w-auto sm:h-[108px]" />
          <CharacterImage character="ami" pose="celebrating" className="h-[74px] w-auto sm:h-[88px]" />
        </div>
        <p className="mt-5 text-sm font-bold uppercase tracking-[.18em] text-[#e77d64]">Level 5 · Super Letter Challenge</p>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-[#173f46] sm:text-5xl" data-testid="text-level-5-completion-title">
          You completed Kòkò’s Letter Adventure!
        </h1>
        <p className="mt-3 font-display text-2xl font-bold text-[#188878]">
          {score === SUPER_LETTER_CHALLENGE_LENGTH ? 'Fantastic listening and matching!' : 'You showed what you know!'}
        </p>
        <div className="my-6 flex justify-center gap-1" aria-label={`${stars} out of 3 stars`} data-testid="text-level-5-stars">
          {[1, 2, 3].map((star) => (
            <Star
              key={star}
              size={48}
              fill={star <= stars ? '#f4b942' : '#e7ded0'}
              color={star <= stars ? '#d68c31' : '#d4c9b7'}
              strokeWidth={1.5}
              className={star <= stars ? 'koko-pop' : ''}
              style={{ animationDelay: `${star * .08}s` }}
            />
          ))}
        </div>
        <div className="mx-auto max-w-sm rounded-2xl bg-[#dcefe9] px-6 py-5">
          <p className="font-display text-3xl font-bold text-[#12685d]" data-testid="text-level-5-final-score">
            {score} / {SUPER_LETTER_CHALLENGE_LENGTH}
          </p>
          <p className="mt-1 font-medium text-[#507277]">final score</p>
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={onPlayAgain}
            className="koko-button inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#188878] px-7 text-lg font-bold text-[#fffdf5] shadow-[0_6px_0_#0f6259]"
            data-testid="button-level-5-play-again"
          >
            <RotateCcw size={21} strokeWidth={3} /> Play Again
          </button>
          <button
            type="button"
            onClick={onBackToAdventure}
            className="koko-button inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-[#b6d8d1] bg-[#fffdf5] px-6 font-bold text-[#24645c] shadow-[0_4px_0_#d7e9e3]"
            data-testid="button-level-5-back-to-map"
          >
            <Map size={20} /> Back to Adventure Map
          </button>
        </div>
      </div>
    </section>
  );
}