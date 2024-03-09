import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const StyledContainer = styled.div`
  display: flex;
  justify-content: center; /* Horizontally center */
  align-items: center; /* Vertically center */
`;

const SidebarContainer = styled.div`
  width: ${({ isOpen }) => (isOpen ? "200px" : "80px")};
  height: 100vh;
  background-color: #333;
  color: white;
  transition: width 0.3s ease;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 20px;
  left: ${({ isOpen }) => (isOpen ? "180px" : "50px")};
  transition: left 0.3s ease;
  color: white;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const AlertsContainer = styled.div`
  padding: 20px;
  border-top: 1px solid #555;
`;

const NavDropdown = styled.select`
  width: 80%;
  padding: 10px;
  margin: 20px auto;
  display: block;
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const InfoContainer = styled.div`
  justify-content: center;
  flex: 1; /* Occupy remaining space */
  height: 100vh;
  font-family: monospace;
  text-align: center; /* Center text */
`;

function Admin() {
  const [isOpen, setIsOpen] = useState(true);
  const [roomType, setRoomType] = useState("Single");
  const [roomNo, setRoomNo] = useState("101");
  const [request, setRequest] = useState("Cleaner");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = () => {
    // Send data to server using Axios
    axios.post("/photographer", {
      roomType,
      roomNo,
      request
    })
    .then(response => {
      // Handle response if needed
      console.log(response);
    })
    .catch(error => {
      // Handle error if needed
      console.error(error);
    });
  };

  return (
    <StyledContainer>
      <SidebarContainer isOpen={isOpen}>
        <ArrowButton onClick={toggleSidebar} isOpen={isOpen}>
          {isOpen ? "<" : ">"}
        </ArrowButton>
        <AlertsContainer>
          <h3>{isOpen ? "Alerts" : "🔔"}</h3>
          {/* Alerts content goes here */}
        </AlertsContainer>
        <h3>{isOpen ? "Room Type" : "RT"}</h3>
        <NavDropdown value={roomType} onChange={(e) => setRoomType(e.target.value)}>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Family">Family</option>
        </NavDropdown>
        <h3>{isOpen ? "Room No." : "RN"}</h3>
        <NavDropdown value={roomNo} onChange={(e) => setRoomNo(e.target.value)}>
          <option value="101">101</option>
          <option value="102">102</option>
          <option value="103">103</option>
        </NavDropdown>
        <h3>{isOpen ? "Request Type" : "Req_T"}</h3>
        <NavDropdown value={request} onChange={(e) => setRequest(e.target.value)}>
          <option value="Cleaner">Cleaner</option>
          <option value="Refill">Refill</option>
          <option value="Repair">Repair</option>
          <option value="All">All</option>
        </NavDropdown>
        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
      </SidebarContainer>
      <InfoContainer>
        <h1>Welcome! Admin 👩🏻‍💼</h1>
        {/* Other content in the admin panel */}
      </InfoContainer>
    </StyledContainer>
  );
}

export default Admin;
