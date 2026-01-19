export default function AuthForm({ title, onSubmit, children }) {
  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl mb-4">{title}</h1>
      {children}
      <button className="btn mt-4" onClick={onSubmit}>
        Жіберу
      </button>
    </div>
  )
}
