import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import connectDB from "./config/db.js"
import authRoutes from "./routes/auth.routes.js"
import testRoutes from "./routes/test.routes.js"
import documentsRoutes from "./routes/documents.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js"
import quizzesRoutes from "./routes/quizzes.routes.js"
import flashcardsRoutes from "./routes/flashcards.routes.js"

dotenv.config()
connectDB()

const app = express()

const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173"

app.use(
  cors({
    origin: clientOrigin,
    credentials: true
  })
)

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/test", testRoutes)
app.use("/api/documents", documentsRoutes)
app.use("/api/quizzes", quizzesRoutes)
app.use("/api/flashcards", flashcardsRoutes)
const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log("Server running on", PORT))
