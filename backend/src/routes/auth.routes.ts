import { Router } from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { register, login, logout, me } from "../controllers/auth.controller.js"

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/me", authMiddleware, me)

export default router
