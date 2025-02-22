const express = require("express");
const socket = require("socket.io");
const http = require("http");
const cors = require("cors");
const app = express();

const { adduser, remuser, getuser, getuserinrooms } = require("./users.js");

const { Server } = require("socket.io");
const port = process.env.port || 5000;

const server = http.createServer(app);

const router = require("./router");
const { text } = require("stream/consumers");

app.use(router);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = adduser({ id: socket.id, name, room });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the ${user.room}`,
    });

    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name}, joined the chat!`,
    });
    io.to(user.room).emit("roomdata", {
      room: user.room,
      users: getuserinrooms(user.room),
    });

    callback();
  });

  socket.on("sendmessage", (message, callback) => {
    const user = getuser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });
    io.to(user.room).emit("roomdata", {
      room: user.room,
      users: getuserinrooms(user.room),
    });

    callback();
  });

  socket.on("disconnect", () => {
    const user = remuser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name}, just left`,
      });
    }
  });
});

server.listen(port, () => {
  console.log(`server started at ${port}`);
});
