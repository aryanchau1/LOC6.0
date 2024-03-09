import React, { useState } from "react";
import styled from "styled-components";

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

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <ArrowButton onClick={toggleSidebar} isOpen={isOpen}>
        {isOpen ? "<" : ">"}
      </ArrowButton>
      <AlertsContainer>
        <h3>{isOpen ? "Alerts" : "🔔"}</h3>
        {/* Alerts content goes here */}
      </AlertsContainer>
      <h3>{isOpen ? "Room Type" : "RT"}</h3>
      <NavDropdown>
        <option value="option1">Single</option>
        <option value="option2">Double</option>
        <option value="option3">Family</option>
      </NavDropdown>
      <h3>{isOpen ? "Room No." : "RN"}</h3>
      <NavDropdown>
        <option value="option1">101</option>
        <option value="option2">102</option>
        <option value="option3">103</option>
      </NavDropdown>
      <h3>{isOpen ? "Request Type" : "Req_T"}</h3>
      <NavDropdown>
        <option value="option1">Cleaner</option>
        <option value="option2">Refill</option>
        <option value="option3">Repair</option>
        <option value="option4">All</option>
      </NavDropdown>
    </SidebarContainer>
  );
};

export default SideBar;
