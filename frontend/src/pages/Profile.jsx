import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import FriendsCard from "../components/FriendsCard";
import { getUserDetailsRoute, getFriendsRoute } from "../utils/APIRoutes";

const Profile = () => {
  const params = useParams();
  const [currentUser, setCurrentUser] = useState({});
  const [contacts, setContacts] = useState([]);

  const fetchCurrentUser = async () => {
    const { data } = await axios.post(getUserDetailsRoute, {
      username: params.username,
    });
    if (data.status === true) {
      console.log(data.user);
      setCurrentUser(data.user);
    }
  };

  async function fetchData() {
    if (currentUser && currentUser._id) {
      const data = await axios.get(`${getFriendsRoute}/${currentUser._id}`);
      // console.log(data);
      setContacts(data.data);
    }
  }

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  useEffect(() => {
    fetchCurrentUser();
  }, []);
  return (
    <Container>
      <div className="container">
        <div className="user-profile">
          <div className="profile-picture">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="120"
              height="120"
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
            <img src="../assets/" alt="" />
          </div>
          <div className="user-details">
            <div className="username">
              <span className="user-details-span">Username: </span>
              {currentUser.username}
            </div>
            <div className="email">
              <span className="user-details-span">Email: </span>
              {currentUser.email}
            </div>
            {/* <div className="gender">
              <div className="user-details-span">Gender: </div>
              {currentUser.gender}
            </div> */}
          </div>
        </div>
        <div className="friends-container">
        <div className="friends-heading">
        <h1>Friends' List</h1>
        <button>Go Back</button>
        </div>
          <div className="friends-list">
            {contacts.map((contact, index) => {
              return (
                <FriendsCard
                  username={contact.username}
                  email={contact.email}
                  // gender={contact.gender}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;

  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .container {
    height: 85vh;
    width: 85vw;
    border-radius: 25px;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }

  .friends-heading {
    display: flex;
    h1 {
      color: #cf9fff;

      margin-right: auto;
    }
    padding: 1rem;
      border-bottom: 1px solid #cf9fff;
  }
  .user-profile {
    display: grid;
    grid-template-rows: 30% 70%;
    border: 1px solid lime;
  }
  .user-details-span {
    color: #cf9fff;
    /* font-size: 1.5rem; */
  }
  .user-details {
    font-size: 1.5rem;
    padding: 20px;
    div {
      margin-bottom: 15px;
    }
  }
  .profile-picture {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid lime;
  }

  .friends-list {
    padding: 1rem;
    gap: 1rem;
    display: flex;
    flex-wrap: wrap;
  }
`;

export default Profile;
