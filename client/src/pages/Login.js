import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import styled from "styled-components";

const Spacing = styled.div`
 margin-top: 40px;
`

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
`;

const Title = styled.h1`
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

function Login(){

    const [role, setRole] = useState(""); // State to manage selected role
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // Accessing navigate function

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if(username==="" || password ===""){
            alert("enter username and password");
        }
        else{
            if(role === "room-service"){
                navigate("/room_service");
            }
            else if(role === "admin"){
                navigate("/admin");
            }
            else if(role === "photographer"){
                navigate("/photographer");
            }
            else{
                alert("choose your role");
            }
        }
        
    };

    return(
        <Spacing>
        <Container>
            <Title>Welcome to Hotel 🏨</Title>
            <p>Please enter your credentials:</p>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>Username: </Label>
                    <Input 
                        type="text" 
                        value={username} 
                        onChange={handleUsernameChange} 
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Password: </Label>
                    <Input 
                        type="password" 
                        value={password} 
                        onChange={handlePasswordChange} 
                    />
                </FormGroup>
                <FormGroup>
                    <p>Please select your role:</p>
                    <Label>
                        <Input 
                            type="radio" 
                            value="room-service" 
                            checked={role === "room-service"} 
                            onChange={handleRoleChange} 
                        />
                        Room Service
                    </Label>
                    <Label>
                        <Input 
                            type="radio" 
                            value="admin" 
                            checked={role === "admin"} 
                            onChange={handleRoleChange} 
                        />
                        Admin
                    </Label>
                    <Label>
                        <Input 
                            type="radio" 
                            value="photographer" 
                            checked={role === "photographer"} 
                            onChange={handleRoleChange} 
                        />
                        Photographer
                    </Label>
                </FormGroup>
                <Button type="submit">Login</Button>
            </Form>
        </Container>
        </Spacing>
    );

}

export default Login;
