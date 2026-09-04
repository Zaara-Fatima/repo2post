import express from "express"
import { generatePostController } from "../controllers/post.controller.js"
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/generate",protect ,generatePostController )

export default router