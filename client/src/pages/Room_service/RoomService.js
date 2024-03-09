import React, { useState } from "react";
import styled from "styled-components";

const RoomServiceContainer = styled.div`
    font-family: monospace;
`;

const RequestContainer = styled.div`
    text-align: left;
    padding-left: 10vw;
`;
const Label = styled.label`
    font-size: large;
`

function RoomService() {
    const [selectedRequestType, setSelectedRequestType] = useState("All");

    const handleRequestTypeChange = (event) => {
        setSelectedRequestType(event.target.value);
    };

    return (
        <RoomServiceContainer>
            <h1>Welcome! Room Service 🚚 🧹</h1>
            <RequestContainer>
                <h2>Pending Requests:</h2>
                <Label htmlFor="requestType">Select Request Type:</Label>
                <select id="requestType" value={selectedRequestType} onChange={handleRequestTypeChange}>
                    <option value="All">All</option>
                    <option value="Cleaner">Cleaner</option>
                    <option value="Refill">Refill</option>
                    <option value="Repair">Repair</option>
                </select>
                
            </RequestContainer>
        </RoomServiceContainer>
    );
}

export default RoomService;
