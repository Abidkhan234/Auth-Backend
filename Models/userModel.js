import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    refreshToken: {
        default: null,
        type: String
    },
    otp: {
        default: null,
        type: String
    },
    otpExpiry: {
        default: null,
        type: String
    }
});

const User = mongoose.model("users", userSchema);

export default User;