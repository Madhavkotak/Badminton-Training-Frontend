import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import { PLACEHOLDERS, VALIDATION } from '../../constants';

const ExerciseDetailCard = ({ exercise, details, onChange }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <h6 className="mb-3 exercise-name">{exercise.name}</h6>
        <Row>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="small">Sets *</Form.Label>
              <Form.Control
                type="number"
                placeholder={PLACEHOLDERS.SETS}
                min={VALIDATION.MIN_SETS}
                value={details?.sets || ''}
                onChange={(e) => onChange('sets', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="small">Reps *</Form.Label>
              <Form.Control
                type="number"
                placeholder={PLACEHOLDERS.REPS}
                min={VALIDATION.MIN_REPS}
                value={details?.reps || ''}
                onChange={(e) => onChange('reps', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="small">Weights (kg)</Form.Label>
              <Form.Control
                type="number"
                placeholder={PLACEHOLDERS.WEIGHTS}
                min={VALIDATION.MIN_WEIGHTS}
                step="0.5"
                value={details?.weights || ''}
                onChange={(e) => onChange('weights', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="small">Duration (min)</Form.Label>
              <Form.Control
                type="number"
                placeholder={PLACEHOLDERS.WEIGHTS}
                min={VALIDATION.MIN_DURATION}
                value={details?.duration || ''}
                onChange={(e) => onChange('duration', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ExerciseDetailCard;
