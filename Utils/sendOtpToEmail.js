import nodemailer from "nodemailer";
import "dotenv/config"

const sendOtpToEmail = async (email, otp) => {
    try {
        // 1. Create a transporter
        const transporter = nodemailer.createTransport({
            service: "gmail", // or use host, port, secure if custom SMTP
            auth: {
                user: process.env.USER_EMAIL, // your email address
                pass: process.env.USER_PASS, // your email app password
            },
        });

        // 2. Define the mail options
        const mailOptions = {
            from: `Full-Stack-Auth`,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
            html: `<p>Your OTP code is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
        };

        // 3. Send the email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(error);
    }
};

export default sendOtpToEmail