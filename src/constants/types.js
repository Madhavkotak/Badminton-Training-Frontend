// Session Type Constants
export const SESSION_TYPES = {
  ON_COURT: 'on-court',
  FITNESS: 'fitness',
};

export const SESSION_TYPE_OPTIONS = [
  { value: SESSION_TYPES.ON_COURT, label: 'On-Court Session', icon: '🏸' },
  { value: SESSION_TYPES.FITNESS, label: 'Fitness Session', icon: '💪' },
];

// Match Type Constants
export const MATCH_TYPES = {
  SINGLES: 'Singles',
  DOUBLES: 'Doubles',
};

export const MATCH_TYPE_OPTIONS = [
  MATCH_TYPES.SINGLES,
  MATCH_TYPES.DOUBLES,
];

// Match Result Constants
export const MATCH_RESULTS = {
  WIN: 'Win',
  LOSS: 'Loss',
};
