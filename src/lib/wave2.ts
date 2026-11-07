// Exact-match wave 2 (2026-11-06).
// Sizes: common metric sizes with 6–9 graded lines. The launch build publishes sizes
// only when they have 10 or more, so these did not have pages.
// Lines: current major-brand lines whose NHTSA rows are mostly “All sizes,” so the
// launch cut (top 300 by explicit-size record count) does not publish them.
// No search-volume numbers are stored here.

export const WAVE2_SIZE_KEYS = [
  '265-65r18',
  '245-50r20',
  '255-65r17',
  '225-75r16',
  '255-60r18',
  '235-55r20',
  '225-65r16',
  '255-70r18',
] as const;

export const WAVE2_LINE_KEYS = [
  'michelin/crossclimate2',
  'continental/extremecontact-dws06-plus',
  'continental/purecontact-ls',
  'continental/truecontact-tour',
  'goodyear/assurance-weatherready-2',
  'goodyear/assurance-maxlife-2',
  'goodyear/wrangler-duratrac-rt',
  'falken/wildpeak-a-t-at3w-t-rating',
  'hankook/kinergy-4s-2',
  'cooper/discoverer-at3-4s',
] as const;
