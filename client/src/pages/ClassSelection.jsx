import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('https://example.com/background-image.jpg');
  background-size: cover;
  background-position: center;
`;

const Card = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ClassSelection = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const navigate = useNavigate();

  const handleClassSelect = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleSubmit = () => {
    navigate('/MarkAttendance', { state: { selectedClass } });
  };

  return (
    <Container>
      <Card>
        <Heading>Select a Class</Heading>
        <Select value={selectedClass} onChange={handleClassSelect}>
          <option value="">Select a class</option>
          <option value="AIML-A">AIML-A</option>
          <option value="AIML-B">AIML-B</option>
          <option value="DS-A">DS-A</option>
        </Select>
        <Button onClick={handleSubmit}>Mark Attendance</Button>
      </Card>
    </Container>
  );
};

export default ClassSelection;