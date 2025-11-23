import React, { useState, useMemo, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaChartLine, FaCalendar, FaFire, FaDumbbell, FaRunning, FaTrophy } from 'react-icons/fa';
import { format, parseISO, subDays, isAfter, isBefore } from 'date-fns';
import { TRAINING_SCHEDULE, DRILL_TYPES } from '../utils/trainingData';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProgressAnalytics = ({ onBack }) => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  });
  const [selectedDrill, setSelectedDrill] = useState('all');
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all sessions for the current user
  useEffect(() => {
    loadAllSessions();
  }, [user]);

  const loadAllSessions = async () => {
    try {
      setLoading(true);
      const result = await api.sessions.getSessions({
        userName: user?.name || 'Guest'
      });
      setAllSessions(result.data || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      setAllSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter sessions by date range
  const filteredSessions = useMemo(() => {
    return allSessions.filter(session => {
      const sessionDate = parseISO(session.date);
      const startDate = parseISO(dateRange.start);
      const endDate = parseISO(dateRange.end);
      return (isAfter(sessionDate, startDate) || session.date === dateRange.start) && 
             (isBefore(sessionDate, endDate) || session.date === dateRange.end);
    });
  }, [allSessions, dateRange]);

  // Calculate drill duration data over time
  const drillDurationData = useMemo(() => {
    const onCourtSessions = filteredSessions.filter(s => s.sessionType === 'on-court');
    
    if (selectedDrill !== 'all') {
      const filtered = onCourtSessions.filter(s => s.drillType === selectedDrill);
      return filtered.map(s => ({
        date: format(parseISO(s.date), 'MMM dd'),
        duration: s.duration,
        drillType: s.drillType,
      })).sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    return onCourtSessions.map(s => ({
      date: format(parseISO(s.date), 'MMM dd'),
      duration: s.duration,
      drillType: s.drillType,
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredSessions, selectedDrill]);

  // Calculate drill type distribution
  const drillDistribution = useMemo(() => {
    const onCourtSessions = filteredSessions.filter(s => s.sessionType === 'on-court');
    const distribution = {};
    
    onCourtSessions.forEach(session => {
      distribution[session.drillType] = (distribution[session.drillType] || 0) + 1;
    });
    
    return Object.entries(distribution).map(([drill, count]) => ({
      name: drill,
      value: count,
    }));
  }, [filteredSessions]);

  // Calculate fitness session frequency
  const fitnessFrequency = useMemo(() => {
    const fitnessSessions = filteredSessions.filter(s => s.sessionType === 'fitness');
    const byDate = {};
    
    fitnessSessions.forEach(session => {
      const date = format(parseISO(session.date), 'MMM dd');
      byDate[date] = (byDate[date] || 0) + 1;
    });
    
    return Object.entries(byDate).map(([date, count]) => ({
      date,
      sessions: count,
    }));
  }, [filteredSessions]);

  // Calculate training consistency (days with both sessions)
  const trainingConsistency = useMemo(() => {
    const dateMap = {};
    
    filteredSessions.forEach(session => {
      if (!dateMap[session.date]) {
        dateMap[session.date] = { onCourt: false, fitness: false };
      }
      if (session.sessionType === 'on-court') {
        dateMap[session.date].onCourt = true;
      } else if (session.sessionType === 'fitness') {
        dateMap[session.date].fitness = true;
      }
    });
    
    const complete = Object.values(dateMap).filter(d => d.onCourt && d.fitness).length;
    const partial = Object.values(dateMap).filter(d => d.onCourt !== d.fitness).length;
    const total = Object.keys(dateMap).length;
    
    return { complete, partial, total };
  }, [filteredSessions]);

  // Stats summary
  const stats = useMemo(() => {
    const onCourtSessions = filteredSessions.filter(s => s.sessionType === 'on-court');
    const fitnessSessions = filteredSessions.filter(s => s.sessionType === 'fitness');
    
    const totalDuration = onCourtSessions.reduce((sum, s) => sum + s.duration, 0);
    const avgDuration = onCourtSessions.length > 0 ? Math.round(totalDuration / onCourtSessions.length) : 0;
    
    return {
      totalOnCourt: onCourtSessions.length,
      totalFitness: fitnessSessions.length,
      totalDuration,
      avgDuration,
      consistency: trainingConsistency,
    };
  }, [filteredSessions, trainingConsistency]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading analytics...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Button variant="outline-secondary" onClick={onBack} className="mb-4">
        ← Back to Schedule
      </Button>

      <Card className="shadow-lg border-0 mb-4">
        <Card.Header className="bg-primary text-white">
          <h3 className="mb-0">
            <FaChartLine className="me-3" style={{ fontSize: '2rem' }} />
            Training Analytics & Progress Tracking
          </h3>
        </Card.Header>
        <Card.Body>
          {/* Date Range Filter */}
          <Row className="mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">
                  <FaCalendar className="me-2" />
                  Start Date
                </Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">
                  <FaCalendar className="me-2" />
                  End Date
                </Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  max={format(new Date(), 'yyyy-MM-dd')}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Filter by Drill Type</Form.Label>
                <Form.Select value={selectedDrill} onChange={(e) => setSelectedDrill(e.target.value)}>
                  <option value="all">All Drills</option>
                  {DRILL_TYPES.map(drill => (
                    <option key={drill} value={drill}>{drill}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Summary Stats */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center bg-primary text-white">
                <Card.Body>
                  <FaRunning size={32} className="mb-2" />
                  <h4>{stats.totalOnCourt}</h4>
                  <p className="mb-0">On-Court Sessions</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center bg-success text-white">
                <Card.Body>
                  <FaDumbbell size={32} className="mb-2" />
                  <h4>{stats.totalFitness}</h4>
                  <p className="mb-0">Fitness Sessions</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center bg-info text-white">
                <Card.Body>
                  <FaFire size={32} className="mb-2" />
                  <h4>{stats.totalDuration} min</h4>
                  <p className="mb-0">Total Training Time</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center bg-warning text-white">
                <Card.Body>
                  <FaTrophy size={32} className="mb-2" />
                  <h4>{stats.avgDuration} min</h4>
                  <p className="mb-0">Avg. Session Duration</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Training Consistency */}
          <Card className="mb-4">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Training Consistency</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="text-center">
                  <h2 className="text-success">{stats.consistency.complete}</h2>
                  <Badge bg="success">Complete Days</Badge>
                  <p className="small text-muted mt-2">Both sessions completed</p>
                </Col>
                <Col md={4} className="text-center">
                  <h2 className="text-warning">{stats.consistency.partial}</h2>
                  <Badge bg="warning">Partial Days</Badge>
                  <p className="small text-muted mt-2">One session completed</p>
                </Col>
                <Col md={4} className="text-center">
                  <h2 className="text-primary">{stats.consistency.total}</h2>
                  <Badge bg="primary">Total Training Days</Badge>
                  <p className="small text-muted mt-2">Days with any activity</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {filteredSessions.length === 0 ? (
            <Alert variant="info">
              <FaChartLine className="me-2" />
              No training data available for the selected date range. Start logging your sessions!
            </Alert>
          ) : (
            <>
              {/* Drill Duration Over Time */}
              {drillDurationData.length > 0 && (
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">
                      <FaRunning className="me-2" />
                      Drill Duration Tracking
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={drillDurationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis label={{ value: 'Duration (min)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="duration" 
                          stroke="#8884d8" 
                          strokeWidth={2}
                          name="Duration (minutes)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              )}

              {/* Drill Type Distribution */}
              {drillDistribution.length > 0 && (
                <Row>
                  <Col md={6}>
                    <Card className="mb-4">
                      <Card.Header>
                        <h5 className="mb-0">Drill Type Distribution</h5>
                      </Card.Header>
                      <Card.Body>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={drillDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={(entry) => `${entry.name}: ${entry.value}`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {drillDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Fitness Session Frequency */}
                  {fitnessFrequency.length > 0 && (
                    <Col md={6}>
                      <Card className="mb-4">
                        <Card.Header>
                          <h5 className="mb-0">
                            <FaDumbbell className="me-2" />
                            Fitness Session Frequency
                          </h5>
                        </Card.Header>
                        <Card.Body>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={fitnessFrequency}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="sessions" fill="#82ca9d" name="Sessions" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                </Row>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProgressAnalytics;
