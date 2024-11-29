import express from 'express';
import dotenv from 'dotenv';
import databaseConnect from './config/databaseConnect.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoutes from './router/userRoutes.js';
import messageRoutes from './router/messageRoutes.js';
import chatRoutes from './router/chatRotutes.js';
import {app,server} from './socket/socket.js';
import path from 'path';

const __dirname = path.resolve();
console.log(__dirname);
dotenv.config();

// const app = express();
console.log('URL',process.env.URL);
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

// app.use(cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173", // Use an environment variable for deployment
//     credentials: true,
// }));

app.use(cors({
    origin:'https://chatter-xrmf.onrender.com', // Use an environment variable for deployment
    // origin:'http://localhost:5173',
    credentials: true,
}));

app.use(express.urlencoded({
    extended:true
}));

app.use('/user',userRoutes);  
app.use('/message',messageRoutes);
app.use('/chat',chatRoutes);

app.use(express.static(path.join(__dirname,'/client/dist')));//for uploading frontend to server
// this route will to serve frontend
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','dist','index.html'));
});

app.get('/test', (req, res) => {
    res.json('test running');
    console.log(`server running at port ${PORT}`);
});

server.listen(PORT,()=>{
    databaseConnect();
    console.log(`connected  server listening to port ${PORT}`);
});



