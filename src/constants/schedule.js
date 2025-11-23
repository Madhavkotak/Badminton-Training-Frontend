// Training Schedule
export const TRAINING_SCHEDULE = {
  Monday: {
    day: 'Monday',
    activity: 'Drop and Dribble',
    icon: '🏸',
    color: 'primary',
    description: 'Focus on drop shots, dribble techniques, and lifting drills.',
    details: [
      'Drop and Dribble',
      'Lifting ',
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
      'Toss anf Lift'
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

export const getDayOfWeek = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
};
