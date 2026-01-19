export const API_PATHS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me"
  },
  documents: {
    upload: "/documents/upload",
    list: "/documents",
    get: (id) => `/documents/${id}`,
    chat: (id) => `/documents/${id}/chat`,
    quiz: (id) => `/documents/${id}/quiz`,
    flashcards: (id) => `/documents/${id}/flashcards`
  }
}
