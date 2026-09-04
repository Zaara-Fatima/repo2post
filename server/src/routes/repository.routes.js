import express from "express"
import { getRepo, getRepoByIdController, repoController } from "../controllers/repository.controller.js"
import { protect } from "../middleware/auth.middleware.js" 

const router = express.Router()

router.post("/analyze",protect, repoController)
router.get("/",protect, getRepo)
router.get("/:id",protect, getRepoByIdController
)

export default router