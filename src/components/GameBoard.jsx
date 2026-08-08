import ImageCard from './ImageCard.jsx'

function GameBoard({ cards, columns, status, wrongCardId, correctCardId, onSelect }) {
  return (
    <section
      className="game-board"
      style={{ '--grid-columns': columns }}
      aria-label="安洁莉娜图片选择区"
      aria-disabled={status !== 'playing'}
    >
      {cards.map((card, index) => {
        let cardState = ''
        if (card.cardId === wrongCardId) cardState = 'wrong'
        if (card.cardId === correctCardId) cardState = 'correct'

        return (
          <ImageCard
            key={card.cardId}
            card={card}
            index={index}
            state={cardState}
            disabled={status !== 'playing'}
            onSelect={onSelect}
          />
        )
      })}
    </section>
  )
}

export default GameBoard
