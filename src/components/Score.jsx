function Score({ score, level, mode, totalRounds }) {
  const isFinite = mode === 'finite'

  return (
    <div
      className="score-panel"
      aria-label={isFinite ? `当前进度 ${score}/${totalRounds}，难度 ${level}` : `当前得分 ${score}，等级 ${level}`}
    >
      <div className="stat-block">
        <span className="stat-label">{isFinite ? 'PROGRESS' : 'SCORE'}</span>
        <strong>{isFinite ? `${score}/${totalRounds}` : String(score).padStart(2, '0')}</strong>
      </div>
      <div className="stat-divider" aria-hidden="true" />
      <div className="stat-block">
        <span className="stat-label">{isFinite ? 'DIFFICULTY' : 'LEVEL'}</span>
        <strong>Lv.{level}</strong>
      </div>
    </div>
  )
}

export default Score
