import { Router } from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import authMiddleware from "../middleware/auth.middleware.js"
import {
  uploadDocument,
  listDocuments,
  getDocumentById,
  chatDocument,
  quizDocument,
  flashcardsDocument
} from "../controllers/documents.controller.js"

const uploadDir = path.resolve("uploads")
fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")
    cb(null, `${Date.now()}-${safe}`)
  }
})

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowed = [
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ]
  cb(null, allowed.includes(file.mimetype))
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
})

const router = Router()

router.post("/upload", authMiddleware, upload.single("file"), uploadDocument)
router.get("/", authMiddleware, listDocuments)
router.get("/:id", authMiddleware, getDocumentById)
router.post("/:id/chat", authMiddleware, chatDocument)
router.post("/:id/quiz", authMiddleware, quizDocument)
router.post("/:id/flashcards", authMiddleware, flashcardsDocument)

export default router
