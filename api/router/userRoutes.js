import express  from 'express';
import { bookmark,  setfollowerandfollwing, getotheruser, Login, Logout, Signup, ProfileById, ProfileEdit, handleProfileImage } from '../controllers/userControler.js';
import isAuthenticate from '../config/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

router.route('/signup').post(Signup);
router.route('/login').post(Login);
router.route('/logout').post(Logout);
router.route('/bookmark/:id').put(isAuthenticate ,bookmark);
// router.route('/myprofile').get(profile);
router.route('/profile/:id').get(ProfileById);
router.route('/otheruser').get(getotheruser);
router.route('/follow/:id').post(isAuthenticate,setfollowerandfollwing);

router.route('/edit').put(isAuthenticate,upload,ProfileEdit);
router.route('/edit/profile').post(isAuthenticate,upload,handleProfileImage);
export default router;