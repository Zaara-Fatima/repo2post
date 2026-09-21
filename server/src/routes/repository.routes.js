import express from "express"
import { getRepo, getRepoByIdController, repoController } from "../controllers/repository.controller.js"
import { protect } from "../middleware/auth.middleware.js" 
import { validate } from "../middleware/validate.middleware.js"
import { analyzeRepositoryRequestSchema, repositoryIdParamSchema } from "../validators/repository.validator.js"

const router = express.Router()

router.post("/analyze",protect, validate(analyzeRepositoryRequestSchema), repoController)
router.get("/",protect, getRepo)
router.get("/:id",protect,validate(repositoryIdParamSchema, 'params'), getRepoByIdController
)

export default router

// {
//   "email": "day7test@example.com",
//   "password": "Test1234!"
// }