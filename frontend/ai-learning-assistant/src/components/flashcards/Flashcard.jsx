export default function Flashcard({ front, back, flipped, onFlip }) {
  return (
    <div className="flip-card" onClick={onFlip}>
      <div className={`flip-card-inner ${flipped ? "is-flipped" : ""}`}>
        <div className="flip-card-face flip-card-front">
          <p className="text-lg font-semibold text-gray-900">{front}</p>
          <p className="text-xs text-gray-400 mt-4">Ашу үшін басыңыз</p>
        </div>
        <div className="flip-card-face flip-card-back">
          <p className="text-lg font-semibold text-gray-900">{back}</p>
          <p className="text-xs text-gray-400 mt-4">Қайту үшін басыңыз</p>
        </div>
      </div>
    </div>
  )
}
