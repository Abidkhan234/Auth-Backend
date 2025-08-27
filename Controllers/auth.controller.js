import User from "../Models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import "dotenv/config"
import { generateAccessToken, generateRefreshToken } from "../Utils/generateToken.js";
import sendOtpToEmail from "../Utils/sendOtpToEmail.js";

const signUpUser = async (req, res) => {
    try {

        const { userName, email, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ email }, { userName }],
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(409).json({
                    status: 409,
                    message: "Email already exists"
                });
            } else {
                return res.status(409).json({
                    status: 409,
                    message: "Username already exists"
                });
            }
        }

        const hashPassword = bcrypt.hashSync(password, 10);

        await User.create({
            userName,
            email,
            password: hashPassword
        })

        return res.status(200).send({ status: 200, message: "Sign up Successfull" })
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 500, message: "Internal server error" })
    }
}

const signInUser = async (req, res) => {
    try {

        const { userName, email, password } = req.body;

        const user = await User.findOne({
            $or: [{ userName }, { email }]
        }).select("+password");

        if (!user) {
            return res.status(404).send({ status: 404, message: "Name OR Email Not Found" })
        }

        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).send({ status: 400, message: "Incorrect Password" });
        }

        const accessToken = generateAccessToken("20s", user.email, user._id, user.userName);

        const refreshToken = generateRefreshToken("70s", user._id);

        user.refreshToken = refreshToken;

        await user.save();

        return res.status(200).send({ status: 200, message: "Sign In Successfull", accessToken, refreshToken });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 500, message: `Internal server ${error.message}`, })
    }
}

const logoutUser = async (req, res) => {
    return res.status(200).send({ status: 200, message: "Logout Successfully" })
}

const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_key);

        const user = await User.findOne({ _id: decoded.id });

        if (!user) {
            return res.status(404).send({ status: 404, message: "User not found" });
        }

        const newAccessToken = generateAccessToken("20s", user.email, user._id);

        return res.status(200).send({ status: 200, message: "Token refreshed", accessToken: newAccessToken })
    } catch (error) {
        console.log(error);
        if (error.message.includes("jwt expired")) {
            return res.status(401).send({ status: 401, message: "Sign In again" })
        }
        res.status(500).send({ status: 500, message: "Internal server error" })
    }
};

const userPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(401).send({ status: 401, message: "Email is required" })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({ status: 404, message: "Email not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        const otpExpiry = Date.now() + 10 * 60 * 1000;

        await sendOtpToEmail(email, otp);

        const hashOtp = bcrypt.hashSync(otp.toString(), 10);

        user.otp = hashOtp;
        user.otpExpiry = otpExpiry;

        await user.save();

        return res.status(200).send({
            status: 200, message: "OTP Send to email"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 500, message: "Internal server error" })
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const email = req.params.email;

        if (!otp) {
            return res.status(401).send({ status: 401, message: "OTP is required" })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({ status: 404, message: "User not found" });
        }

        const isValidOtp = bcrypt.compareSync(otp, user.otp);

        if (!isValidOtp) {
            return res.status(401).send({ status: 401, message: "Invalid OTP" })
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(401).send({ status: 401, message: "OTP Expired" })
        }

        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        return res.status(200).send({
            status: 200,
            message: "OTP verified successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 500,
            message: "Internal server error"
        })
    }
}

const userNewPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const email = req.params.email;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({ status: 404, message: "User not found" });
        }

        if (!newPassword) {
            return res.status(401).send({ status: 401, message: "New password required" })
        }

        const hashNewPassword = bcrypt.hashSync(newPassword, 10);

        user.password = hashNewPassword;

        await user.save();

        return res.status(200).send({
            status: 200,
            message: "Password Updated Successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 500,
            message: "Internal server error"
        })
    }
}

const userProfileData = async (req, res) => {
    try {

        const { userData } = req;

        const user = await User.findOne({ _id: userData.id });

        if (!user) {
            res.status(404).send({ status: 404, message: "User not found" })
            return
        }

        const { userName, email } = user;

        return res.status(200).send({
            status: 200,
            userName,
            email
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 500,
            message: "Internal server error"
        })
    }
}

export { signUpUser, signInUser, refreshAccessToken, userPasswordReset, verifyOtp, userNewPassword, logoutUser, userProfileData };