import React from "react";
import styled from "styled-components";
import Cat from "../assets/cute-cat.gif";
import Logout from "./Logout";
import { useNavigate } from "react-router-dom";

const Welcome = ({ currentUser }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/search')
  }

  return (
    <Container>
    <div className="nav">
      <button onClick={handleClick}>Search</button>
      <Logout />
    </div>
      <img src={Cat} alt="Cat" />
      <h1>
        Welcome, <span>{currentUser === undefined ? "" : currentUser.username}!</span>
      </h1>
      <h3>Please select a chat to Start Messaging.</h3>
    </Container>
  );
};

const Container = styled.div`
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap');

.nav {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  width: 100%;
  margin-right: 50px;
  button {
      border: none;
      padding: 0.5rem;
      border-radius: 0.5rem;
      background-color: #9a86f3;
      color: white;
      font-size: 1rem;
      font-family: 'Poppins', sans-serif;
    }
}
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  span {
    color: lime;
  }
`;

export default Welcome;
