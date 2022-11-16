import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PhoneIcon from "@mui/icons-material/Phone";
import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";
import styled from "styled-components";
import { host } from "../utils/APIRoutes";
import "../importfont.css";
// import "./App.css";

// const socket = io.connect("http://localhost:5000");

const VideoChat = ({
  currentUser,
  friend,
  setCurrentChat,
  setChatMode,
  receivingCall,
  setReceivingCall,
  callerSignal,
  setCallerSignal,
}) => {
  // const params = useParams();
  // const navigate = useNavigate();
  // const [currentUser, setCurrentUser] = useState(undefined);
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  // const [caller, setCaller] = useState("");
  const [callAccepted, setCallAccepted] = useState(false);
  // const [idToCall, setIdToCall] = useState(null);
  const [callEnded, setCallEnded] = useState(false);
  // const [callDeclined, setCallDeclined] = useState(false);
  const socket = useRef();
  const myVideo = useRef({ srcObject: null });
  const userVideo = useRef({ srcObject: null });
  const connectionRef = useRef();

  // async function checkUser() {
  //   if (!localStorage.getItem("chat-app-user")) {
  //     navigate("/login");
  //   } else {
  //     setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
  //   }
  // }

  useEffect(() => {
    // checkUser();

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    //   checkIfOnline()
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io.connect(host);
      socket.current.emit("add-user", currentUser._id, friend._id);

      // socket.current.on("online", (status) => {
      //   console.log("status: " + status);
      //   if (!status) {
      //     setFriendStatus(false);
      //   }
      // });

      socket.current.on("user-details", (data) => {
        setMe(data.userSocket);
        // setIdToCall(data.friendSocket);
      });

      socket.current.on("callUser", (data) => {
        setReceivingCall(true);
        // setCaller(data.from);
        setCallerSignal(data.signal);
        setCurrentChat(data.name);
        console.log(data);
        setChatMode(false);
      });

      // socket.current.on("call-declined", (data) => {
      //   setCallDeclined(true);
      // });

      // socket.current.on("me", (id) => {
      //   setMe(id);
      // });

      //   callUser();
    }
  }, [currentUser]);

  // useEffect(() => {
  //   if(idToCall) {
  //     callUser(idToCall)
  //   }
  // }, [idToCall])

  const handleCallButtonClick = () => {
    if (me) callUser(friend._id);
  };

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", async (data) => {
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: currentUser,
      });
    });

    socket.current.on("callEnded", async () => {
      console.log("callEnded");
      setCallEnded(true);
      setCallerSignal(null);
      // await connectionRef.current.destroy();
      setChatMode(true);
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const rejectCall = () => {
    socket.current.emit("reject-call", { userId: friend._id });
    setCallEnded(true);
    setCallerSignal(null);
    // await connectionRef.current.destroy();
    setChatMode(true);
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("answerCall", { signal: data, to: friend._id });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    socket.current.on("callEnded", async () => {
      console.log("callEnded");
      setCallEnded(true);
      setReceivingCall(false);

      // myVideo.current.srcObject.getVideoTracks().forEach((track) => track.stop());
      // userVideo.current.srcObject.getVideoTracks().forEach((track) => track.stop());
      // connectionRef.current.srcObject
      //   .getTracks()
      //   .forEach((track) => track.stop());
      // connectionRef.current = null;
      myVideo.current.srcObject = null;
      userVideo.current.srcObject = null;
      // connectionRef.current.destroy();
      // setStream(null);
      // if (stream) {
      //   stream.getTracks().forEach((track) => track.stop());
      //   stream.getVideoTracks()[0].stop();
      //   setStream(null);
      // }
      setChatMode(true);
    });

    peer.signal(callerSignal);
    connectionRef.current = stream;
  };

  const leaveCall = async () => {
    // setCallEnded(true);
    socket.current.emit("disconnect-call", { to: friend._id });
    setCallEnded(true);
    setReceivingCall(false);
    setCallerSignal(null);
    // if(stream)
    // myVideo.current.srcObject.getVideoTracks().forEach((track) => track.stop());
    // userVideo.current.srcObject.getVideoTracks().forEach((track) => track.stop());
    // connectionRef.current.srcObject
    //   .getVideoTracks()
    //   .forEach((track) => track.stop());
    // connectionRef.current = null;
    myVideo.current.srcObject = null;
    userVideo.current.srcObject = null;
    // connectionRef.current.destroy();
    // if (stream) {
    //   // stream.getTracks().forEach((track) => track.stop());
    //   stream.getVideoTracks()[0].stop();
    //   setStream(null);
    // }
    setChatMode(true);
  };

  return (
    <Container>
      <div className="container1">
        <div className="video-chat-navbar">
          <button className="btn" onClick={leaveCall}>Return To Chat</button>
        </div>
        {/* <div className="return-div">
        <button>Return</button>
      </div> */}
        <div className="video-container">
          {/* <div className="video">
            {stream && (
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                style={{ width: "300px" }}
              />
            )}
            <h3>{currentUser.username}</h3>
          </div> */}
          {callAccepted && !callEnded ? (
            <div className="video">
              {/* <div className="video-box"> */}
              <video
                playsInline
                ref={userVideo}
                autoPlay
                style={{ width: "600px" }}
              />
              {/* </div> */}
              <h3>{friend.username}</h3>
            </div>
          ) : null}
        </div>
        {/* <div className="make-call">
          <button onClick={handleCallButtonClick}>
            Call {friend.username}?
          </button>
        </div> */}
        <div className="call-button">
          {callAccepted && !callEnded ? (
            <Button
              variant="contained"
              color="secondary"
              className="btn end-call-button"
              onClick={leaveCall}
            >
              End Call
            </Button>
          ) : (
            <Button
              onClick={handleCallButtonClick}
              className="btn start-call-button"
            >
              <IconButton color="primary" aria-label="call">
                <PhoneIcon fontSize="large" />
              </IconButton>
              {friend.username}
            </Button>
          )}
        </div>
        <div>
          {receivingCall && !callAccepted ? (
            <div className="caller">
              <h2>Incoming call from {friend.username}...</h2>
              <Button className="btn" variant="contained" color="primary" onClick={answerCall}>
                Accept Call
              </Button>
              {/* <Button variant="contained" color="danger" onClick={rejectCall}>
                Decline
              </Button> */}
            </div>
          ) : null}
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

  .caller {
    margin-top: 30px;
    display: flex;
    gap: 1rem;
    button {
      background-image: linear-gradient(to right, #fbc2eb 0%, #a6c1ee 51%, #fbc2eb 100%);
      padding: 0.5rem;
      color: black;
    }
  }
  .video-chat-navbar {
    margin-right: auto;
    margin-bottom: 20px;
    padding: 20px;
    button {
      font-family: "Raleway", sans-serif;
      color: black;
      border: none;
      padding: 15px;
      border-radius: 0.8rem;
      font-size: 1rem;
      cursor:pointer;
      /* background-color: #cf9fff; */
      background-image: linear-gradient(to right, #f6d365 0%, #fda085 51%, #f6d365 100%);
    }
  }
  .start-call-button {
    border-radius: 1rem;
    padding: 8px;
    padding-right: 10px;
    color: black;
    border: 1px solid #50c878;
    background-image: linear-gradient(to right, #84fab0 0%, #8fd3f4 51%, #84fab0 100%);
  }
  .start-call-button:hover {
    background-color: #50c878;
  }

  .end-call-button {
    border-radius: 1rem;
    padding: 0.5rem;
    color: black;
    /* border: 1px solid crimson; */
    background-color: crimson;
  }

  .btn {
    /* padding: 15px; */
    text-transform: uppercase;
    transition: 0.5s;
    background-size: 200% auto;
    /* color: white; */
    /* text-shadow: 0px 0px 10px rgba(0,0,0,0.2);*/
    box-shadow: 0 0 10px #eee;
    border-radius: 16px;
  }
  .btn:hover {
    background-position: right center; /* change the direction of the change here */
  }
  .container1 {
    .return-div {
      align-items: start;
      display: flex;
      justify-content: flex-start;
    }
    height: 85vh;
    width: 85vw;
    border-radius: 25px;
    background-color: #00000076;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    .video-container {
      display: flex;
      min-width: 500px;
      min-height: 300px;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 30px;
      padding: 40px;
      border: 1px solid #50c878;
      .video {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        /* .video-box {
          display:flex;
          border: 2px solid limegreen;
          padding: 40px 0px;
          width: 300px;
          height: 300px;
          align-items: center;
          justify-content:center;
        } */
      }
    }
    .make-call {
      margin-bottom: 20px;
      /* button {
        padding: 8px;
        border-radius: 0.5rem;
        border: none;
        background-color: #cf9fff;
      } */
    }
    /* display: grid;
    grid-template-columns: 25% 75%; */
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default VideoChat;
