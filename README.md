# Exercise & Drill Manager

A comprehensive React application for managing training exercises and drills with a user-friendly interface built with Bootstrap.

## Features

### Main Menu
- Beautiful landing page with two main options: **Add Exercise** and **Add Drill**
- Responsive navigation bar with easy access to all sections
- Modern, visually appealing design with gradient backgrounds and hover effects

### Exercise Management
- **Add Exercises** with the following fields:
  - Exercise Name (text input)
  - Duration (numeric input in minutes)
  - Sets (numeric input)
  - Repetitions (numeric input)
  - Weight (numeric input in kg)
- **Form Validation**: All fields are required with appropriate error messages
- **Exercise List**: Displays all added exercises with badges showing details
- **Edit Functionality**: Click "Edit" to modify existing exercises inline
- **Delete Functionality**: Remove exercises with a single click
- Real-time form validation feedback

### Drill Management
- **Add Drills** with the following fields:
  - Drill Type (dropdown with options: Temp 1, Temp 2, Temp 3, Temp 4)
  - Duration (numeric input in minutes)
  - Players (multi-select dropdown for selecting multiple players)
- **Form Validation**: Ensures all fields are filled and at least one player is selected
- **Drill List**: Displays all added drills with player information
- **Edit Functionality**: Modify existing drills with inline editing
- **Delete Functionality**: Remove drills easily
- Mock player data simulating logged-in users

## Technologies Used

- **React 18**: Modern React with Hooks (useState)
- **Bootstrap 5**: Responsive styling framework
- **React-Bootstrap**: Bootstrap components for React
- **React-Icons**: Icon library for UI elements
- **CSS3**: Custom styling with animations and transitions

## Installation & Setup

1. Navigate to the project directory:
   ```bash
   cd exercise-drill-manager
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Project Structure

```
exercise-drill-manager/
├── public/
├── src/
│   ├── components/
│   │   ├── AddExercise.js    # Exercise management component
│   │   └── AddDrill.js        # Drill management component
│   ├── App.js                 # Main application component
│   ├── App.css                # Custom styling
│   └── index.js               # Entry point
├── package.json
└── README.md
```

## Component Details

### AddExercise Component
- Manages exercise state with React Hooks
- Implements comprehensive form validation
- Provides CRUD operations (Create, Read, Update, Delete)
- Uses Bootstrap cards and forms for UI
- Shows real-time validation feedback

### AddDrill Component
- Manages drill state with React Hooks
- Implements dropdown and multi-select functionality
- Includes mock player data (8 sample players)
- Provides CRUD operations for drills
- Displays selected players as badges

### App Component
- Main navigation and routing logic
- View state management (menu, exercise, drill)
- Responsive navbar with Bootstrap
- Footer section
- Renders appropriate component based on selected view

## Features in Detail

### Form Validation
- **Exercise Form**:
  - Name: Required, non-empty string
  - Duration: Required, must be greater than 0
  - Sets: Required, must be greater than 0
  - Repetitions: Required, must be greater than 0
  - Weight: Required, must be 0 or greater

- **Drill Form**:
  - Drill Type: Required, must select from dropdown
  - Duration: Required, must be greater than 0
  - Players: Required, at least one player must be selected

### UI/UX Features
- Smooth animations and transitions
- Hover effects on cards and buttons
- Color-coded badges for different data types
- Responsive design for mobile and desktop
- Clear visual feedback for form errors
- Loading states and user confirmations

## Customization

### Adding More Drill Types
Edit `AddDrill.js` and modify the `drillTypes` array:
```javascript
const drillTypes = ['Temp 1', 'Temp 2', 'Temp 3', 'Temp 4', 'New Type'];
```

### Adding More Players
Edit `AddDrill.js` and modify the `availablePlayers` array:
```javascript
const availablePlayers = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  // Add more players here
];
```

### Customizing Styles
- Modify `App.css` for global styles
- Edit Bootstrap variant props in components for color schemes
- Adjust gradient backgrounds in CSS

## Future Enhancements

Potential features for future development:
- Local storage persistence for exercises and drills
- Backend integration with REST API
- User authentication and authorization
- Export data to CSV/PDF
- Advanced filtering and search functionality
- Statistics and analytics dashboard
- Calendar view for scheduled drills
- Team management features
- Progress tracking over time

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available for personal and educational use.

## Author

Built with ❤️ using React and Bootstrap

---

For any questions or support, please create an issue in the repository.

