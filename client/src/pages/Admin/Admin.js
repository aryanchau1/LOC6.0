import React from "react";
import Sidebar from "./SideBar";
import styled from "styled-components";

const StyledContainer = styled.div`
  display: flex;
`;

const InfoContainer = styled.div`
  flex: 1; /* Occupy remaining space */
  justify-content: center;
  height: 100vh;
  font-family: monospace;
`;
const ReqContainer = styled.div`
  justify-content: center;

  margin-left: 220px;
  text-align: left;
`;

function Admin() {
  return (
    <StyledContainer>
      <Sidebar />
      <InfoContainer>
        <h1>Welcome! Admin 👩🏻‍💼</h1>
        <ReqContainer></ReqContainer>
      </InfoContainer>
    </StyledContainer>
  );
}

export default Admin;
