import { Chat } from "../model/chat.js";
import { Conversation } from "../model/converstaion.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Message } from "../model/Message.js";
import { getReceiverSocketId, io } from "../socket/socket.js";


dotenv.config();
const jwtsecret = process.env.jwt_secret;

if (!jwtsecret) {
    throw new Error('JWT secret is not defined. Check your environment variables.');
}

function getloggeduserByReq(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtsecret, {}, async (err, userData) => {
            if (err) throw err;
            resolve(userData);
        })
    })
}

export const sendChat = async (req, res) => {
    try {
        const sender = await getloggeduserByReq(req);
        const senderId = sender.id;  // Cast senderId to ObjectId
        const receiverId = req.params.id;
        const { message } = req.body;
        console.log('sederId',senderId,'receiverId',receiverId,'message',message);

        // if converstion exist
        let conversation = await Conversation.findOne({
            participant: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participant: [senderId, receiverId]
            });
        }

        const newChat = await Chat.create({
            senderId,
            receiverId,
            message
        });

        if (newChat) conversation.messages.push(newChat._id);

        await Promise.all([conversation.save(), newChat.save()]);


        // impliment socket io for real time messaages first get receiver id
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newChat);
        }

        return res.status(200).json(newChat);

    } catch (err) {
        res.status(400).json(err.message);
    }
}

export const getChat = async (req, res) => {
    try {
        const senderId = await getloggeduserByReq(req);
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participant: { $all: [senderId.id, receiverId] }
        }).populate({path:'messages',select:'senderId receiverId message'});

        if (!conversation) {
            return res.status(200).json([]);
        }

        return res.status(200).json(conversation?.messages);
    } catch (err) {
        console.log(err.message);
    }
}