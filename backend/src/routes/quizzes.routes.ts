import { Router } from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import {
  listQuizzes,
  submitQuiz,
  listQuizHistory
} from "../controllers/quizzes.controller.js"

const router = Router()

router.get("/", authMiddleware, listQuizzes)
router.get("/history", authMiddleware, listQuizHistory)
router.post("/:quizId/submit", authMiddleware, submitQuiz)

export default router
