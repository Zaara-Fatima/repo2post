import express from "express"
import { generatePostController } from "../controllers/post.controller.js"
import { protect } from "../middleware/auth.middleware.js"
import { validate } from "../middleware/validate.middleware.js"
import { generatePostRequestSchema } from "../validators/post.validator.js"

const router = express.Router()

router.post("/generate",protect, validate(generatePostRequestSchema) ,generatePostController )

export default router