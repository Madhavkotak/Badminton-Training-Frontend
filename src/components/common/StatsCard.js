import React from 'react';
import { Card, Col } from 'react-bootstrap';

const StatsCard = ({ value, label, bgColor = '', icon }) => {
  return (
    <Col xs={6} md={4}>
      <Card className={`text-center stats-card ${bgColor ? `bg-${bgColor} text-white` : ''}`}>
        <Card.Body>
          {icon && <div className="mb-2">{icon}</div>}
          <h3 className="mb-0">{value}</h3>
          <small className={bgColor ? '' : 'text-muted'}>{label}</small>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default StatsCard;
