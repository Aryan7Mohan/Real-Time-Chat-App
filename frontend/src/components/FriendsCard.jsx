import React from "react";
import styled from "styled-components";

const FriendsCard = ({ username, email }) => {
  return (
    <Container>
      <div className="friend-photo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          class="bi bi-person-circle"
          viewBox="0 0 16 16"
        >
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
          <path
            fill-rule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
          />
        </svg>
      </div>
      <div className="friend-details">
        <h2>{username}</h2>
        <h4>Email: {email}</h4>
        {/* <h4>Gender: {gender}</h4> */}
      </div>
    </Container>
  );
};

const Container = styled.div`
display: flex;
gap:1rem;
  background-color: #cf9fff;
  border-radius: 2rem;
  padding: 1rem;
`;

export default FriendsCard;
