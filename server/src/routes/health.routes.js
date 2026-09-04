import express from "express"
import { healthCheck } from "../controllers/health.controller.js"

const route = express.Router()

route.get("/health", healthCheck)

export default route