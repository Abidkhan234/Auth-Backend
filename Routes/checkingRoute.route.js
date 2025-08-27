import express from 'express'
import authMiddleWare from '../MiddleWares/auth.middleWare.js'

const checkingRoute = express.Router();

checkingRoute.get("/", authMiddleWare, (req, res) => {
    res.status(200).send({ status: 200, message: "Checking working" })
})

export default checkingRoute;