import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.URL,
        method: ['GET', 'POST']
    }
});

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on('connection', (socket) => {
    const userId = socket.handshake.query.id;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }
    console.log('userId connect',userId, 'socketId', socket.id);
    io.emit('getOnlineUser', Object.keys(userSocketMap)); //this is server broadcasting the getOnlineUser

    socket.on('disconnect', () => {
        if (userId) {
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUser', Object.keys(userSocketMap));
        console.log('userId disconnect',userId, 'socketId', socket.id);

    })
});

export { app, server, io };