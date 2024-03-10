import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const RoomServiceContainer = styled.div`
  font-family: monospace;
`;

const RequestContainer = styled.div`
  text-align: left;
  padding-left: 10vw;
`;

const Label = styled.label`
  font-size: large;
`;

const SubmitButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #0056b3;
  }
`;

const Table = styled.table`
  border-collapse: collapse;
  margin-left: 60px;
  width: 80%;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const TableRow = styled.tr``;

const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

function RoomService() {
  const [selectedRequestType, setSelectedRequestType] = useState("Cleaner");
  const [requestData, setRequestData] = useState([]);

  const handleRequestTypeChange = (event) => {
    setSelectedRequestType(event.target.value);
  };

  const handleSubmit = () => {
    axios
      .get("http://localhost:3001/room-service-request", {
        params: {
          requestType: selectedRequestType,
        },
      })
      .then((response) => {
        setRequestData(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    handleSubmit();
  }, []); // Fetch data on component mount

  const addTimeIncrement = (index) => {
    const currentTime = new Date().getTime(); // Get current time in milliseconds
    const increment = index * 0.5 * 60 * 60 * 1000; // Convert hours to milliseconds
    const visitTime = new Date(currentTime + increment); // Add the increment to current time
    return visitTime.toLocaleTimeString(); // Format the time as desired
  };
  return (
    <RoomServiceContainer>
      <h1>Welcome! Room Service 🚚 🧹</h1>
      <RequestContainer>
        <h2>Pending Requests:</h2>
        <Label htmlFor="requestType">Select Request Type:</Label>
        <select
          id="requestType"
          value={selectedRequestType}
          onChange={handleRequestTypeChange}
        >
          <option value="Cleaner">Cleaner</option>
          <option value="Refill">Refill</option>
          <option value="Repair">Repair</option>
        </select>
        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
      </RequestContainer>
      <Table>
        <thead>
          <tr>
            <TableHeader>Room</TableHeader>
            <TableHeader>Time Of Visit</TableHeader>
          </tr>
        </thead>
        <tbody>
          {requestData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.room_number + " " + row.room_type}</TableCell>
              <TableCell>{addTimeIncrement(index)}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </RoomServiceContainer>
  );
}

export default RoomService;
