import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  changePassword,
  getUserTokens,
  claimTokens,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/").get(verifyJWT, getUser);
router.route("/changePassword").patch(verifyJWT, changePassword);
router.route("/tokens").get(verifyJWT, getUserTokens);
router.route("/tokens/claim").post(verifyJWT, claimTokens);

export default router;
