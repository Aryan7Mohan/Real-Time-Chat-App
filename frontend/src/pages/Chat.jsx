import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host, getFriendsRoute } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";
import VideoChat from "./VideoChat";

const Chat = () => {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callerSignal, setCallerSignal] = useState();
  const [chatMode, setChatMode] = useState(true);


  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

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
    if(currentUser) {
      socket.current = io(host);
      socket.current.emit('add-user', currentUser._id);
      socket.current.on("callUser", (data) => {
        setReceivingCall(true);
        // setCaller(data.from);
        setCallerSignal(data.signal);
        setCurrentChat(data.name);
        console.log(data)
        setChatMode(false);
      });
      // socket.current.on("callUser", (data) => {
      //   console.log(data);
      //   setCurrentChat(data.name);
      //   setChatMode(false);
      // })
    }
  }, [currentUser])

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

  return (
    <Container>
    {chatMode ? (
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} setChatMode={setChatMode} />
        )}
      </div>
    ): (
      <VideoChat currentUser = {currentUser} friend = {currentChat} setCurrentChat={setCurrentChat} setChatMode={setChatMode} receivingCall={receivingCall} setReceivingCall={setReceivingCall} callerSignal={callerSignal} setCallerSignal={setCallerSignal} />
    )}

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

/* background: #04E0DA;
background: -webkit-linear-gradient(top left, #04E0DA, #90CBED);
background: -moz-linear-gradient(top left, #04E0DA, #90CBED);
background: linear-gradient(to bottom right, #04E0DA, #90CBED); */

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
`;

export default Chat;
