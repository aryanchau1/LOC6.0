import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

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
`;

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

const NavDropdown = styled.select`
  width: 80%;
  padding: 10px;
  margin: 20px auto;
  display: block;
`;

function Photographer() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [comment, setComment] = useState("");
  const [roomType, setRoomType] = useState("Single");
  const [roomNo, setRoomNo] = useState("101");
  const [request, setRequest] = useState("BedRoom");
  const [isOpen, setIsOpen] = useState(true);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    setSelectedPhoto(file);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Create a FormData object to store the form data
    const formData = new FormData();
    formData.append("roomType", roomType);
    formData.append("roomNo", roomNo);
    formData.append("request", request);
    formData.append("comment", comment);
    formData.append("file", selectedPhoto); // Append the image file

    try {
      // Send data to the API using Axios
      const response = await axios.post(
        "http://localhost:3001/photographer",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
          },
        }
      );

      // Handle response if needed
      console.log("Response:", response.data);
    } catch (error) {
      // Handle error if the request fails
      console.error("Error:", error);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <StyledContainer>
      <SidebarContainer isOpen={isOpen}>
        <ArrowButton onClick={toggleSidebar} isOpen={isOpen}>
          {isOpen ? "<" : ">"}
        </ArrowButton>
        <h3>{isOpen ? "Room Type" : "RT"}</h3>
        <NavDropdown onChange={(e) => setRoomType(e.target.value)}>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Family">Family</option>
        </NavDropdown>
        <h3>{isOpen ? "Room No." : "RN"}</h3>
        <NavDropdown onChange={(e) => setRoomNo(e.target.value)}>
          <option value="101">101</option>
          <option value="102">102</option>
          <option value="103">103</option>
        </NavDropdown>
        <h3>{isOpen ? "Request Type" : "Req_T"}</h3>
        <NavDropdown onChange={(e) => setRequest(e.target.value)}>
          <option value="BedRoom">BedRoom</option>
          <option value="WashRoom">WashRoom</option>
          <option value="micro">Micro</option>
        </NavDropdown>
      </SidebarContainer>
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
            style={{ maxWidth: "400px", marginTop: "20px" }}
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
