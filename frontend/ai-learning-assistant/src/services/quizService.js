import axios from "../utils/axiosInstance"

export const generateQuiz = async (documentId) => {
  const res = await axios.post(`/documents/${documentId}/quiz`)
  return res.data.quiz
}

export const submitQuiz = async (quizId, answers) => {
  const res = await axios.post(`/quizzes/${quizId}/submit`, { answers })
  return res.data
}

export const getQuizHistory = async (documentId) => {
  const res = await axios.get(`/quizzes/history`, {
    params: { documentId }
  })
  return res.data
}
