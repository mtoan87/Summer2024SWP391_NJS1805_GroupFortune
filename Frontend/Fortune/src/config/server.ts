// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5174",
        methods: ["GET", "POST"]
    }
});

let currentBid = 0;

io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Send the current bid to the new client
    socket.emit('bidUpdate', currentBid);
    
    socket.on('newBid', (bid) => {
        currentBid = bid;
        // Broadcast the new bid to all clients
        io.emit('bidUpdate', currentBid);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(4000, () => {
    console.log('Server is running on port 5174');
});
