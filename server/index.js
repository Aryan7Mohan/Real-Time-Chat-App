const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const autocomplete = require('./routes/autocomplete');
// const conversationRoute = require('./routes/conversationRoute');
// const messageRoute = require("./routes/messageRoute");
const messagesRoute = require("./routes/messagesRoute");
const socket = require("socket.io");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes)
app.use("/autocomplete", autocomplete);
// app.use("/api/conversation", conversationRoute);
// app.use("/api/messages", messageRoute);
app.use("/api/messages", messagesRoute)

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection was successful!");
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on PORT ${process.env.PORT}`);
});


const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.emit("me", socket.id);

  socket.on("add-user", (userId, friendId) => {
    const sendUserSocket = onlineUsers.get(friendId);
    socket.emit("user-details", {
      userSocket: socket.id,
      friendSocket: sendUserSocket
    })
    // if(!sendUserSocket) {
    //   socket.emit("online", false);
    // }
    // else {
    //   socket.emit("online", true);
    // }
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if(sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });

  socket.on("callUser", (data) => {
    const sendUserSocket = onlineUsers.get(data.userToCall);
    const currentUserSocket = onlineUsers.get(data.from);
    io.to(sendUserSocket).emit("callUser", {
      signal: data.signalData,
      from: currentUserSocket,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    const userSocket = onlineUsers.get(data.to);
    io.to(userSocket).emit("callAccepted", data.signal);
  });

  socket.on("disconnect-call", (data) => {
    const userSocket = onlineUsers.get(data.to);
    io.to(userSocket).emit("callEnded");
    console.log("disconnect");
  });

  socket.on("reject-call", (data) => {
    const userSocket = onlineUser.get(data.userId);
    io.to(userSocket).emit("call-declined");
  })
});