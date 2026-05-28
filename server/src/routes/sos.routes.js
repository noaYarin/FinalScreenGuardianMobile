import express from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { sendSosAlertController } from "../controllers/sos.controller.js";

const router = express.Router();

router.post("/", authJwt, sendSosAlertController);

export default router;