import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'

import DashboardPage from './pages/Dashboard/DashboardPage'
import DocumentListPage from './pages/Documents/DocumentListPage'
import DocumentDetailPage from './pages/Documents/DocumentDetailPage'
import FlashcardPage from './pages/Flashcards/FlashcardPage'
import QuizTakePage from './pages/Quizzes/QuizTakePage'
import QuizResultPage from './pages/Quizzes/QuizResultPage'
import ProfilePage from './pages/Profile/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* AUTH */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />

          {/* PROTECTED */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DocumentListPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/documents/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DocumentDetailPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/documents/:id/flashcards"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <FlashcardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/documents/:id/quiz"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <QuizTakePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz-result"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <QuizResultPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}