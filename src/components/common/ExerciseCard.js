import React from 'react';
import { Card, Form, Badge, Col } from 'react-bootstrap';

const ExerciseCard = ({ exercise, isSelected, onToggle }) => {
  return (
    <Col xs={12} md={6} lg={4}>
      <Card 
        className={`exercise-select-card ${isSelected ? 'selected' : ''}`}
        onClick={onToggle}
        style={{ cursor: 'pointer' }}
      >
        <Card.Body className="p-3">
          <Form.Check
            type="checkbox"
            checked={isSelected}
            onChange={() => {}}
            label={
              <div>
                <strong className="exercise-name">{exercise.name}</strong>
                <div>
                  <Badge bg="secondary" className="small mt-1">{exercise.category}</Badge>
                </div>
              </div>
            }
          />
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ExerciseCard;
