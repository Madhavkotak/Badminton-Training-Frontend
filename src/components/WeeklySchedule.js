import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { TRAINING_SCHEDULE, getDayOfWeek } from '../utils/trainingData';

const WeeklySchedule = ({ onSelectDay }) => {
  const currentDay = getDayOfWeek();
  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <Container className="mt-4">
      <div className="text-center mb-4">
        <h2 className="fw-bold">Weekly Training Schedule</h2>
        <p className="text-muted">Select a day to view and add training activities</p>
      </div>

      <Row className="g-4">
        {daysOrder.map((day) => {
          const schedule = TRAINING_SCHEDULE[day];
          const isToday = currentDay === day || (currentDay === 'Sunday' && day === 'Monday');
          
          return (
            <Col key={day} xs={12} sm={6} md={4} lg={4}>
              <Card 
                className={`schedule-card h-100 ${isToday ? 'today-card' : ''}`}
                onClick={() => onSelectDay(day)}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="text-center p-4">
                  {isToday && (
                    <Badge bg="success" className="mb-2">Today</Badge>
                  )}
                  <div className="schedule-icon mb-3" style={{ fontSize: '3rem' }}>
                    {schedule.icon}
                  </div>
                  <h5 className="fw-bold mb-2">{schedule.day}</h5>
                  <Badge bg={schedule.color} className="mb-3 px-3 py-2" style={{ fontSize: '0.9rem' }}>
                    {schedule.activity}
                  </Badge>
                  <p className="text-muted small mb-0">
                    {schedule.description}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default WeeklySchedule;
