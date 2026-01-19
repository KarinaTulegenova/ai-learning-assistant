import type { Request, Response } from "express"
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const isProduction = process.env.NODE_ENV === "production"

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" })
    }

    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ email, password: hashed })

    res.status(201).json({ message: "User created" })
  } catch {
    res.status(500).json({ message: "Register failed" })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" })
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      return res.status(500).json({ message: "JWT secret missing" })
    }

    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "7d" })

    res.cookie("token", token, COOKIE_OPTIONS)

    res.json({
      id: user._id,
      email: user.email
    })
  } catch {
    res.status(500).json({ message: "Login failed" })
  }
}

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token", COOKIE_OPTIONS)
  res.json({ message: "Logged out" })
}

export const me = async (req: Request, res: Response) => {
  const userId = req.user?.userId
  if (!userId) {
    return res.status(401).json({ message: "Not authorized" })
  }

  const user = await User.findById(userId).select("-password")
  res.json(user)
}
