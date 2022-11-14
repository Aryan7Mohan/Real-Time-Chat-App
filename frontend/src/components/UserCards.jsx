import React from "react";
import styled from "styled-components";

const UserCards = ({ currentUserId, userId, username, email, handleSubmit }) => {


  return (
    <Container>
      <form onSubmit={(event) => handleSubmit(event, userId)}>
        <h1>{username}</h1>
        <p>{email}</p>
        <button>Add Friend</button>
      </form>
    </Container>
  );
};

const Container = styled.div`
  padding: 10px;
  background-color: hotpink;
  margin: 20px;

  form {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  /* width: 40%; */
  border-radius: 10px;

  button {
    padding: 10px;
    border-radius: 10px;
    border: none;
    color: white;
    background-color: black;
  }
`;

export default UserCards;
