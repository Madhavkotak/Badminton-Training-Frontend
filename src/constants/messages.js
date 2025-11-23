// UI Messages
export const MESSAGES = {
  // Success Messages
  SUCCESS: {
    SESSION_ADDED: 'Training session saved successfully!',
    SESSION_UPDATED: 'Training session updated successfully!',
    MATCH_RECORDED: 'Match recorded successfully!',
  },
  
  // Error Messages
  ERROR: {
    SESSION_TYPE_REQUIRED: 'Session type is required',
    DRILL_TYPE_REQUIRED: 'Drill type is required',
    DURATION_REQUIRED: 'Duration must be greater than 0',
    PLAYERS_REQUIRED: 'At least one player name is required',
    EXERCISES_REQUIRED: 'Please select at least one exercise',
    EXERCISE_DETAILS_REQUIRED: 'Please provide sets and reps for all exercises',
    MATCH_TYPE_REQUIRED: 'Match type is required',
    PARTNER_REQUIRED: 'Partner name is required',
    OPPONENT_REQUIRED: 'Opponent name is required',
    SCORES_EQUAL: 'Scores cannot be equal - draws are not allowed',
  },
  
  // Info Messages
  INFO: {
    NO_SESSIONS: 'No training sessions found. Start logging your sessions!',
    NO_MATCHES: 'No matches recorded yet. Add your first match above!',
    NO_DATA: 'No training data available for the selected date range. Start logging your sessions!',
    SELECT_DATE: 'Select a date to view or add training sessions',
  },
  
  // Labels
  LABELS: {
    ON_COURT_DRILL: 'On-Court Session',
    FITNESS_SESSION: 'Fitness Session',
    DRILL_DETAILS: 'Drill Details',
    FITNESS_EXERCISES: 'Fitness Exercises',
    SELECT_EXERCISES: 'Select Exercises',
    EXERCISE_DETAILS: 'Exercise Details',
    PLAYERS_PRACTICED_WITH: 'Players Practiced With',
    ADD_ANOTHER_PLAYER: 'Add Another Player',
    ADD_SESSION: 'Add Training Session',
    UPDATE_SESSION: 'Update Session',
    EDIT_SESSION: 'Edit Training Session',
  },
};

// Form Placeholders
export const PLACEHOLDERS = {
  PLAYER_NAME: 'Player name',
  OPPONENT_NAME: "Enter opponent's name",
  PARTNER_NAME: "Enter partner's name",
  DURATION: 'e.g., 30',
  SETS: '3',
  REPS: '15',
  WEIGHTS: 'Optional',
  NOTES: 'Match highlights, areas for improvement, etc.',
};

// Validation Messages
export const VALIDATION = {
  MIN_DURATION: 1,
  MIN_SETS: 1,
  MIN_REPS: 1,
  MIN_WEIGHTS: 0,
};
