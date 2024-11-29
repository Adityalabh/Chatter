import isAuthenticate from '../config/auth.js';
import { Message } from '../model/Message.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { User } from '../model/User.js';
import sharp from 'sharp';//for image sharp
import cloudinary from '../utils/cloudinary.js';
import { Comment } from '../model/comment.js';
import { getReceiverSocketId, io } from '../socket/socket.js';

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

export const create = async (req, res) => {
    try {
        // const { token } = req.cookies;
        const userData = await getloggeduserByReq(req);//for taking id from token
        const { description } = req.body;
        const postImage = req.files.postImage ? req.files.postImage[0] : null;
        console.log("postImage", postImage);

        // if (!token) 
        //     console.log("No token found, sending 401 response");
        //     return res.status(401).json({ error: "authentication token is missing" });
        // }

        // jwt.verify(token, jwtsecret, {}, async (err, userData) => {
        //     if (err) throw err;
        //     try {
        //         const messageData = await Message.create({
        //             description,
        //             senderId: userData.id,
        //         });
        //         return res.status(201).json(messageData);
        //     }
        //     catch (err) {
        //         return res.status(500).json('message is not created');
        //     }
        // });


        let cloudinaryResponse;
        if (postImage) {
            const optimizeImage = await sharp(postImage.buffer)//for resizing image
                .resize({ height: 550, width: 800, fit: "contain" })
                .toFormat('jpeg', { quality: 80 })
                .toBuffer();
            const fileUri = `data:image/jpeg;base64,${optimizeImage.toString('base64')}`;
            cloudinaryResponse = await cloudinary.uploader.upload(fileUri);
        }

        try {
            const messageData = await Message.create({
                description,
                senderId: userData.id,
                ...(cloudinaryResponse && { postImage: cloudinaryResponse.secure_url })
            });
            return res.status(201).json(messageData);
        }
        catch (err) {
            return res.status(500).json({ error: 'message is not created', details: err.message });
        }
    } catch (err) {
        return res.status(500).json({ error: "Internal server error", details: err.message });
    }
}

export const deletemessage = async (req, res) => {
    try {
        const id = req.params.id;
        const userData = await getloggeduserByReq(req);
        const message = await Message.findById(id);
        try {
            if (userData.id === message.senderId.toString()) {
                const delMEssage = await Message.findByIdAndDelete(id);

                if (delMEssage === null) {
                    return res.status(404).json(delMEssage);
                }
                await Comment.deleteMany({ message: id });
                return res.status(201).json({ message: 'message deleted', delMEssage });
            }
            else {
                res.json('user not authorized');
            }

        } catch (error) {
            res.json('messsage not found')
        }
    } catch (error) {
        console.log('messaage is not deleted');
    }
}

export const likeOrDeslike = async (req, res) => {
    try {
        const loggedInUserId = await getloggeduserByReq(req);
        const messageId = req.params.id;
        const message = await Message.findById(messageId);
        if (message.like.includes(loggedInUserId.id)) {
            // dislike
            await Message.findByIdAndUpdate(messageId, { $pull: { like: loggedInUserId.id } });

            const user = await User.findById(loggedInUserId.id);
            const messageOwnerId = message.senderId.toString();

            if (messageOwnerId !== loggedInUserId.id) {
                const notification = {
                    type: 'dislike',
                    userId: loggedInUserId.id,
                    userDetails: user,
                    message: 'Disliked you post',
                }
                console.log(notification);
                const messageOwnerSocketId = getReceiverSocketId(messageOwnerId);
                io.to(messageOwnerSocketId).emit('notification', notification);
            }
            return res.json('user disliked');
        } else {
            // like
            await Message.findByIdAndUpdate(messageId, { $push: { like: loggedInUserId.id } });
            const user = await User.findById(loggedInUserId.id);
            const messageOwnerId = message.senderId.toString();
            // console.log('messageOwnerId',messageOwnerId,'loggedInUserId',loggedInUserId.id);
            // console.log(messageOwnerId !== loggedInUserId.id);
            // sending notification after liking post
            // if message creator is not equals to loggeduser or likingUser
            if (messageOwnerId !== loggedInUserId.id) {
                const notification = {
                    type: 'like',
                    userId: loggedInUserId.id,
                    userDetails: user,
                    message: ' Liked your post'
                }
                console.log(notification);
                const messageOwnerSocketId = getReceiverSocketId(messageOwnerId);
                io.to(messageOwnerSocketId).emit('notification', notification);
            }
            return res.json('user liked');
        }
    } catch (error) {
        return res.json(error.message);
    }
}

export const getAllmessage = async (req, res) => {
    try {
        const loggedUserId = await getloggeduserByReq(req);;
        const loggedUser = await User.findById(loggedUserId.id);

        if (!loggedUser) {
            return res.json("user and its message not found");
        }

        const loggedUsermessg = await Message.find({ senderId: loggedUserId.id }).sort({ createdAt: -1 })
        // .populate({
        //     path: "comments", sort: { createdAt: -1 },
        //     populate: {
        //         path: "author",
        //         select: "userName profileImage"
        //     }
        // });

        const followingmessg = await Promise.all(loggedUser.following.map((otherUserId) => {
            return Message.find({ senderId: otherUserId }).sort({ createdAt: -1 })
            // .populate({
            //     path: 'comments', sort: { createdAt: -1 },
            //     populate: {
            //         path: "author",
            //         select: "userName  profileImage"
            //     }

            // });
        }));
        const allmessage = loggedUsermessg.concat(...followingmessg);
        if (!allmessage.length) {
            return res.status(204).json([]);
        }
        console.log(allmessage);

        return res.status(200).json(allmessage);
    } catch (error) {
        // if (error.code === "ECONNRESET") {
        //     console.log('ECONNRESET connection retrying...');
        //     setTimeout(() => getAllmessage(), 1000);
        // }
        res.json(error.message);
    }
}

export const getFollowingmessg = async (req, res) => {
    try {
        const loggedUserId = await getloggeduserByReq(req);
        const loggedUser = await User.findById(loggedUserId.id);

        if (!loggedUser) {
            res.json('no user found');
        }

        const followingmessg = await Promise.all(loggedUser.following.map((otherUserId) => {
            return Message.find({ senderId: otherUserId }).sort({ createdAt: -1 })
            // .populate({
            //     path: "comments", sort: { createdAt: -1 },
            //     populate: {
            //         path: "author",
            //         select: "userName profileImage"
            //     }
            // });
        }))

        if (!followingmessg) {
            return res.json('no following messaages');
        }

        const flatMessages = followingmessg.flat();
        return res.json(flatMessages);
    }
    catch (error) {
        res.json({ message: 'messg not found', details: error.message });
    }
}

export const setComments = async (req, res) => {
    try {
        const userData = await getloggeduserByReq(req);
        const postId = req.params.id;
        const { text } = req.body;
        const message = await Message.findById(postId);



        const commnt = await Comment.create({
            text,
            author: userData.id,
            message: postId,
        });

        await commnt.populate({ path: "author", select: "userName profileImage" });

        message.comments.push(commnt._id);
        await message.save();
        return res.status(200).json(commnt);
    } catch (error) {
        res.status(500).json(error.message)
    }
}

export const getComments = async (req, res) => {
    try {
        const messgId = req.params.id;
        const message = await Message.findById(messgId);
        const allcomments = await Promise.all(message.comments.map((comment) => {
            return Comment.findById(comment).populate({ path: 'author', select: 'userName profileImage' });
        }));

        res.json(allcomments);
    } catch (err) {
        res.json(err.message);
    }
}

export const commentDelete = async (req, res) => {
    try {
        const commentId = req.params.id;
        const { messageId } = req.body;

        const deleComm = await Comment.findByIdAndDelete(commentId);

        if (deleComm === null) {
            res.json(deleComm);
        }

        const message = await Message.findById(messageId);

        if (!message) {
            res.json('message is null');
        }

        message.comments = message.comments.filter(id => id.toString() !== commentId);
        await message.save();
        res.json(message);
    } catch (error) {
        console.log(error.message);
    }
}

export const getMessgById = async (req, res) => {
    try {
        const messgId = req.params.id;
        const messg = await Message.findById(messgId);
        res.json(messg);
    } catch (error) {
        res.json(error.message)
    }
}