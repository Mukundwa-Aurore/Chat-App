const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});

app.use(express.static('public'));

io.on('connection', socket => {
    console.log('New user connected');
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', message);
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
