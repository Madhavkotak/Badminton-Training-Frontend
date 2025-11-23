import React from 'react';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { FaPlus, FaTrash, FaUsers, FaUser } from 'react-icons/fa';
import { PLACEHOLDERS } from '../../constants';

const PlayersList = ({ players, availablePlayers = [], currentUser = '', onChange, onAdd, onRemove, error }) => {
  // Get list of already selected players to filter them out
  const getAvailablePlayersForIndex = (currentIndex) => {
    const selectedPlayers = players.filter((p, idx) => idx !== currentIndex && p !== '');
    return availablePlayers.filter(p => 
      p.name !== currentUser && 
      !selectedPlayers.includes(p.name)
    );
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label className="fw-bold">
        <FaUsers className="me-2" />
        Drill Partners *
        <small className="text-muted ms-2">(Add all players you practiced with)</small>
      </Form.Label>
      {players.map((player, index) => (
        <Row key={index} className="mb-2 g-2">
          <Col xs={10} md={11}>
            <InputGroup>
              <InputGroup.Text>
                <FaUser />
              </InputGroup.Text>
              <Form.Select
                value={player}
                onChange={(e) => onChange(index, e.target.value)}
              >
                <option value="">Select partner {index + 1}...</option>
                {getAvailablePlayersForIndex(index).map((p) => (
                  <option key={p._id} value={p.name}>
                    {p.name} ({p.skillLevel})
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Col>
          <Col xs={2} md={1}>
            {players.length > 1 && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onRemove(index)}
                className="w-100"
                title="Remove player"
              >
                <FaTrash />
              </Button>
            )}
          </Col>
        </Row>
      ))}
      <Button
        variant="outline-primary"
        size="sm"
        onClick={onAdd}
        className="mt-2"
      >
        <FaPlus className="me-2" />
        Add Another Partner
      </Button>
      {error && <div className="text-danger small mt-2">{error}</div>}
    </Form.Group>
  );
};

export default PlayersList;
