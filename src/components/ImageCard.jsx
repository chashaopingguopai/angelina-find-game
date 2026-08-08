function ImageCard({ card, index, state, disabled, onSelect }) {
  const className = ['image-card', state ? `image-card--${state}` : '']
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={className}
      type="button"
      disabled={disabled}
      aria-label={`选择第 ${index + 1} 张图片`}
      onClick={() => onSelect(card)}
    >
      <img src={card.image.src} alt="" draggable="false" />
    </button>
  )
}

export default ImageCard
