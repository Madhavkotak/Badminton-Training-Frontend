import React from 'react';
import { Card, Col } from 'react-bootstrap';

const SessionTypeCard = ({ type, isSelected, onClick }) => {
  return (
    <Col xs={12} md={6} className="mb-3">
      <Card 
        className={`session-type-card ${isSelected ? 'selected' : ''}`}
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      >
        <Card.Body className="text-center p-4">
          <div style={{ fontSize: '3rem' }} className="mb-2">{type.icon}</div>
          <h5 className="mb-0">{type.label}</h5>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default SessionTypeCard;
