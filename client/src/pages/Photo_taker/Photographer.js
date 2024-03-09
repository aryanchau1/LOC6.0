import React, { useState } from "react";
import SideBarPhoto from "./SideBarPhoto";
import styled from "styled-components";

function Photographer() {
  const StyledContainer = styled.div`
    display: flex;
    justify-content: center;
  `;

  const InfoContainer = styled.div`
    display: flex;
    flex-direction: column; /* Align items vertically */
    align-items: center; /* Center content horizontally */
    height: 100vh;
    font-family: monospace;
  `;

  const Label = styled.label`
    font-size: 20px; /* Adjust font size */
    background-color: aliceblue;
    border-radius: 2px;
    cursor: pointer;
    padding: 10px;
    &:hover{
        background-color: lightblue;
    }
  `;

  const UploadInput = styled.input`
    display: none;
  `;

  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    setSelectedPhoto(file);
  };

  return (
    <StyledContainer>
      <SideBarPhoto />
      <InfoContainer>
        <h1>Welcome! Photographer 📸</h1>
        <Label htmlFor="photoInput">Select Photo:</Label>
        <UploadInput
          id="photoInput"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
        />
        {selectedPhoto && (
          <img
            src={URL.createObjectURL(selectedPhoto)}
            alt="Selected Photo"
            style={{ maxWidth: "100%", marginTop: "20px" }}
          />
        )}
      </InfoContainer>
    </StyledContainer>
  );
}

export default Photographer;
