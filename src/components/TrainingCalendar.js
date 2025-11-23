import React, { useState, useMemo, useEffect } from 'react';
import { Container, Card, Button, Badge, ListGroup, Row, Col, Spinner, Alert } from 'react-bootstrap';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { FaCalendar, FaDumbbell, FaUsers, FaEdit, FaTrash } from 'react-icons/fa';
import { TRAINING_SCHEDULE } from '../constants';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import 'react-calendar/dist/Calendar.css';

const TrainingCalendar = ({ onBack, onEditSession }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSession, setEditingSession] = useState(null);

  // Handler for editing session - navigate to the appropriate day
  const handleEditSession = (session) => {
    console.log('Editing session from calendar:', session);
    // Navigate to the training day for the session's day
    if (onEditSession) {
      onEditSession(session);
    }
  };

  // Load all sessions for the current user
  useEffect(() => {
    loadAllSessions();
  }, [user]);

  const loadAllSessions = async () => {
    try {
      setLoading(true);
      console.log('Loading sessions for user:', user?.name || 'Guest');
      const result = await api.sessions.getSessions({
        userName: user?.name || 'Guest'
      });
      console.log('Sessions loaded:', result.data);
      setAllSessions(result.data || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      setAllSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // Get sessions for selected date
  const getSessionsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return allSessions.filter(session => {
      // Handle ISO date strings from backend
      const sessionDate = session.date.includes('T') 
        ? format(new Date(session.date), 'yyyy-MM-dd')
        : session.date;
      return sessionDate === dateStr;
    });
  };

  // Mark dates that have sessions
  const tileClassName = ({ date }) => {
    const sessions = getSessionsForDate(date);
    if (sessions.length > 0) {
      return 'has-sessions';
    }
    return null;
  };

  const tileContent = ({ date }) => {
    const sessions = getSessionsForDate(date);
    if (sessions.length > 0) {
      return (
        <div className="calendar-session-indicator">
          <Badge bg="success" pill className="session-count">{sessions.length}</Badge>
        </div>
      );
    }
    return null;
  };

  // Disable Sundays - only allow training days (Mon-Sat)
  const tileDisabled = ({ date }) => {
    const dayOfWeek = date.getDay();
    // 0 = Sunday, disable it
    return dayOfWeek === 0;
  };

  const sessionsForSelectedDate = getSessionsForDate(selectedDate);

  const handleDeleteSession = async (session) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    
    try {
      await api.sessions.deleteSession(session._id || session.id);
      await loadAllSessions();
    } catch (error) {
      console.error('Failed to delete session:', error);
      alert('Failed to delete session');
    }
  };

  const getSessionTypeLabel = (sessionType) => {
    return sessionType === 'on-court' ? 'On-Court Session' : 'Fitness Session';
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading calendar...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Button variant="outline-secondary" onClick={onBack} className="mb-4">
        ← Back to Schedule
      </Button>

      {/* Debug info - remove after testing */}
      {process.env.NODE_ENV === 'development' && (
        <Alert variant="info" className="mb-3">
          <small>
            Debug: Loaded {allSessions.length} sessions for user: {user?.name || 'Guest'}
            {allSessions.length > 0 && (
              <div>Sample date: {allSessions[0].date}</div>
            )}
          </small>
        </Alert>
      )}

      <Card className="shadow-lg border-0 mb-4">
        <Card.Header className="bg-primary text-white">
          <h3 className="mb-0">
            <FaCalendar className="me-3" style={{ fontSize: '2rem' }} />
            Training Calendar & Progress Tracker
          </h3>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col lg={7} className="mb-4 mb-lg-0">
              <div className="calendar-wrapper">
                {console.log('Rendering calendar with date:', selectedDate)}
                <Calendar
                  onChange={(date) => {
                    console.log('Date selected:', date);
                    setSelectedDate(date);
                  }}
                  value={selectedDate}
                  tileClassName={tileClassName}
                  tileContent={tileContent}
                  tileDisabled={tileDisabled}
                  maxDate={new Date()}
                  locale="en-US"
                />
              </div>
              <div className="mt-3 text-center">
                <Badge bg="info" className="me-2">
                  <span className="badge-dot bg-success"></span> Days with sessions
                </Badge>
              </div>
            </Col>

            <Col lg={5}>
              <Card className="border-primary">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">
                    Sessions for {format(selectedDate, 'MMMM d, yyyy')}
                  </h5>
                </Card.Header>
                <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {sessionsForSelectedDate.length === 0 ? (
                    <div className="text-center text-muted py-5">
                      <FaCalendar size={48} className="mb-3 opacity-50" />
                      <p>No training sessions on this date</p>
                    </div>
                  ) : (
                    <ListGroup variant="flush">
                      {sessionsForSelectedDate.map((session) => (
                        <ListGroup.Item key={session._id || session.id} className="px-0">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6 className="mb-2 session-title">
                                {getSessionTypeLabel(session.sessionType)}
                              </h6>

                              {session.drillType && (
                                <div className="mb-2">
                                  <Badge bg="primary" className="me-2 drill-badge">
                                    {session.drillType}
                                  </Badge>
                                  <Badge bg="info">{session.duration} min</Badge>
                                  {session.players && session.players.length > 0 && (
                                    <div className="mt-2">
                                      <small className="text-muted player-names">
                                        <FaUsers className="me-1" />
                                        {session.players.join(', ')}
                                      </small>
                                    </div>
                                  )}
                                </div>
                              )}

                              {session.exercises && session.exercises.length > 0 && (
                                <div className="mt-2">
                                  <small className="fw-bold fitness-title">
                                    <FaDumbbell className="me-1" />
                                    Fitness:
                                  </small>
                                  {session.exercises.map((ex, idx) => (
                                    <div key={idx} className="mb-1 ms-3">
                                      <Badge bg="secondary" className="me-2 exercise-badge">
                                        {ex.name}
                                      </Badge>
                                      <span className="small exercise-details">
                                        {ex.sets}×{ex.reps}
                                        {ex.weights && ` • ${ex.weights}kg`}
                                        {ex.duration && ` • ${ex.duration} min`}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <small className="text-muted d-block mt-2">
                                Created: {session.createdAt ? new Date(session.createdAt).toLocaleString() : 'N/A'}
                              </small>
                            </div>
                            <div className="d-flex flex-column gap-1">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEditSession(session)}
                                title="Edit session"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteSession(session)}
                                title="Delete session"
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TrainingCalendar;
