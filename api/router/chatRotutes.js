import express from "express";
import isAuthenticate from "../config/auth.js";
import { getChat, sendChat } from "../controllers/chatController.js";
const router = express.Router();

router.route('/send/:id').post(isAuthenticate,sendChat);
router.route('/getchat/:id').get(isAuthenticate,getChat);

export default router;