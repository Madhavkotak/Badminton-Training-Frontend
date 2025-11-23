import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Alert, Modal, Spinner } from 'react-bootstrap';
import { FaPlus, FaCheck, FaDumbbell, FaRunning, FaCalendar } from 'react-icons/fa';
import { format } from 'date-fns';
import { 
  TRAINING_SCHEDULE, 
  SESSION_TYPES,
  SESSION_TYPE_OPTIONS,
  MESSAGES,
  PLACEHOLDERS 
} from '../constants';
import { 
  SessionTypeCard, 
  ExerciseCard, 
  ExerciseDetailCard, 
  PlayersList 
} from './common';
import SessionList from './SessionList';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const TrainingDay = ({ selectedDay, onBack, sessionToEdit }) => {
  const { user } = useAuth();
  const schedule = TRAINING_SCHEDULE[selectedDay];
  
  // Helper function to get a valid training date (not Sunday)
  const getValidTrainingDate = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // If today is Sunday (0), default to tomorrow (Monday)
    if (dayOfWeek === 0) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return format(tomorrow, 'yyyy-MM-dd');
    }
    
    return format(today, 'yyyy-MM-dd');
  };
  
  // Data from backend
  const [drills, setDrills] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [players, setPlayers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(getValidTrainingDate());
  const [sessionType, setSessionType] = useState('');
  
  // Handler for date change with validation
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    const dateObj = new Date(newDate + 'T00:00:00'); // Parse as local date
    const dayOfWeek = dateObj.getDay();
    
    // Map day names to day numbers (0 = Sunday, 1 = Monday, etc.)
    const dayNameToNumber = {
      'Sunday': 0,
      'Monday': 1,
      'Tuesday': 2,
      'Wednesday': 3,
      'Thursday': 4,
      'Friday': 5,
      'Saturday': 6
    };
    
    const expectedDayNumber = dayNameToNumber[selectedDay];
    
    // Prevent Sunday (0) selection
    if (dayOfWeek === 0) {
      alert('Sundays are rest days and cannot be selected for training sessions.');
      return;
    }
    
    // Check if selected date matches the expected day of week
    if (dayOfWeek !== expectedDayNumber) {
      alert(`Please select a ${selectedDay} date. The selected date is a ${Object.keys(dayNameToNumber).find(key => dayNameToNumber[key] === dayOfWeek)}.`);
      return;
    }
    
    setSelectedDate(newDate);
  };
  
  // On-Court state
  const [drillType, setDrillType] = useState('');
  const [drillDuration, setDrillDuration] = useState('');
  const [playersWithMe, setPlayersWithMe] = useState(['']);

  // Fitness state
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exerciseDetails, setExerciseDetails] = useState({});
  
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Load drills and exercises on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load sessions when date, day, or user changes
  useEffect(() => {
    if (!dataLoading && user) {
      loadSessions();
    }
  }, [selectedDay, selectedDate, dataLoading, user]);

  // Handle sessionToEdit from calendar
  useEffect(() => {
    if (sessionToEdit && exercises.length > 0 && drills.length > 0) {
      console.log('Auto-opening edit modal for session:', sessionToEdit);
      handleEditSession(sessionToEdit);
    }
  }, [sessionToEdit, exercises, drills]);

  const loadInitialData = async () => {
    try {
      setDataLoading(true);
      const [drillsResult, exercisesResult, playersResult] = await Promise.all([
        api.drills.getDrills(),
        api.exercises.getExercises(),
        api.players.getPlayers()
      ]);
      setDrills(drillsResult.data || []);
      setExercises(exercisesResult.data || []);
      setPlayers(playersResult.data || []);
    } catch (error) {
      console.error('Failed to load initial data:', error);
      alert('Failed to load drills, exercises, and players. Please check backend connection.');
    } finally {
      setDataLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
        console.log("loading session")
      setLoading(true);
      const result = await api.sessions.getSessions({
        day: selectedDay,
        startDate: selectedDate,
        endDate: selectedDate,
        userName: user?.name || 'Guest'
      });
      console.log("sessions fetched from database",result);
      setSessions(result.data || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const validateSession = () => {
    const newErrors = {};
    
    if (!sessionType) {
      newErrors.sessionType = MESSAGES.ERROR.SESSION_TYPE_REQUIRED;
    }

    // On-Court validation
    if (sessionType === SESSION_TYPES.ON_COURT) {
      if (!drillType) newErrors.drillType = MESSAGES.ERROR.DRILL_TYPE_REQUIRED;
      if (!drillDuration || drillDuration <= 0) newErrors.drillDuration = MESSAGES.ERROR.DURATION_REQUIRED;
      
      const validPlayers = playersWithMe.filter(p => p.trim() !== '');
      if (validPlayers.length === 0) {
        newErrors.players = MESSAGES.ERROR.PLAYERS_REQUIRED;
      }
    }

    // Fitness validation (for both fitness-only and on-court with fitness)
    if (sessionType === SESSION_TYPES.FITNESS) {
      if (selectedExercises.length === 0) {
        newErrors.exercises = MESSAGES.ERROR.EXERCISES_REQUIRED;
      }
      
      const missingDetails = selectedExercises.some(exId => {
        const details = exerciseDetails[exId];
        return !details || !details.sets || !details.reps;
      });
      
      if (missingDetails) {
        newErrors.details = MESSAGES.ERROR.EXERCISE_DETAILS_REQUIRED;
      }
    }

    // For on-court sessions with exercises, validate exercise details if any are selected
    if (sessionType === SESSION_TYPES.ON_COURT && selectedExercises.length > 0) {
      const missingDetails = selectedExercises.some(exId => {
        const details = exerciseDetails[exId];
        return !details || !details.sets || !details.reps;
      });
      
      if (missingDetails) {
        newErrors.details = MESSAGES.ERROR.EXERCISE_DETAILS_REQUIRED;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildSessionData = () => {
    const baseSession = {
      date: selectedDate,
      day: selectedDay,
      sessionType,
      userName: user?.name || 'Guest',
    };

    if (sessionType === SESSION_TYPES.ON_COURT) {
      // Find the drill by its type to get the ObjectId
      const selectedDrill = drills.find(d => d.type === drillType);
      if (selectedDrill) {
        baseSession.drill = selectedDrill._id;
      }
      baseSession.drillType = drillType;
      baseSession.duration = parseInt(drillDuration);
      baseSession.players = playersWithMe.filter(p => p.trim() !== '');
    }

    if (selectedExercises.length > 0) {
      baseSession.exercises = selectedExercises.map(exId => {
        const exercise = exercises.find(e => e._id === exId);
        const details = exerciseDetails[exId];
        return {
          exercise: exId,
          sets: parseInt(details.sets),
          reps: parseInt(details.reps),
          weights: details.weights ? parseFloat(details.weights) : undefined,
          duration: details.duration ? parseInt(details.duration) : undefined,
        };
      });
    }

    return baseSession;
  };

  const handleAddSession = async () => {

    if (!validateSession()) return;

    setLoading(true);
    try {
      const sessionData = buildSessionData();
      await api.sessions.createSession(sessionData);
      await loadSessions();
      resetForm();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
        console.log("in handle add session")

    } catch (error) {
      console.error('Failed to create session:', error);
      alert(error.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSession = async () => {
    if (!validateSession()) return;

    setLoading(true);
    try {
      const sessionData = buildSessionData();
      await api.sessions.updateSession(editingSession._id, sessionData);
      await loadSessions();
      setShowEditModal(false);
      setEditingSession(null);
      resetForm();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update session:', error);
      alert(error.message || 'Failed to update session');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSessionType('');
    setDrillType('');
    setDrillDuration('');
    setPlayersWithMe(['']);
    setSelectedExercises([]);
    setExerciseDetails({});
    setErrors({});
  };

  const handleEditSession = (session) => {
    console.log("Edited session:", session);
    setEditingSession(session);
    setSessionType(session.sessionType);
    
    if (session.drillType) {
      setDrillType(session.drillType);
      setDrillDuration(session.duration.toString());
      setPlayersWithMe(session.players && session.players.length > 0 ? session.players : ['']);
    }
    
    if (session.exercises && session.exercises.length > 0) {
      // Safely extract exercise IDs, filtering out null/undefined entries
      const exerciseIds = session.exercises
        .filter(ex => ex && (ex.exercise || ex._id))
        .map(ex => {
          if (typeof ex.exercise === 'object' && ex.exercise !== null) {
            return ex.exercise._id;
          } else if (typeof ex.exercise === 'string') {
            return ex.exercise;
          } else if (ex._id) {
            return ex._id;
          }
          return null;
        })
        .filter(id => id !== null);
      
      setSelectedExercises(exerciseIds);
      
      const details = {};
      session.exercises.forEach(ex => {
        if (!ex || (!ex.exercise && !ex._id)) return;
        
        let exerciseId;
        if (typeof ex.exercise === 'object' && ex.exercise !== null) {
          exerciseId = ex.exercise._id;
        } else if (typeof ex.exercise === 'string') {
          exerciseId = ex.exercise;
        } else if (ex._id) {
          exerciseId = ex._id;
        }
        
        if (exerciseId) {
          details[exerciseId] = {
            sets: ex.sets ? ex.sets.toString() : '',
            reps: ex.reps ? ex.reps.toString() : '',
            weights: ex.weights ? ex.weights.toString() : '',
            duration: ex.duration ? ex.duration.toString() : '',
          };
        }
      });
      setExerciseDetails(details);
    }
    
    setShowEditModal(true);
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;

    setLoading(true);
    try {
      await api.sessions.deleteSession(sessionId);
      await loadSessions();
    } catch (error) {
      console.error('Failed to delete session:', error);
      alert(error.message || 'Failed to delete session');
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseToggle = (exerciseId) => {
    setSelectedExercises(prev => {
      if (prev.includes(exerciseId)) {
        const newDetails = { ...exerciseDetails };
        delete newDetails[exerciseId];
        setExerciseDetails(newDetails);
        return prev.filter(id => id !== exerciseId);
      }
      // Initialize details with empty values when adding an exercise
      setExerciseDetails(prevDetails => ({
        ...prevDetails,
        [exerciseId]: prevDetails[exerciseId] || {
          sets: '',
          reps: '',
          weights: '',
          duration: '',
        }
      }));
      return [...prev, exerciseId];
    });
  };

  const handleExerciseDetailChange = (exerciseId, field, value) => {
    setExerciseDetails(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: value,
      },
    }));
  };

  const getTodaySessions = () => {
    console.log("inside getToday Sessions", sessions);
    console.log("selectedDate", selectedDate);
    return sessions.filter(s => {
      const sessionDate = format(new Date(s.date), 'yyyy-MM-dd');
      console.log("comparing", sessionDate, "with", selectedDate);
      return sessionDate === selectedDate;
    });
  };

  const renderSessionForm = () => (
    <>
      {/* Session Type Selection */}
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">Select Session Type *</Form.Label>
        <Row>
          {SESSION_TYPE_OPTIONS.map((type) => (
            <SessionTypeCard
              key={type.value}
              type={type}
              isSelected={sessionType === type.value}
              onClick={() => {
                setSessionType(type.value);
                setErrors({});
              }}
            />
          ))}
        </Row>
        {errors.sessionType && <div className="text-danger small mt-2">{errors.sessionType}</div>}
      </Form.Group>

      {/* On-Court Section */}
      {sessionType === SESSION_TYPES.ON_COURT && (
        <Card className="mb-4 border-primary">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">
              <FaRunning className="me-2" />
              {MESSAGES.LABELS.DRILL_DETAILS}
            </h5>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Drill Type *</Form.Label>
              <Form.Select
                value={drillType}
                onChange={(e) => {
                  setDrillType(e.target.value);
                  setErrors({});
                }}
                isInvalid={!!errors.drillType}
              >
                <option value="">Choose a drill...</option>
                {drills.map((drill) => (
                  <option key={drill._id} value={drill.type}>{drill.name}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.drillType}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Duration (minutes) *</Form.Label>
              <Form.Control
                type="number"
                placeholder={PLACEHOLDERS.DURATION}
                value={drillDuration}
                onChange={(e) => {
                  setDrillDuration(e.target.value);
                  setErrors({});
                }}
                isInvalid={!!errors.drillDuration}
                min="1"
              />
              <Form.Control.Feedback type="invalid">
                {errors.drillDuration}
              </Form.Control.Feedback>
            </Form.Group>

            <PlayersList
              players={playersWithMe}
              availablePlayers={players}
              currentUser={user?.name}
              onChange={(index, value) => {
                const updated = [...playersWithMe];
                updated[index] = value;
                setPlayersWithMe(updated);
              }}
              onAdd={() => setPlayersWithMe([...playersWithMe, ''])}
              onRemove={(index) => {
                if (playersWithMe.length > 1) {
                  setPlayersWithMe(playersWithMe.filter((_, i) => i !== index));
                }
              }}
              error={errors.players}
            />
          </Card.Body>
        </Card>
      )}

      {/* Fitness Section */}
      {(sessionType === SESSION_TYPES.FITNESS || sessionType === SESSION_TYPES.ON_COURT) && (
        <Card className="mb-4 border-success">
          <Card.Header className="bg-success text-white">
            <h5 className="mb-0">
              <FaDumbbell className="me-2" />
              {MESSAGES.LABELS.FITNESS_EXERCISES}
              {sessionType === SESSION_TYPES.ON_COURT && (
                <small className="ms-2">(Optional)</small>
              )}
            </h5>
          </Card.Header>
          <Card.Body>
            {errors.exercises && <Alert variant="danger">{errors.exercises}</Alert>}
            {errors.details && <Alert variant="danger">{errors.details}</Alert>}

            <h6 className="fw-bold mb-3">
              {MESSAGES.LABELS.SELECT_EXERCISES}
              {sessionType === SESSION_TYPES.FITNESS && ' *'}
            </h6>
            <Row className="g-3 mb-4">
              {exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise._id}
                  exercise={exercise}
                  isSelected={selectedExercises.includes(exercise._id)}
                  onToggle={() => handleExerciseToggle(exercise._id)}
                />
              ))}
            </Row>

            {selectedExercises.length > 0 && (
              <>
                <h6 className="fw-bold mb-3">{MESSAGES.LABELS.EXERCISE_DETAILS}</h6>
                {selectedExercises.map(exId => {
                  const exercise = exercises.find(e => e._id === exId);
                  // Skip if exercise not found
                  if (!exercise) {
                    console.warn(`Exercise with ID ${exId} not found`);
                    return null;
                  }
                  return (
                    <ExerciseDetailCard
                      key={exId}
                      exercise={exercise}
                      details={exerciseDetails[exId]}
                      onChange={(field, value) => handleExerciseDetailChange(exId, field, value)}
                    />
                  );
                }).filter(Boolean)}
              </>
            )}
          </Card.Body>
        </Card>
      )}
    </>
  );

  return (
    <Container className="mt-4">
      <Button variant="outline-secondary" onClick={onBack} className="mb-4">
        ← Back to Schedule
      </Button>

      {dataLoading ? (
        <Card className="shadow-lg border-0 mb-4">
          <Card.Body className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading drills and exercises...</p>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Card className="shadow-lg border-0 mb-4">
            <Card.Header className={`bg-${schedule.color} text-white`}>
              <h3 className="mb-0">
                <span className="me-3" style={{ fontSize: '2rem' }}>{schedule.icon}</span>
                {schedule.day} - {schedule.activity}
              </h3>
            </Card.Header>
            <Card.Body>
              <p className="lead mb-4">{schedule.description}</p>

              {showSuccess && (
                <Alert variant="success" dismissible onClose={() => setShowSuccess(false)}>
                  <FaCheck className="me-2" />
                  {MESSAGES.SUCCESS.SESSION_ADDED}
                </Alert>
              )}

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">
              <FaCalendar className="me-2" />
              Select Training Date
            </Form.Label>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              max={format(new Date(), 'yyyy-MM-dd')}
            />
            <Form.Text className="text-muted">
              Only {selectedDay} dates can be selected (Sundays are rest days)
            </Form.Text>
          </Form.Group>

          {renderSessionForm()}

          {sessionType && (
            <div className="d-grid">
              <Button 
                variant={schedule.color} 
                size="lg" 
                onClick={handleAddSession}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaPlus className="me-2" />
                    {MESSAGES.LABELS.ADD_SESSION}
                  </>
                )}
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      <SessionList
        sessions={getTodaySessions()}
        selectedDate={selectedDate}
        onEdit={handleEditSession}
        onDelete={handleDeleteSession}
        loading={loading}
      />

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{MESSAGES.LABELS.EDIT_SESSION}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">
              <FaCalendar className="me-2" />
              Select Training Date
            </Form.Label>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              max={format(new Date(), 'yyyy-MM-dd')}
            />
            <Form.Text className="text-muted">
              Only {selectedDay} dates can be selected (Sundays are rest days)
            </Form.Text>
          </Form.Group>
          {renderSessionForm()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowEditModal(false);
            setEditingSession(null);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateSession} disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              MESSAGES.LABELS.UPDATE_SESSION
            )}
          </Button>
        </Modal.Footer>
      </Modal>
        </>
      )}
    </Container>
  );
};

export default TrainingDay;
