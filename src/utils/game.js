export const CARD_COUNTS = [25, 30, 36, 42, 49]
export const ROUNDS_PER_LEVEL = 3
export const FINITE_LEVELS = 5
export const FINITE_TOTAL_ROUNDS = ROUNDS_PER_LEVEL * FINITE_LEVELS

export function getLevel(score) {
  return Math.floor(score / 3) + 1
}

export function getCardCount(level) {
  return CARD_COUNTS[Math.min(level - 1, CARD_COUNTS.length - 1)]
}

export function getRoundSeconds(level) {
  return Math.max(10 - (level - 1), 5)
}

export function getTimeRank(elapsedMs) {
  const seconds = elapsedMs / 1000

  if (seconds <= 45) return 'S'
  if (seconds <= 60) return 'A'
  if (seconds <= 75) return 'B'
  return 'C'
}

export function formatElapsedTime(elapsedMs) {
  return (elapsedMs / 1000).toFixed(2)
}

export function getGridColumns(cardCount) {
  if (cardCount <= 25) return 5
  if (cardCount <= 36) return 6
  return 7
}

export function shuffle(items, random = Math.random) {
  const result = [...items]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }

  return result
}

export function createRound(images, score, random = Math.random) {
  if (!Array.isArray(images) || images.length < 2) {
    throw new Error('至少需要两张不同图片才能创建游戏轮次。')
  }

  const level = getLevel(score)
  const cardCount = getCardCount(level)
  const targetIndex = Math.min(Math.floor(random() * images.length), images.length - 1)
  const target = images[targetIndex]
  const distractors = images.filter((image) => image.id !== target.id)
  const cards = [target]

  while (cards.length < cardCount) {
    const index = Math.min(
      Math.floor(random() * distractors.length),
      distractors.length - 1,
    )
    cards.push(distractors[index])
  }

  return {
    target,
    level,
    seconds: getRoundSeconds(level),
    columns: getGridColumns(cardCount),
    cards: shuffle(cards, random).map((image, index) => ({
      cardId: `card-${index}`,
      image,
    })),
  }
}
