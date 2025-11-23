export const TRAINING_SCHEDULE = {
  Monday: {
    day: 'Monday',
    activity: 'Drop and Dribble',
    icon: '🏸',
    color: 'primary',
    description: 'Focus on drop shots, dribble techniques, and lifting drills.',
    details: [
      'Drop and Dribble',
      'Lifting',
    ],
  },
  Tuesday: {
    day: 'Tuesday',
    activity: 'Smash',
    icon: '👟',
    color: 'success',
    description: 'Improve smash techniques, net play, and alternate smash drills.',
    details: [
      'Smash and Net',
      'Alternate Smash',
    ],
  },
  Wednesday: {
    day: 'Wednesday',
    activity: 'Defense',
    icon: '🥷',
    color: 'info',
    description: 'Focus on toss and defensive techniques, including alternate smash drills.',
    details: [
      'Defense',
      'Alternate Smash',
    ],
  },
  Thursday: {
    day: 'Thursday',
    activity: 'Toss',
    icon: '🛡️',
    color: 'warning',
    description: 'Practice toss and lift techniques to enhance gameplay.',
    details: [
      'Toss and Lift',
    ],
  },
  Friday: {
    day: 'Friday',
    activity: 'Full Court Attack',
    icon: '💥',
    color: 'danger',
    description: 'Engage in full court attacking drills to improve offensive play.',
    details: [
      'Full Court Attack',
    ],
  },
  Saturday: {
    day: 'Saturday',
    activity: 'Game Day',
    icon: '🎮',
    color: 'dark',
    description: 'Participate in match practice and competitive play.',
    details: [
      'Match Practice',
    ],
  },
};

export const DRILL_TYPES = [
  'Toss',
  'Smash',
  'Drop',
  'Lift',
  'Cross',
  'Straight',
];

export const SESSION_TYPES = [
  { value: 'on-court-drill', label: 'On-Court Drill', icon: '🏸' },
  { value: 'on-court-fitness', label: 'On-Court Fitness', icon: '💪' },
  { value: 'full-fitness', label: 'Full Fitness', icon: '🏋️' },
];

export const MATCH_TYPES = [
  'Singles',
  'Doubles',
];

export const FITNESS_EXERCISES = [
  { id: 1, name: 'Push-ups', category: 'Upper Body' },
  { id: 2, name: 'Squats', category: 'Lower Body' },
  { id: 3, name: 'Plank Hold', category: 'Core' },
  { id: 4, name: 'Burpees', category: 'Full Body' },
  { id: 5, name: 'Lunges', category: 'Lower Body' },
  { id: 6, name: 'Core Twists', category: 'Core' },
  { id: 7, name: 'Mountain Climbers', category: 'Full Body' },
  { id: 8, name: 'Jump Squats', category: 'Lower Body' },
  { id: 9, name: 'Pull-ups', category: 'Upper Body' },
  { id: 10, name: 'Sit-ups', category: 'Core' },
  { id: 11, name: 'High Knees', category: 'Cardio' },
  { id: 12, name: 'Wall Sit', category: 'Lower Body' },
];

export const getDayOfWeek = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
};

export const getCurrentDaySchedule = () => {
  const currentDay = getDayOfWeek();
  // Sunday maps to Monday's schedule
  if (currentDay === 'Sunday') {
    return TRAINING_SCHEDULE.Monday;
  }
  return TRAINING_SCHEDULE[currentDay] || TRAINING_SCHEDULE.Monday;
};
