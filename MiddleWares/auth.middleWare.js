import jwt from 'jsonwebtoken'
import "dotenv/config"

const authMiddleWare = async (req, res, next) => {

    try {

        const headers = req.headers["authorization"];

        if (headers == undefined) {
            return res.status(401).send({ status: 401, message: "Login In First" })
        } else {
            const token = headers.split(' ')[1];

            const userData = jwt.verify(token, process.env.JWT_ACCESS_KEY);

            if (!userData) {
                return res.status(400).send({ status: 400, message: "User not found" })
            }

            req.userData = userData;

            next();
        }

    } catch (error) {
        console.log(error);
        if (error.message.includes("jwt expired") || error.message.includes("invalid token")) {
            return res.status(401).send({ status: 401, message: "Token expired" });
        }
        return res.status(500).send({ status: 500, message: "Internal Error" });
    }

}

export default authMiddleWare;