import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Title,
  Form,
  Label,
  Select,
  Input,
  Button,
  Table,
  TableHeader,
  TableData,
  TableRow,
  AddScheduleButton
} from './MyScheduleStyles';

function MySchedule() {
  const [day, setDay] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [shouldFetchSchedule, setShouldFetchSchedule] = useState(false);
  const [editedSchedule, setEditedSchedule] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddScheduleForm, setShowAddScheduleForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    time: '',
    subject: '',
    block: ''
  });

  useEffect(() => {
    if (shouldFetchSchedule && day && employeeId) {
      axios.get(`/api/myschedule?day=${day}&employeeId=${employeeId}`)
        .then(response => {
          setSchedule(response.data);
          setEditedSchedule(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [shouldFetchSchedule, day, employeeId]);

  const handleDayChange = (event) => {
    setDay(event.target.value);
  };

  const handleEmployeeIdChange = (event) => {
    setEmployeeId(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShouldFetchSchedule(true);
  };

  const handleEditChange = (index, field, value) => {
    const updatedSchedule = [...editedSchedule];
    updatedSchedule[index][field] = value;
    setEditedSchedule(updatedSchedule);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put('/api/myschedule/update', {
        employeeId,
        day,
        updatedSchedule: editedSchedule
      });

      if (response.status === 200) {
        const updatedScheduleResponse = await axios.get(`/api/myschedule?day=${day}&employeeId=${employeeId}`);
        setSchedule(updatedScheduleResponse.data);
        setIsEditing(false);
        console.log('Schedule updated successfully');
      } else {
        console.error('Error saving schedule changes:', response.data.message);
      }
    } catch (error) {
      console.error('Error saving schedule changes:', error);
    }
  };

  const handleAddScheduleClick = () => {
    setShowAddScheduleForm(true);
  };

  const handleAddScheduleSubmit = async () => {
    try {
      const response = await axios.post('/api/myschedule/add', {
        employeeId,
        day,
        time: newSchedule.time,
        subject: newSchedule.subject,
        block: newSchedule.block
      });
  
      if (response.status === 200) {
        setSchedule(response.data.schedule);
        setShowAddScheduleForm(false);
        setNewSchedule({
          time: '',
          subject: '',
          block: ''
        });
        console.log('Schedule added successfully');
      } else {
        console.error('Error adding schedule:', response.data.message);
      }
    } catch (error) {
      console.error('Error adding schedule:', error);
    }
  };

  const handleNewScheduleChange = (field, value) => {
    setNewSchedule(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  return (
    <Container>
      <Title>My Schedule</Title>
      <Form onSubmit={handleSubmit}>
        <label>
          Select Day:
          <select value={day} onChange={handleDayChange}>
            <option value="">Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
          </select>
        </label>
        <br />
        <label>
          Enter Employee ID:
          <input type="text" value={employeeId} onChange={handleEmployeeIdChange} />
        </label>
        <br />
        <Button type="submit" color="blue">Get Schedule</Button>
      </Form>
      <br />
      <Table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Subject, Class</th>
            <th>Block</th>
            <th>
              <AddScheduleButton onClick={handleAddScheduleClick}>+</AddScheduleButton>
            </th>
          </tr>
        </thead>
        <tbody>
          {editedSchedule.map((item, index) => (
            <tr key={index}>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    value={item.time}
                    onChange={(e) => handleEditChange(index, 'time', e.target.value)}
                  />
                ) : (
                  item.time
                )}
              </td>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    value={item.subject}
                    onChange={(e) => handleEditChange(index, 'subject', e.target.value)}
                  />
                ) : (
                  item.subject
                )}
              </td>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    value={item.block}
                    onChange={(e) => handleEditChange(index, 'block', e.target.value)}
                  />
                ) : (
                  item.block
                )}
              </td>
            </tr>
          ))}
          {showAddScheduleForm && (
            <tr>
              <td>
                <Input
                  type="text"
                  placeholder="Enter time"
                  value={newSchedule.time}
                  onChange={(e) => handleNewScheduleChange('time', e.target.value)}
                />
              </td>
              <td>
                <Input
                  type="text"
                  placeholder="Enter subject"
                  value={newSchedule.subject}
                  onChange={(e) => handleNewScheduleChange('subject', e.target.value)}
                />
              </td>
              <td>
                <Input
                  type="text"
                  placeholder="Enter block"
                  value={newSchedule.block}
                  onChange={(e) => handleNewScheduleChange('block', e.target.value)}
                />
              </td>
              <td>
                <Button onClick={handleAddScheduleSubmit}>Save</Button>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {isEditing ? (
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      ) : (
        <Button onClick={handleEditClick}>Edit Schedule</Button>
      )}
    </Container>
  );
}

export default MySchedule;