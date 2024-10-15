import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Header, Heading, AttendanceSummary, StudentTable, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell, AttendanceButton, SubmitButton } from "./MarkAttendance.styled";


export default function MyAttendance() {
  const location = useLocation();
  const { state } = location;
  const [students, setStudents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString());
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [totalStrength, setTotalStrength] = useState(0);
  const [subject, setSubject] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3000/getStudents?class=${state.selectedClass}`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        calculateAttendanceCounts(data);
      });
  }, [state.selectedClass]);

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleAttendanceChange = (rollno) => {
    const updatedStudents = students.map((student) =>
      student.rollno === rollno ? { ...student, status: student.status === "present" ? "absent" : "present" } : student
    );
    setStudents(updatedStudents);
    calculateAttendanceCounts(updatedStudents);
  };

  const calculateAttendanceCounts = (studentData) => {
    let present = 0;
    let absent = 0;
    studentData.forEach((student) => {
      if (student.status === "present") {
        present++;
      } else {
        absent++;
      }
    });
    setTotalPresent(present);
    setTotalAbsent(absent);
    setTotalStrength(present + absent);
  };

  const handleSubmit = () => {
    students.forEach((student) => {
      fetch("http://localhost:3000/updateAttendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rollno: student.rollno,
          status: student.status,
          date: currentDate,
          subject,
          class: state.selectedClass,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Attendance updated successfully:", data);
        })
        .catch((error) => {
          console.error("Error updating attendance:", error);
        });
    });
    alert("Attendance submitted successfully!");
  };

  return (
    <Container>
      <Header>
        <Heading>Mark Student Attendance for {state.selectedClass}</Heading>
      </Header>
      <AttendanceSummary>
        <div>Total Present: {totalPresent}</div>
        <div>Total Absent: {totalAbsent}</div>
        <div>Total Strength: {totalStrength}</div>
      </AttendanceSummary>
      <StudentTable>
        <TableHeader>
          <tr>
            <TableHeaderCell>Roll No</TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Attendance</TableHeaderCell>
          </tr>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.rollno}>
              <TableCell>{student.rollno}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>
                <AttendanceButton
                  status={student.status}
                  onClick={() => handleAttendanceChange(student.rollno)}
                >
                  {student.status === "present" ? "Present" : "Absent"}
                </AttendanceButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StudentTable>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
      </div>
    </Container>
  );
};