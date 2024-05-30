const express = require("express")
const bodyParser = require("body-parser")
const { Server } = require("socket.io")

const io = new Server(8001, {
    cors: true
});
const app = express();

app.use(bodyParser.json())

const emailToSocketIdMap = new Map();
const socketToemailIdMap = new Map();

io.on("connection", (socket) => {
    console.log("New Connection", socket.id);
    socket.on("room:join", (data) => {
        const { email, room } = data;
        console.log(`User ${email} joined Room ${room}`);
        emailToSocketIdMap.set(email, socket.id);
        socketToemailIdMap.set(socket.id, email);
        io.to(room).emit("user:joined", { email, id: socket.id });
        socket.join(room)
        io.to(socket.id).emit("room:join", data);
    })

    socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incomming:call", { from: socket.id, offer })
    })

    socket.on("call:accepted", ({ to, ans }) => {
        io.to(to).emit("call:accepted", { from: socket.id, ans })
    })

    socket.on("peer:nego:needed", ({ to, offer }) => {
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer })
    })

    socket.on("peer:nego:done", ({to, ans}) => {
        io.to(to).emit("peer:nego:final", { from: socket.id, ans })
    })
})

app.listen(8000, () => {
    console.log("HTTP Server listening on PORT 8000");
})