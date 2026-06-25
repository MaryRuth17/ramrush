export const MAX_HEARTS = 3;

export const TIMER_BY_DIFFICULTY = {
  easy: 8,
  normal: 5,
  hard: 3,
} as const;

export const SCORE_VALUES = {
  correct: 10,
  wrong: -5,
  timeout: -5,
  speedBonus: 5,
} as const;
