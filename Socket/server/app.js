import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
const port = 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.get("/", function (req, res) {
    res.send("Hello World!");
});

io.on("connection", (socket) => {
    console.log("User Connected!", socket.id);

    socket.on("message", ({ room, message }) => {
        console.log(room, message);
        io.to(room).emit("recieve-message", message);
    });

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`User joined room ${room}`);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(port, function () {
    console.log(`Server is listening at ${port}`);
});
