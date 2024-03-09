import React, { useState } from "react";
import SideBarPhoto from "./SideBarPhoto";
import styled from "styled-components";

// Define styled components outside of the functional component
const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  font-family: monospace;
`;

const Label = styled.label`
  font-size: 20px;
  background-color: lightblue;
  border-radius: 2px;
  cursor: pointer;
  padding: 10px;
  &:hover {
    background-color: skyblue;
  }
`;

const UploadInput = styled.input`
  display: none;
`;
const Form = styled.form`
    display: flex;
    flex-direction: column;
`
const CommentInput = styled.textarea`
  margin-top: 20px;
  width: 300px;
  height: 50px;
  resize: vertical;
`;

const SubmitButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: lightblue;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: skyblue;
  }
`;

function Photographer() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [comment, setComment] = useState("");

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    setSelectedPhoto(file);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    // Here you can perform actions like submitting the comment and photo
    console.log("Submitted:", comment, selectedPhoto);
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
        <Form onSubmit={handleSubmit}>
          <CommentInput
            placeholder="Enter your comments here..."
            value={comment}
            onChange={handleCommentChange}
          />
          <SubmitButton type="submit">Submit</SubmitButton>
        </Form>
      </InfoContainer>
    </StyledContainer>
  );
}

export default Photographer;
