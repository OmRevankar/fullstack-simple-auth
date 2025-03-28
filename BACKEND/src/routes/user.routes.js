import { Router } from "express"
import { fetchUserDetails, refreshAccessToken, updateUserDetails, updateUserProfileImage, userLogin, userLogout, userRegister } from "../controllers/user.controllers.js";
import { upload } from "../middelwares/multer.middlewares.js";
import { verifyJWT } from "../middelwares/auth.middlewares.js";

const router = Router();

router.route('/register').post(upload.single("profileImage"),userRegister)
router.route('/login').post(userLogin);
router.route('/logout').post(verifyJWT,userLogout);
router.route('/update-profile-image').patch(verifyJWT,upload.single("profileImage"),updateUserProfileImage);
router.route('/update-details').patch(verifyJWT,updateUserDetails)
router.route('/refresh-access-token').post(refreshAccessToken);
router.route('/fetch-user').get(verifyJWT,fetchUserDetails);

export default router