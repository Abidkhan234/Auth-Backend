import express from 'express'
import authMiddleWare from '../MiddleWares/auth.middleWare.js'
import { logoutUser, refreshAccessToken, signInUser, signUpUser, userNewPassword, userPasswordReset, userProfileData, verifyOtp } from '../Controllers/auth.controller.js';

const userRoute = express.Router();

userRoute.post("/sign-up", signUpUser);

userRoute.post("/sign-in", signInUser);

userRoute.post("/logout", logoutUser);

userRoute.post("/refresh-token", refreshAccessToken);

userRoute.post("/forget-password", userPasswordReset);

userRoute.post("/reset-password", userPasswordReset);

userRoute.post("/verify-otp/:email", verifyOtp);

userRoute.post("/new-password/:email", userNewPassword);

userRoute.get("/profile-data", authMiddleWare, userProfileData);

export default userRoute