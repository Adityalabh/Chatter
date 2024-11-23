import bcryptjs from 'bcryptjs';
import { User } from "../model/User.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import sharp from "sharp";
import { getOtherUser } from '../../client/src/redux/userSlice.js';

dotenv.config();

const bcryptSalt = bcryptjs.genSaltSync(16);
const jwtsecret = process.env.jwt_secret;

// console.log("jwtsecret",jwtsecret);

function getloggeduserByReq(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtsecret, {}, async (err, userData) => {
            if (err) throw err;
            resolve(userData);
        })
    })
}

export const Signup = async (req, res) => {
    try {
        const { userName, email, description, password } = req.body;
        if (!userName || !email || !password) {
            return res.status(400).json('All field required');
        }
        const userRegistered = await User.findOne({ email });
        if (userRegistered) {
            return res.status(400).json('User already existed');
        }
        const userDoc = await User.create({
            userName, email, description,
            password: bcryptjs.hashSync(password, bcryptSalt),
        });
        // const {password ,...userWithoutPassword} = userDoc._doc;
        // return res.status(201).json(userDoc.select('-password'));
        const { password: _, ...userWithoutPassword } = userDoc._doc;//sending no password containing data to client

        return res.status(201).json(userWithoutPassword);
    }
    catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
}

export const Login = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json('All fields are required');
        }

        let registeredUser = await User.findOne({ email });
        // console.log("registeredUser", registeredUser);
        if (!registeredUser) {
            return res.status(404).json("incorrect email,user not found");
        }

        const passok = bcryptjs.compareSync(password, registeredUser.password);
        if (!passok) {
            return res.status(400).json('Incorrect password');
        }

        jwt.sign({ id: registeredUser._id, description: registeredUser.description, userName: registeredUser.userName, email: registeredUser.email }, jwtsecret, {}, (err, token) => {
            if (err) throw err;
            const { password, ...userWithoutPassword } = registeredUser._doc;
            res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json(userWithoutPassword);
        });

    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
}

export const bookmark = async (req, res) => {
    try {
        const loggedInUserId = await getloggeduserByReq(req);
        const messageId = req.params.id;
        const user = await User.findById(loggedInUserId.id);

        if (user.bookmark.includes(messageId)) {
            const result = await User.findByIdAndUpdate(loggedInUserId.id, { $pull: { bookmark: messageId } });
            return res.status(200).json('removed');
        }
        else {
            const result = await User.findByIdAndUpdate(loggedInUserId.id, { $push: { bookmark: messageId } });
            return res.status(200).json('inserted');
        }
    } catch (error) {
        return res.status(401).json({ error: 'user is notauthorized', details: error.message });
    }
}

export const Logout = (req, res) => {
    res.clearCookie('token', '').json('user logged out');
}

// export loggeduser populate

export const ProfileById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(404).json('no user available');
        }
        const user = await User.findById(id);
        res.json(user);
    } catch (error) {
        res.json(error.message);
    }

}
// export const profile = async (req, res) => {
//     try {
//         // const { token } = req.cookies;
//         // if (!token) {
//         //     return res.status(401).json("user not found");
//         // }
//         //  jwt.verify(token, jwtsecret, async (err, userData) => {
//         //     if (err) throw err;
//         //     const { userName, email, followers, following, bookmark } = await User.findById(userData.id);
//         //     const currUser = { userName, email,  followers, following, bookmark };
//         //     return res.json(currUser); 
//         // })

//         /* ---->>>  directly using function to get user id */
//         const userData = await getloggeduserByReq(req);
//         if(!userData){
//             res.json('token not availabale')
//         }
//         // console.log("loggeduser", userData);
//         const currUser = await User.findById(userData.id);
//         // const currUser = { _id, userName, email, followers, following, bookmark, description };
//         return res.json(currUser);
//     } catch (error) {
//         res.status(404).json('user not available');
//     }
// }

export const getotheruser = async (req, res) => {
    try {
        const userId = await getloggeduserByReq(req);
        // console.log(userId.id);
        if (!userId.id) {
            res.json('no user id');
        }
        const otherUser = await User.find({ _id: { $ne: userId.id } }).select('-password');
        if (!otherUser) {
            return res.json('no other user found ');
        }
        res.status(201).json(otherUser);
    } catch (error) {
        res.status(400).json(error.message);
    }
}

export const setfollowerandfollwing = async (req, res) => {
    try {
        const loggedUserId = await getloggeduserByReq(req);
        const otherUSerId = req.params.id;
        const loggedUser = await User.findById(loggedUserId.id);
        const otherUser = await User.findById(otherUSerId);

        if (!loggedUser.following.includes(otherUSerId)) {
            await otherUser.updateOne({ $push: { followers: loggedUserId.id } });
            await loggedUser.updateOne({ $push: { following: otherUSerId } });
            return res.json('you followed');
        }
        else if (loggedUser.following.includes(otherUSerId)) {
            await otherUser.updateOne({ $pull: { followers: loggedUserId.id } });
            await loggedUser.updateOne({ $pull: { following: otherUSerId } });
            return res.json(`you unfollowed`);
        }
    } catch (error) {
        res.json(error.message);
    }


}

export const ProfileEdit = async (req, res) => {
    try {

        console.log('req.files:', req.files); // Log the file details
        console.log('req.body:', req.body);

        const userId = await getloggeduserByReq(req);
        const { userName, email, description } = req.body;
        const bannerImage = req.files.bannerImage ? req.files.bannerImage[0] : null;
        let cloudResponseBanner;
        console.log("bannerImage", bannerImage);

        if (bannerImage) {

            const optimizeImage = await sharp(bannerImage.buffer)
                .resize({ width: 800, height: 450, fit: "contain" })
                .toFormat('jpeg', { quality: 80 })
                .toBuffer();
            const fileBanneruri = `data:image/jpeg;base64,${optimizeImage.toString('base64')}`;
            cloudResponseBanner = await cloudinary.uploader.upload(fileBanneruri);
        }


        const userDoc = await User.findById(userId.id).select("-password");
        if (userDoc._id.toString() === userId.id) {
            userDoc.set({
                userName,
                email,
                description,
                ...(cloudResponseBanner && { bannerImage: cloudResponseBanner.secure_url }),
                // ...(cloudResponseProfile && { profileImage: cloudResponseProfile.secure_url })
            });
            await userDoc.save();
        }
        res.json(userDoc);
    } catch (error) {
        console.log(error.message);
    }
}

export const handleProfileImage = async (req, res) => {
    try {
        const userData = await getloggeduserByReq(req);
        const profileImage = req.files.profileImage ? req.files.profileImage[0] : null;

        let cloudResponseProfile;


        if (profileImage) {
            const optimizeImage = await sharp(profileImage.buffer)
                .resize({ height: 400, width: 400, fit: "cover" })
                .toFormat('jpeg', { quality: 80 })
                .toBuffer();
            const fileuri = `data:image/jpeg;base64,${optimizeImage.toString('base64')}`

            cloudResponseProfile = await cloudinary.uploader.upload(fileuri);
        }
        const user = await User.findById(userData.id);
        user.set({
            ...(cloudResponseProfile && { profileImage: cloudResponseProfile.secure_url })
        })

        await user.save();
        res.json(user);
    } catch (err) {
        console.log(err.message);
    }
}