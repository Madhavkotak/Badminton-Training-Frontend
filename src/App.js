import React, { useState } from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { FaMoon, FaSun, FaSignOutAlt, FaCalendar, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import WeeklySchedule from './components/WeeklySchedule';
import TrainingDay from './components/TrainingDay';
import GameDay from './components/GameDay';
import TrainingCalendar from './components/TrainingCalendar';
import ProgressAnalytics from './components/ProgressAnalytics';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function AppContent() {
  const [activeView, setActiveView] = useState('schedule');
  const [selectedDay, setSelectedDay] = useState(null);
  const [sessionToEdit, setSessionToEdit] = useState(null);
  const [navExpanded, setNavExpanded] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleSelectDay = (day) => {
    setSelectedDay(day);
    if (day === 'Saturday') {
      setActiveView('gameday');
    } else {
      setActiveView('training');
    }
    // Close navbar automatically on small/portrait screens for better UX
    try {
      if (window && window.innerWidth && window.innerWidth <= 768) {
        setNavExpanded(false);
      }
    } catch (err) {
      // ignore
    }
  };

  const handleBackToSchedule = () => {
    setActiveView('schedule');
    setSelectedDay(null);
    setSessionToEdit(null);
  };

  const handleEditSessionFromCalendar = (session) => {
    console.log('Navigating to edit session:', session);
    // Set the day from the session
    setSelectedDay(session.day);
    setSessionToEdit(session);
    setActiveView('training');
  };

  const renderView = () => {
    switch (activeView) {
      case 'training':
        return <TrainingDay selectedDay={selectedDay} onBack={handleBackToSchedule} sessionToEdit={sessionToEdit} />;
      case 'gameday':
        return <GameDay selectedDay={selectedDay} onBack={handleBackToSchedule} />;
      case 'calendar':
        return <TrainingCalendar onBack={handleBackToSchedule} onEditSession={handleEditSessionFromCalendar} />;
      case 'analytics':
        return <ProgressAnalytics onBack={handleBackToSchedule} />;
      case 'schedule':
      default:
        return <WeeklySchedule onSelectDay={handleSelectDay} />;
    }
  };

  return (
    <div className="App">
      <Navbar bg={theme === 'dark' ? 'dark' : 'light'} variant={theme} expand="lg" expanded={navExpanded} onToggle={(val) => setNavExpanded(val)} className="shadow-sm sticky-top">
        <Container>
          <Navbar.Brand onClick={() => setActiveView('schedule')} style={{ cursor: 'pointer' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-trophy me-2" viewBox="0 0 16 16">
              <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935zM3.504 1c.007.517.026 1.006.056 1.469.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7 10a.5.5 0 0 1 .5.5v2.61a1 1 0 0 1-.757.97l-1.426.356a.5.5 0 0 0-.179.085L4.5 15h7l-.638-.479a.501.501 0 0 0-.18-.085l-1.425-.356a1 1 0 0 1-.757-.97V10.5A.5.5 0 0 1 9 10c.516 0 1.706-.52 2.57-2.864.413-1.12.74-2.64.87-4.667.03-.463.049-.952.056-1.469H3.504z"/>
            </svg>
            Badminton Training
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link onClick={() => { setActiveView('schedule'); setNavExpanded(false); }}>
                <FaCalendar className="me-1" />
                Schedule
              </Nav.Link>
              <Nav.Link onClick={() => { setActiveView('calendar'); setNavExpanded(false); }}>
                <FaCalendarAlt className="me-1" />
                Calendar
              </Nav.Link>
              <Nav.Link onClick={() => { setActiveView('analytics'); setNavExpanded(false); }}>
                <FaChartLine className="me-1" />
                Analytics
              </Nav.Link>
              <div className="d-flex align-items-center ms-3">
                <span className="me-3 text-muted">Welcome, {user?.name}!</span>
                <Button
                  variant={theme === 'dark' ? 'outline-light' : 'outline-dark'}
                  size="sm"
                  onClick={toggleTheme}
                  className="me-2"
                  title="Toggle theme"
                >
                  {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </Button>
                <Button variant="outline-danger" size="sm" onClick={logout}>
                  <FaSignOutAlt className="me-1" />
                  Logout
                </Button>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="main-content pb-5">
        {renderView()}
      </main>

      <footer className={`py-3 mt-5 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
        <Container className="text-center">
          <p className="mb-0">&copy; 2025 Badminton Training Manager. Train Hard, Play Smart.</p>
        </Container>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppWrapper />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppWrapper() {
  const { user } = useAuth();
  
  if (!user) {
    return <Login />;
  }
  
  return <AppContent />;
}

export default App;
