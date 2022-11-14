import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import UserCards from "../components/UserCards";
import { host } from "../utils/APIRoutes";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { addFriendRoute } from "../utils/APIRoutes";

const Search = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [currentUser, setCurrentUser] = useState(undefined);
  const [users, setUsers] = useState([]);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  const handleSubmit = async (event, userId) => {
    event.preventDefault();
    // console.log(currentUserId);
    const { data } = await axios.post(addFriendRoute, {
      userId1: currentUser._id,
      userId2: userId,
    });
    if (data.status === "Friends Forever! <3") {
      toast("Friends forever <3", toastOptions);
    }
  };

  const handleReturn = () => {
    navigate('/');
  }

  async function checkUser() {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    } else {
      setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
    }
  }
  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    fetchData();
  }, [value]);

  async function fetchData() {
    // console.log(value);
    let userArr = [];
    if (value !== "") {
      let data = await fetch(`${host}/autocomplete?term=${value}`)
        .then((results) => results.json())
        .then((results) =>
          results.map((result) => {
            userArr.push({
              id: result._id,
              username: result.username,
              email: result.email,
            });
          })
        );
      console.log(userArr);
    }
    setUsers(userArr);
  }

  function handleChange(event) {
    setValue(event.target.value);
  }

  return (
    <Container>
      <div className="container">
        <div className="input-container">
          <div>
            <button onClick={handleReturn}>Return</button>
          </div>
          <div className="input-box">
            <h2>Search users you want to send a message to:</h2>
            <input type="text" onChange={(e) => handleChange(e)} />
          </div>
        </div>
        <div className="results-container">
          {users.map((user) => (
            <UserCards
              currentUserId={currentUser._id}
              userId={user.id}
              username={user.username}
              email={user.email}
              handleSubmit={handleSubmit}
            />
          ))}
        </div>
      </div>
      <ToastContainer />
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
  /* background-image: linear-gradient(90deg, #410076, #8820dd); */
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
    border-radius: 25px;
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    color: white;
    grid-template-columns: 30% 70%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
  .input-container {
    border-radius: 25px 0px 0px 25px;
    button {
      border: none;
      padding: 0.5rem;
      border-radius: 0.5rem;
      background-color: #9a86f3;
      color: white;
      margin-left: 20px;
      margin-top: 20px;
      font-size: 1.2rem;
    }
    gap: 30%;
    color: black;
    background-color: hotpink;
    display: flex;
    flex-direction: column;
  }
  .input-box {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    justify-content: center;
    font-size: 20px;
  }
  .input-box input {
    padding: 10px;
    border-radius: 10px;
    border: none;
  }
`;

export default Search;
