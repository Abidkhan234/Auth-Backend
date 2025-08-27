import express from "express";
import userRoute from "./userRoute.route.js";
import checkingRoute from "./checkingRoute.route.js";

const mainRoute = express.Router();

mainRoute.use("/auth", userRoute);
mainRoute.use("/checking", checkingRoute);

export default mainRoute