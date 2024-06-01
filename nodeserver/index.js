//node server
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});

const users = {};

io.on("connection", (socket) => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
        console.log("User connected", name);
    });


    socket.on("send_message", (data) => {
        socket.broadcast.emit("receive", {data: data, name: users[socket.id]});
        console.log(data);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(4001, () => {
    console.log("SERVER RUNNING");
});