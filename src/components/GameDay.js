import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Badge, ListGroup, Alert, Spinner } from 'react-bootstrap';
import { FaPlus, FaTrash, FaTrophy, FaUser, FaClock } from 'react-icons/fa';
import { MATCH_TYPES } from '../utils/trainingData';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const GameDay = ({ onBack }) => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    matchType: '',
    partner: '',
    opponent1: '',
    opponent2: '',
    sets: '',
    setScores: [], // Array to store score for each set
    duration: '',
    matchDate: new Date().toISOString().split('T')[0], // Default to today
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Load matches on component mount
  useEffect(() => {
    loadMatches();
    loadPlayers();
  }, [user]);

  const loadPlayers = async () => {
    try {
      const result = await api.players.getPlayers();
      setPlayers(result.data || []);
    } catch (error) {
      console.error('Failed to load players:', error);
      setPlayers([]);
    }
  };

  const loadMatches = async () => {
    try {
      setLoading(true);
      const result = await api.matches.getMatches({
        userName: user?.name || 'Guest'
      });
      setMatches(result.data || []);
    } catch (error) {
      console.error('Failed to load matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.matchType) {
      newErrors.matchType = 'Match type is required';
    }
    
    // Singles: need 1 opponent
    if (formData.matchType === 'Singles') {
      if (!formData.opponent1.trim()) {
        newErrors.opponent1 = 'Opponent name is required';
      } else if (formData.opponent1 === user?.name) {
        newErrors.opponent1 = 'You cannot select yourself as an opponent';
      }
    }
    
    // Doubles: need 1 partner and 2 opponents
    if (formData.matchType === 'Doubles') {
      if (!formData.partner.trim()) {
        newErrors.partner = 'Partner name is required';
      } else if (formData.partner === user?.name) {
        newErrors.partner = 'You cannot select yourself as a partner';
      }
      if (!formData.opponent1.trim()) {
        newErrors.opponent1 = 'First opponent name is required';
      } else if (formData.opponent1 === user?.name) {
        newErrors.opponent1 = 'You cannot select yourself as an opponent';
      }
      if (!formData.opponent2.trim()) {
        newErrors.opponent2 = 'Second opponent name is required';
      } else if (formData.opponent2 === user?.name) {
        newErrors.opponent2 = 'You cannot select yourself as an opponent';
      } else if (formData.opponent2 === formData.opponent1) {
        newErrors.opponent2 = 'Cannot select the same player twice';
      }
    }
    
    if (!formData.sets || formData.sets <= 0) {
      newErrors.sets = 'Number of sets must be greater than 0';
    }
    
    // Validate all set scores
    if (formData.sets > 0) {
      const numSets = parseInt(formData.sets);
      if (formData.setScores.length !== numSets) {
        newErrors.setScores = `Please enter scores for all ${numSets} set(s)`;
      } else {
        for (let i = 0; i < numSets; i++) {
          const score = formData.setScores[i];
          if (!score || score.myScore === '' || score.opponentScore === '' || 
              score.myScore < 0 || score.opponentScore < 0) {
            newErrors.setScores = `Please enter valid scores for set ${i + 1}`;
            break;
          }
          // NO DRAW RULE: Scores cannot be equal
          if (parseInt(score.myScore) === parseInt(score.opponentScore)) {
            newErrors.setScores = `Set ${i + 1}: Scores cannot be equal - draws are not allowed`;
            break;
          }
        }
      }
    }
    
    if (formData.duration && formData.duration <= 0) {
      newErrors.duration = 'Match duration must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        // Calculate total scores and result
        let myTotalScore = 0;
        let opponentTotalScore = 0;
        formData.setScores.forEach(score => {
          myTotalScore += parseInt(score.myScore);
          opponentTotalScore += parseInt(score.opponentScore);
        });
        
        const newMatch = {
          date: new Date(formData.matchDate + 'T12:00:00').toISOString(),
          matchType: formData.matchType,
          sets: parseInt(formData.sets),
          setScores: formData.setScores.map(score => ({
            myScore: parseInt(score.myScore),
            opponentScore: parseInt(score.opponentScore)
          })),
          myScore: myTotalScore,
          opponentScore: opponentTotalScore,
          duration: formData.duration ? parseInt(formData.duration) : undefined,
          notes: formData.notes,
          result: myTotalScore > opponentTotalScore ? 'Win' : 'Loss',
          userName: user?.name || 'Guest',
        };
        
        // Add match-specific fields
        if (formData.matchType === 'Singles') {
          newMatch.opponent = formData.opponent1;
        } else if (formData.matchType === 'Doubles') {
          newMatch.partner = formData.partner;
          newMatch.opponent = `${formData.opponent1} & ${formData.opponent2}`;
          newMatch.opponents = [formData.opponent1, formData.opponent2];
        }

        await api.matches.createMatch(newMatch);
        await loadMatches();
        
        setFormData({
          matchType: '',
          partner: '',
          opponent1: '',
          opponent2: '',
          sets: '',
          setScores: [],
          duration: '',
          matchDate: new Date().toISOString().split('T')[0],
          notes: '',
        });
        setErrors({});
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.error('Failed to create match:', error);
        alert(error.message || 'Failed to create match');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If changing number of sets, initialize setScores array
    if (name === 'sets') {
      const numSets = parseInt(value) || 0;
      const newSetScores = Array(numSets).fill(null).map((_, index) => 
        formData.setScores[index] || { myScore: '', opponentScore: '' }
      );
      setFormData({
        ...formData,
        [name]: value,
        setScores: newSetScores
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  const handleSetScoreChange = (setIndex, field, value) => {
    const newSetScores = [...formData.setScores];
    newSetScores[setIndex] = {
      ...newSetScores[setIndex],
      [field]: value
    };
    setFormData({
      ...formData,
      setScores: newSetScores
    });
    
    if (errors.setScores) {
      setErrors({
        ...errors,
        setScores: '',
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this match?')) return;
    
    try {
      setLoading(true);
      await api.matches.deleteMatch(id);
      await loadMatches();
    } catch (error) {
      console.error('Failed to delete match:', error);
      alert('Failed to delete match');
    } finally {
      setLoading(false);
    }
  };

  const getResultBadge = (result) => {
    switch (result) {
      case 'Win':
        return <Badge bg="success">Win</Badge>;
      case 'Loss':
        return <Badge bg="danger">Loss</Badge>;
      case 'Draw':
        return <Badge bg="secondary">Draw</Badge>;
      default:
        return null;
    }
  };

  const stats = {
    totalMatches: matches.length,
    wins: matches.filter((m) => m.result === 'Win').length,
    losses: matches.filter((m) => m.result === 'Loss').length,
  };

  if (loading && matches.length === 0) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading matches...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Button variant="outline-secondary" onClick={onBack} className="mb-4">
        ← Back to Schedule
      </Button>

      {/* Stats Cards */}
      {matches.length > 0 && (
        <Row className="g-3 mb-4">
          <Col xs={6} md={4}>
            <Card className="text-center stats-card">
              <Card.Body>
                <h3 className="mb-0">{stats.totalMatches}</h3>
                <small className="text-muted">Total Matches</small>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={4}>
            <Card className="text-center stats-card bg-success text-white">
              <Card.Body>
                <h3 className="mb-0">{stats.wins}</h3>
                <small>Wins</small>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={4}>
            <Card className="text-center stats-card bg-danger text-white">
              <Card.Body>
                <h3 className="mb-0">{stats.losses}</h3>
                <small>Losses</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Card className="shadow-lg border-0 mb-4">
        <Card.Header className="bg-dark text-white">
          <h3 className="mb-0">
            <span className="me-3" style={{ fontSize: '2rem' }}>🎮</span>
            Game Day - Match Recording
          </h3>
        </Card.Header>
        <Card.Body>
          {showSuccess && (
            <Alert variant="success" dismissible onClose={() => setShowSuccess(false)}>
              <FaTrophy className="me-2" />
              Match recorded successfully!
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <FaClock className="me-2" />
                    Match Date *
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="matchDate"
                    value={formData.matchDate}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <Form.Text className="text-muted">
                    Select the date when the match was played
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <FaTrophy className="me-2" />
                    Match Type *
                  </Form.Label>
                  <Form.Select
                    name="matchType"
                    value={formData.matchType}
                    onChange={handleChange}
                    isInvalid={!!errors.matchType}
                  >
                    <option value="">Select match type...</option>
                    {MATCH_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.matchType}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Conditional fields based on match type */}
            {formData.matchType && (
              <>
                {formData.matchType === 'Doubles' && (
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          <FaUser className="me-2" />
                          Your Partner *
                        </Form.Label>
                        <Form.Select
                          name="partner"
                          value={formData.partner}
                          onChange={handleChange}
                          isInvalid={!!errors.partner}
                        >
                          <option value="">Select partner...</option>
                          {players
                            .filter(p => p.name !== user?.name)
                            .map((player) => (
                              <option key={player._id} value={player.name}>
                                {player.name} ({player.skillLevel})
                              </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.partner}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        <FaUser className="me-2" />
                        {formData.matchType === 'Singles' ? 'Opponent Name *' : 'First Opponent *'}
                      </Form.Label>
                      <Form.Select
                        name="opponent1"
                        value={formData.opponent1}
                        onChange={handleChange}
                        isInvalid={!!errors.opponent1}
                      >
                        <option value="">Select opponent...</option>
                        {players
                          .filter(p => p.name !== user?.name && 
                                      (formData.matchType !== 'Doubles' || p.name !== formData.partner))
                          .map((player) => (
                            <option key={player._id} value={player.name}>
                              {player.name} ({player.skillLevel})
                            </option>
                          ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.opponent1}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {formData.matchType === 'Doubles' && (
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          <FaUser className="me-2" />
                          Second Opponent *
                        </Form.Label>
                        <Form.Select
                          name="opponent2"
                          value={formData.opponent2}
                          onChange={handleChange}
                          isInvalid={!!errors.opponent2}
                        >
                          <option value="">Select opponent...</option>
                          {players
                            .filter(p => p.name !== user?.name && 
                                        p.name !== formData.partner && 
                                        p.name !== formData.opponent1)
                            .map((player) => (
                              <option key={player._id} value={player.name}>
                                {player.name} ({player.skillLevel})
                              </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.opponent2}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  )}
                </Row>
              </>
            )}

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Number of Sets *</Form.Label>
                  <Form.Control
                    type="number"
                    name="sets"
                    placeholder="e.g., 3"
                    min="1"
                    max="5"
                    value={formData.sets}
                    onChange={handleChange}
                    isInvalid={!!errors.sets}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.sets}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Set Scores Section */}
            {formData.sets > 0 && formData.setScores.length > 0 && (
              <Card className="mb-3 border-primary">
                <Card.Header className="bg-primary text-white">
                  <h6 className="mb-0">Enter Score for Each Set</h6>
                </Card.Header>
                <Card.Body>
                  {formData.setScores.map((setScore, index) => (
                    <Row key={index} className="mb-3 align-items-center">
                      <Col xs={12} md={2}>
                        <Form.Label className="fw-bold mb-2 mb-md-0">Set {index + 1}:</Form.Label>
                      </Col>
                      <Col xs={6} md={4}>
                        <Form.Group>
                          <Form.Label className="small">Your Score *</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="e.g., 21"
                            min="0"
                            value={setScore.myScore}
                            onChange={(e) => handleSetScoreChange(index, 'myScore', e.target.value)}
                            isInvalid={!!errors.setScores}
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={6} md={4}>
                        <Form.Group>
                          <Form.Label className="small">Opponent Score *</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="e.g., 19"
                            min="0"
                            value={setScore.opponentScore}
                            onChange={(e) => handleSetScoreChange(index, 'opponentScore', e.target.value)}
                            isInvalid={!!errors.setScores}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  ))}
                  {errors.setScores && (
                    <Alert variant="danger" className="mb-0">
                      {errors.setScores}
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            )}

            <Row>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <FaClock className="me-2" />
                    Match Duration (minutes)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    placeholder="e.g., 45"
                    min="1"
                    value={formData.duration}
                    onChange={handleChange}
                    isInvalid={!!errors.duration}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.duration}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Notes (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    placeholder="Match highlights, areas for improvement, etc."
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid">
              <Button variant="dark" type="submit" size="lg" disabled={loading}>
                <FaPlus className="me-2" />
                {loading ? 'Recording...' : 'Record Match'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Match History */}
      {matches.length > 0 && (
        <Card className="shadow-lg border-0">
          <Card.Header className="bg-primary text-white">
            <h4 className="mb-0">Match History ({matches.length})</h4>
          </Card.Header>
          <Card.Body className="p-0">
            <ListGroup variant="flush">
              {matches.map((match) => (
                <ListGroup.Item key={match._id || match.id} className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="mb-2">
                        {getResultBadge(match.result)}
                        <span className="ms-3">{match.matchType}</span>
                      </h5>
                      <small className="text-muted">
                        {new Date(match.date).toLocaleDateString()} at{' '}
                        {new Date(match.date).toLocaleTimeString()}
                      </small>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(match._id || match.id)}
                      disabled={loading}
                    >
                      <FaTrash />
                    </Button>
                  </div>

                  <Row className="mb-3">
                    {match.matchType === 'Doubles' && match.partner && (
                      <Col xs={12} md={6}>
                        <div className="match-detail">
                          <strong>Partner:</strong> {match.partner}
                        </div>
                      </Col>
                    )}
                    <Col xs={12} md={6}>
                      <div className="match-detail">
                        <strong>{match.matchType === 'Singles' ? 'Opponent:' : 'Opponents:'}</strong>{' '}
                        {match.matchType === 'Singles' 
                          ? match.opponent 
                          : match.opponents?.join(' & ')}
                      </div>
                    </Col>
                    <Col xs={6} md={3}>
                      <div className="match-detail">
                        <strong>Total Score:</strong> {match.myScore} - {match.opponentScore}
                      </div>
                    </Col>
                    <Col xs={6} md={3}>
                      <div className="match-detail">
                        <strong>Sets:</strong> {match.sets}
                      </div>
                    </Col>
                  </Row>

                  {/* Display individual set scores */}
                  {match.setScores && match.setScores.length > 0 && (
                    <div className="mb-3">
                      <strong className="d-block mb-2">Set Scores:</strong>
                      <div className="d-flex flex-wrap gap-2">
                        {match.setScores.map((setScore, index) => (
                          <Badge key={index} bg="secondary" className="p-2">
                            Set {index + 1}: {setScore.myScore} - {setScore.opponentScore}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {match.duration && (
                    <div className="mb-2">
                      <Badge bg="info">
                        <FaClock className="me-1" />
                        {match.duration} minutes
                      </Badge>
                    </div>
                  )}

                  {match.notes && (
                    <div className="mt-3 p-3 bg-light rounded">
                      <strong>Notes:</strong>
                      <p className="mb-0 mt-2">{match.notes}</p>
                    </div>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      {matches.length === 0 && (
        <Alert variant="info" className="text-center">
          <FaTrophy className="me-2" />
          No matches recorded yet. Add your first match above!
        </Alert>
      )}
    </Container>
  );
};

export default GameDay;
