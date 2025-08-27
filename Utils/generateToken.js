import jwt from 'jsonwebtoken'
import "dotenv/config"

const generateExpiryTime = (time) => {
    const unit = time.slice(-1);
    const value = parseInt(time.slice(0, -1), 10);

    if (unit === "s") return value;
    if (unit === "m") return value * 60;
    if (unit === "h") return value * 3600;
    if (unit === "d") return value * 86400;

    throw new Error("Invalid time format");
};

const generateAccessToken = (expiryTime, userEmail, userId, userName) => {
    const token = jwt.sign({ email: userEmail, id: userId, userName }, process.env.JWT_ACCESS_key, { expiresIn: generateExpiryTime(expiryTime) });
    return token;
}

const generateRefreshToken = (expiryTime, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_REFRESH_key, { expiresIn: generateExpiryTime(expiryTime) });
    return token;
}

export { generateAccessToken, generateRefreshToken };
