import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../model/User.js";
import cookieParser from "cookie-parser";

dotenv.config({
    path:'../config/.env'
});

const jwtsecret = process.env.jwt_secret;

const isAuthenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log(token);
        if (!token) {
            
            return res.status(401).json('user not authorized');
        }
        const decoded = await jwt.verify(token, jwtsecret);
        // console.log("decoded",decoded);

        if (!decoded) {
            return res.status(404).json('user not found');
        }

        req.user = decoded.id;
        next();
        
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error', details: err.message });
    }
}

export default isAuthenticate;