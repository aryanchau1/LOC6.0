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
const Table = styled.table`
  border-collapse: collapse;
  width: 80%;
  margin: 20px auto;
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const TableRow = styled.tr`
  
`;

const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;
const Dialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DialogContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const ObjectDetectionTable = styled.table`
  border-collapse: collapse;
  width: 80%;
  margin: 20px auto;
`;

const DamageDetectionTable = styled.table`
  border-collapse: collapse;
  width: 80%;
  margin: 20px auto;
`;

function Admin() {
  const [isOpen, setIsOpen] = useState(true);
  const [tables, setTables] = useState([]);
  const [objectDetectionTables, setObjectDetectionTables] = useState([]);
  const [damageDetectionTables, setDamageDetectionTables] = useState([]);
  const [roomType, setRoomType] = useState("Single");
  const [request, setRequest] = useState("Cleaner");
  const [showDialog, setShowDialog] = useState(false);
  const [imageURL, setImageURL] = useState('');

  const openDialog = (imageName) => {
    const imageUrl = `http://localhost:3001/uploads/${imageName}`;
    setImageURL(imageUrl);
    setShowDialog(true);
  };
  const closeDialog = () => {
    setShowDialog(false);
  };

  const handleApprove = (index) => {
    const updatedTables = [...tables];
    // Update the status in the table data
    updatedTables[index].status = 'Approved';
    setTables(updatedTables);

    // Send a request to the backend to update the status
    axios.post("http://localhost:3001/update-status", {
      roomId: updatedTables[index].room_number,
      newStatus: 'Approved'
    })
    .then(response => {
      // Handle response if needed
    })
    .catch(error => {
      console.error(error);
    });
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = () => {
    axios.get("http://localhost:3001/get-tables", {
        params: {
            roomType: roomType,
            request: request
          }
    })
    .then(response => {
      const { rows, objectDetectionRows, damageDetectionRows } = response.data;
      console.log(response.data.refill_req);
      setTables(response.data.clean_req);
      setObjectDetectionTables(response.data.refill_req);
      setDamageDetectionTables(response.data.repair_req);
    })
    .catch(error => {
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
          <option value="*">All</option>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Family">Family</option>
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
        <h2>Clean Request</h2>
        <Table>
          <thead>
            <tr>
              <TableHeader>Room Number</TableHeader>
              <TableHeader>Room Type</TableHeader>
              <TableHeader>Request Date</TableHeader>
              <TableHeader>Completion Date</TableHeader>
              <TableHeader>Comment</TableHeader>
              <TableHeader>Messy</TableHeader>
            </tr>
          </thead>
          <tbody>
            {tables.map((table, index) => (
              <TableRow key={index}>
                <TableCell>{table.room_number}</TableCell>
                <TableCell>{table.room_type}</TableCell>
                <TableCell>{table.request_date_time}</TableCell>
                <TableCell>{table.completion_date_time}</TableCell>
                <TableCell>{table.comment}</TableCell>
                <TableCell>{table.messy>0.3? "Messy":"Not Messy"}</TableCell>
                  <button onClick={() => openDialog(table.image_url)}>Show Image</button>

              </TableRow>
            ))}
          </tbody>
        </Table>
        <h2>Object Table</h2>
        <ObjectDetectionTable>
          <thead>
            <tr>
              <TableHeader>Room Number</TableHeader>
              <TableHeader>Room Type</TableHeader>
              <TableHeader>Upload Time</TableHeader>
              <TableHeader>Object</TableHeader>
              <TableHeader>Comment</TableHeader>
            </tr>
          </thead>
          <tbody>
            {objectDetectionTables.map((table, index) => (
              <TableRow key={index}>
                <TableCell>{table.room_number}</TableCell>
                <TableCell>{table.room_type}</TableCell>
                <TableCell>{table.upload_date_time}</TableCell>
                <TableCell>{table.is_present}</TableCell>
                <TableCell>{table.comment}</TableCell>
                <button onClick={() => openDialog(table.image_url)}>Show Image</button>
              </TableRow>
            ))}
          </tbody>
        </ObjectDetectionTable>
        <h2>Damage and Stain</h2>
        <DamageDetectionTable>
          <thead>
            <tr>
              <TableHeader>Room Number</TableHeader>
              <TableHeader>Room Type</TableHeader>
              <TableHeader>Request Time</TableHeader>
              <TableHeader>Damage</TableHeader>
              <TableHeader>Stain</TableHeader>
              <TableHeader>Comment</TableHeader>
            </tr>
          </thead>
          <tbody>
            {damageDetectionTables.map((table, index) => (
              <TableRow key={index}>
                <TableCell>{table.room_number}</TableCell>
                <TableCell>{table.room_type}</TableCell>
                <TableCell>{table.request_date_time}</TableCell>
                <TableCell>{table.req_stain>0.22? "Stained":"Not Stained"}</TableCell>
                <TableCell>{table.req_break>0.22? "Broken":"Not Broken"}</TableCell>
                <TableCell>{table.comment}</TableCell>
                <button onClick={() => openDialog(table.image_url)}>Show Image</button>
              </TableRow>
            ))}
          </tbody>
        </DamageDetectionTable>
        {showDialog && (
          <Dialog>
            <DialogContent>
              <img src={imageURL} alt="Room Image" style={{ maxWidth: "400px", marginTop: "20px" }}/>
              <CloseButton onClick={closeDialog}>❌</CloseButton>
            </DialogContent>
          </Dialog>
        )}
      </InfoContainer>
    </StyledContainer>
  );
}

export default Admin;
