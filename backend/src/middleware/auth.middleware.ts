import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token
    if (!token) {
      return res.status(401).json({ message: "Not authorized" })
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      return res.status(500).json({ message: "JWT secret missing" })
    }

    const decoded = jwt.verify(token, secret)
    if (typeof decoded === "string") {
      return res.status(401).json({ message: "Invalid token" })
    }

    req.user = decoded

    next()
  } catch {
    return res.status(401).json({ message: "Invalid token" })
  }
}

export default authMiddleware
