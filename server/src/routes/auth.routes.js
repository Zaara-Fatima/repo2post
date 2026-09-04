import express from "express"
import { loginController, logoutController, refreshController, registerController } from "../controllers/auth.controller.js"

const router = express.Router()
router.post("/register",registerController)
router.post("/login",loginController)
router.post("/refresh",refreshController)
router.post("/logout",logoutController)

export default router