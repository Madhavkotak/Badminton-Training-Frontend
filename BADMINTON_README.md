# 🏸 Badminton Training Manager

A comprehensive, mobile-responsive React application for managing badminton training with a structured 6-day weekly schedule, dark/light theme support, and professional match tracking.

![React](https://img.shields.io/badge/React-18.x-blue)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features Overview

### 🔐 Simple Authentication
- **Name-based login** - No passwords, just enter your name
- **Session persistence** - Stays logged in with localStorage
- **Beautiful welcome screen** with animated trophy icon

### 📅 6-Day Training Schedule
Fixed daily activities for structured training:
- **Monday** - Drop and Dribble 🏸
- **Tuesday** - Footwork Drills 👟
- **Wednesday** - Shadow Play 🥷
- **Thursday** - Defence and Toss 🛡️
- **Friday** - Smash and Cross Lift 💥
- **Saturday** - Game Day 🎮

### 🏋️ Training Day Features
- **Two Training Types:**
  - On-Court Training + Fitness
  - Fitness Only
- **Predefined Exercises** for each daily activity
- **Exercise Selection** with checkboxes
- **Custom Drill** option with notes
- **Session Tracking** with completion checkmarks
- **Exercise Progress** tracking

### 🎮 Game Day Features
- **Match Recording** with comprehensive details:
  - Match Type (Singles, Doubles, Mixed Doubles, Practice, Tournament)
  - Opponent name
  - Number of sets
  - Scores (yours and opponent's)
  - Match duration
  - Notes
- **Automatic Win/Loss/Draw** calculation
- **Match Statistics** dashboard
- **Match History** with full details

### 🎨 Theme Support
- **Light Theme** - Clean, professional appearance
- **Dark Theme** - Eye-friendly for night training
- **Smooth transitions** between themes
- **Persistent preference** saved in localStorage
- **One-click toggle** in navbar

### 📱 Mobile Responsive
- **Fully responsive** design
- **Touch-friendly** interface
- **Optimized** for mobile browsers
- **Adaptive layouts** for all screen sizes
- **Mobile-first** approach

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to project directory:**
   ```bash
   cd exercise-drill-manager
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 📱 Usage Guide

### Getting Started

1. **Login**
   - Enter your name on the welcome screen
   - Click "Start Training"
   - Your session is saved automatically

2. **View Weekly Schedule**
   - See all 6 days with assigned activities
   - Today's day is highlighted with a green badge
   - Click any day to view/add training

3. **Add Training (Monday-Friday)**
   - Select training type (On-Court + Fitness or Fitness Only)
   - Choose exercises from predefined list
   - Add custom drills if needed
   - Click "Add Training Session"
   - Track your progress with checkboxes

4. **Record Game Day (Saturday)**
   - Fill in match details
   - Enter scores and opponent
   - Add notes about the match
   - View match statistics
   - Review match history

5. **Toggle Theme**
   - Click sun/moon icon in navbar
   - Theme switches instantly
   - Preference is saved automatically

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Login.js              # Authentication component
│   ├── WeeklySchedule.js     # 6-day schedule view
│   ├── TrainingDay.js        # Training session management
│   └── GameDay.js            # Match recording & stats
├── context/
│   ├── ThemeContext.js       # Theme management
│   └── AuthContext.js        # User authentication
├── utils/
│   └── trainingData.js       # Schedule & exercise data
├── App.js                    # Main application
├── App.css                   # Comprehensive styling
└── index.js                  # Entry point
```

## 🎯 Daily Training Activities

### Monday - Drop and Dribble 🏸
- Drop Shot Practice (3×15, 20 min)
- Net Dribble Drill (3×20, 15 min)
- Cross-Net Drop (3×12, 18 min)
- Consecutive Dribbles (4×10, 15 min)

### Tuesday - Footwork Drills 👟
- Six-Point Footwork (4×10, 25 min)
- Ladder Drills (3×15, 20 min)
- Side-to-Side Movement (3×20, 15 min)
- Jump Rope (3×30, 10 min)

### Wednesday - Shadow Play 🥷
- Full Court Shadow (3×5, 30 min)
- Half Court Shadow (4×8, 20 min)
- Pattern Shadow Play (3×10, 25 min)
- Speed Shadow (4×6, 15 min)

### Thursday - Defence and Toss 🛡️
- Block Defense Drill (3×20, 20 min)
- Multi-Shuttle Defense (4×15, 25 min)
- Toss and Return (3×20, 18 min)
- Low Defense Drill (3×15, 20 min)

### Friday - Smash and Cross Lift 💥
- Power Smash Practice (3×15, 25 min)
- Cross-Court Lift (3×20, 20 min)
- Jump Smash Drill (4×10, 22 min)
- Consecutive Smashes (3×12, 18 min)

### Saturday - Game Day 🎮
- Match recording
- Performance tracking
- Statistics analysis

## 💪 Fitness Exercises

Available for all training days when "On-Court + Fitness" is selected:
- Push-ups (3×20)
- Squats (3×25)
- Plank Hold (3×1 min)
- Burpees (3×15)
- Lunges (3×20)
- Core Twists (3×30)
- Mountain Climbers (3×25)
- Jump Squats (3×15)

## 🎨 Theme Features

### Light Theme
- Clean white backgrounds
- Vibrant gradient accents
- Professional appearance
- High contrast for readability

### Dark Theme
- Dark backgrounds (#1a1a1a)
- Reduced eye strain
- Modern appearance
- Perfect for evening training

## 📊 Technical Stack

- **React 18** - Latest React with Hooks
- **React Bootstrap** - UI components
- **Bootstrap 5** - Responsive framework
- **React Icons** - Beautiful icons
- **Context API** - State management
- **localStorage** - Data persistence
- **CSS3** - Advanced styling with themes

## 🔧 Key Technologies

### State Management
- React Context API for theme and auth
- Local state with useState
- localStorage for persistence

### Responsive Design
- Mobile-first approach
- Flexbox layouts
- CSS Grid where appropriate
- Media queries for breakpoints

### Performance
- Lazy loading ready
- Optimized re-renders
- Efficient state updates
- Smooth animations

## 📱 Mobile Optimization

- Touch-friendly buttons (min 44×44px)
- Responsive font sizes
- Collapsible navbar
- Optimized card layouts
- Swipe-friendly interfaces
- Fast loading times

## 🎯 Data Structure

### Training Session
```javascript
{
  id: timestamp,
  date: ISO string,
  day: "Monday",
  activity: "Drop and Dribble",
  fitnessType: "On-Court Training + Fitness",
  exercises: [
    {
      id: number,
      name: string,
      sets: number,
      reps: number,
      duration: number,
      completed: boolean
    }
  ],
  customDrill: {
    name: string,
    duration: number,
    notes: string
  }
}
```

### Match Record
```javascript
{
  id: timestamp,
  date: ISO string,
  matchType: "Singles" | "Doubles" | "Mixed Doubles" | "Practice Match" | "Tournament",
  opponent: string,
  sets: number,
  myScore: number,
  opponentScore: number,
  duration: number,
  notes: string,
  result: "Win" | "Loss" | "Draw"
}
```

## 🚀 Future Enhancements

### Phase 1 - Data Persistence
- [ ] Backend API integration
- [ ] Database storage (MongoDB/PostgreSQL)
- [ ] Cloud sync across devices
- [ ] Export training data

### Phase 2 - Advanced Features
- [ ] Progress charts & graphs
- [ ] Training streak tracking
- [ ] Personal best records
- [ ] Training reminders
- [ ] Calendar integration

### Phase 3 - Social Features
- [ ] Coach dashboard
- [ ] Training partner matching
- [ ] Leaderboards
- [ ] Share achievements

### Phase 4 - Analytics
- [ ] Performance analytics
- [ ] Improvement suggestions
- [ ] Injury prevention tips
- [ ] Recovery tracking

## 🔒 Backend Integration Ready

The app is structured for easy backend integration:

```javascript
// Example API integration
const saveTrainingSession = async (session) => {
  const response = await fetch('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(session)
  });
  return response.json();
};
```

## 🎨 Customization

### Change Theme Colors
Edit CSS variables in `App.css`:
```css
:root {
  --primary-color: #0d6efd;
  --success-color: #198754;
  /* Add your colors */
}
```

### Add New Exercises
Edit `src/utils/trainingData.js`:
```javascript
export const PREDEFINED_EXERCISES = {
  'Your Activity': [
    { id: 1, name: 'Exercise Name', sets: 3, reps: 15, duration: 20 },
  ],
};
```

### Modify Training Days
Update `TRAINING_SCHEDULE` in `trainingData.js`

## 📝 Development

### Run Development Server
```bash
npm start
```

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

## 🐛 Known Issues

- Data is stored in localStorage (temporary)
- No data backup currently
- Single user mode

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 👨‍💻 Author

Built with ❤️ for badminton enthusiasts

## 🙏 Acknowledgments

- Bootstrap team for UI components
- React team for the framework
- Badminton community for inspiration

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Check existing documentation
- Review code comments

---

**🏸 Train Hard, Play Smart, Track Progress! 🏸**

**Start your badminton journey today!**
