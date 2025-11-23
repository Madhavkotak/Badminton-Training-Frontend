import React from 'react';
import { Card, ListGroup, Badge, Button, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUsers } from 'react-icons/fa';
import { format } from 'date-fns';
import { SESSION_TYPE_OPTIONS } from '../constants';

const SessionList = ({ sessions, selectedDate, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <Card className="shadow-lg border-0">
        <Card.Body className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading sessions...</p>
        </Card.Body>
      </Card>
    );
  }

  if (sessions.length === 0) return null;

  const getSessionTypeLabel = (type) => {
    const sessionTypeObj = SESSION_TYPE_OPTIONS.find(st => st.value === type);
    return sessionTypeObj ? sessionTypeObj.label : type;
  };

  return (
    <Card className="shadow-lg border-0">
      <Card.Header className="bg-success text-white">
        <h4 className="mb-0">Sessions for {format(new Date(selectedDate), 'MMMM d, yyyy')}</h4>
      </Card.Header>
      <Card.Body className="p-0">
        <ListGroup variant="flush">
          {sessions.map((session) => (
            <ListGroup.Item key={session._id || session.id} className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h5 className="mb-2 session-title">
                    {getSessionTypeLabel(session.sessionType)}
                  </h5>

                  {session.drillType && (
                    <div className="mb-2">
                      <Badge bg="primary" className="me-2 drill-badge">{session.drillType}</Badge>
                      <Badge bg="info">{session.duration} minutes</Badge>
                      {session.players && session.players.length > 0 && (
                        <div className="mt-2">
                          <small className="text-muted player-names">
                            <FaUsers className="me-1" />
                            Played with: {session.players.join(', ')}
                          </small>
                        </div>
                      )}
                    </div>
                  )}

                  {session.exercises && session.exercises.length > 0 && (
                    <div className="mt-2">
                      <strong className="fitness-title">Fitness Exercises:</strong>
                      {session.exercises.map((ex, idx) => {
                        const exerciseName = ex.exercise?.name || ex.name || 'Exercise';
                        return (
                          <div key={idx} className="mb-1 mt-1">
                            <Badge bg="secondary" className="me-2 exercise-badge">{exerciseName}</Badge>
                            <span className="small exercise-details">
                              {ex.sets}×{ex.reps}
                              {ex.weights && ` • ${ex.weights}kg`}
                              {ex.duration && ` • ${ex.duration} min`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <small className="text-muted d-block mt-2">
                    Added: {new Date(session.createdAt || session.timestamp).toLocaleString()}
                  </small>
                </div>
                <div className="d-flex flex-column gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => onEdit(session)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDelete(session._id || session.id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default SessionList;
