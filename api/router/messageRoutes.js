import express from "express";
import { commentDelete, create, deletemessage, getAllmessage, getComments, getFollowingmessg, getMessgById, likeOrDeslike, setComments } from "../controllers/messageControler.js";
import isAuthenticate from "../config/auth.js";
import upload from "../config/multer.js";

const router = express.Router();


router.route('/create').post(isAuthenticate, upload, create);
router.route('/delete/:id').delete(isAuthenticate, deletemessage);
router.route('/like/:id').put(isAuthenticate, likeOrDeslike);
router.route('/allmessages').get(getAllmessage);
router.route('/followingmessg').get(getFollowingmessg);
router.route('/post/comment/:id').post(isAuthenticate, setComments);
router.route('/allComments/:id').get(getComments);
router.route(`/commentDelete/:id`).post(isAuthenticate,commentDelete);
router.route(`/messgById/:id`).get(isAuthenticate,getMessgById);
export default router;