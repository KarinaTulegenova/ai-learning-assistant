import { Router, Request, Response } from "express"
import authMiddleware from "../middleware/auth.middleware.js"

const router = Router()

router.get("/protected", authMiddleware, (req: Request, res: Response) => {
  res.json({
    message: "Access granted",
    userId: req.user?.userId
  })
})

export default router
