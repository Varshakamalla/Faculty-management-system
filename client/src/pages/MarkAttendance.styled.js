import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f0f8ff;
  min-height: 100vh;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

export const Heading = styled.h2`
  font-size: 2rem;
`;

export const AttendanceSummary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`;

export const StudentTable = styled.table`
  width: 100vw;
  max-width: 100vw;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

export const TableHeader = styled.thead`
  background-color: #007bff;
  color: white;
`;

export const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f5f5f5;
  }
`;

export const TableCell = styled.td`
  padding: 1rem;
  text-align: left;
`;

export const AttendanceButton = styled.button`
  background-color: ${(props) => (props.status === "present" ? "#4CAF50" : "#F44336")};
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;