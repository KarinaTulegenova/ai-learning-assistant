import { Router } from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { getLatestFlashcards } from "../controllers/flashcards.controller.js"

const router = Router()

router.get("/", authMiddleware, getLatestFlashcards)

export default router
