import { useCallback, useEffect, useRef, useState } from 'react'
import FanDisclaimer from '../components/FanDisclaimer.jsx'
import GameBoard from '../components/GameBoard.jsx'
import GraceStatus from '../components/GraceStatus.jsx'
import Score from '../components/Score.jsx'
import Timer from '../components/Timer.jsx'
import { ANGELINA_IMAGES, UI_ASSETS } from '../data/images.js'
import {
  createRound,
  FINITE_TOTAL_ROUNDS,
  formatElapsedTime,
  getInfiniteGraceState,
  getInfiniteRank,
  getLevel,
  getTimeRank,
} from '../utils/game.js'

const RANK_COMMENTS = {
  S: '像星轨尚未冷却，你已经找到了全部答案。',
  A: '只让几颗星星多闪了一会儿，下一次或许就是 S。',
  B: '步调稳稳地穿过了五段星路，再快一点就能触到 A。',
  C: '每一颗星都被认真看见了，熟悉之后会走得更轻快。',
}

const INFINITE_RANK_COMMENTS = {
  S: '保护星光已经留在身后，你仍然走进了更远的星图。',
  A: '最高难度已经亮起，只差几步就能穿过保护线。',
  B: '辨认的节奏已经成形，下一段星路会更加清晰。',
  C: '这次先记住星星之间的差别，下一次会看得更快。',
}

function getIncompleteComment(completedRounds) {
  const remainingRounds = FINITE_TOTAL_ROUNDS - completedRounds

  if (completedRounds === 0) {
    return '星图才刚刚展开，这次先记住第一颗星的模样。'
  }

  if (completedRounds <= 4) {
    return `你已经认出了 ${completedRounds} 颗星，下一次会更快进入状态。`
  }

  if (completedRounds <= 8) {
    return `星路已经走过 ${completedRounds} 站，寻找的节奏正在慢慢对上。`
  }

  if (completedRounds <= 11) {
    return `已经越过大半星图，再完成 ${remainingRounds} 轮就能抵达终点。`
  }

  return `终点就在下一片星光之后，只差 ${remainingRounds} 轮就能完成挑战。`
}

function Game({ mode = 'finite', onExit }) {
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(() => createRound(ANGELINA_IMAGES, 0))
  const [roundId, setRoundId] = useState(0)
  const [status, setStatus] = useState('playing')
  const [wrongCardId, setWrongCardId] = useState(null)
  const [correctCardId, setCorrectCardId] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [result, setResult] = useState(null)
  const [graceUsed, setGraceUsed] = useState(false)
  const transitionTimerRef = useRef(null)
  const feedbackTimerRef = useRef(null)
  const elapsedMsRef = useRef(0)
  const roundStartedAtRef = useRef(performance.now())
  const graceUsedRef = useRef(false)

  const clearTimers = useCallback(() => {
    window.clearTimeout(transitionTimerRef.current)
    window.clearTimeout(feedbackTimerRef.current)
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  const handleExpire = useCallback(() => {
    const elapsedMs = elapsedMsRef.current + (performance.now() - roundStartedAtRef.current)
    setResult({
      type: 'timeout',
      elapsedMs,
      rank: mode === 'infinite' ? getInfiniteRank(score) : undefined,
    })
    setStatus('ended')
    setFeedback(null)
    setWrongCardId(null)
  }, [mode, score])

  const handleSelect = (card) => {
    if (status !== 'playing') return

    if (card.image.id !== round.target.id) {
      if (mode === 'infinite') {
        const graceState = getInfiniteGraceState(score + 1, graceUsedRef.current)

        if (graceState !== 'available') {
          clearTimers()
          const elapsedMs = elapsedMsRef.current + (performance.now() - roundStartedAtRef.current)
          setResult({ type: 'wrong', elapsedMs, rank: getInfiniteRank(score) })
          setStatus('ended')
          setFeedback(null)
          setWrongCardId(null)
          return
        }

        graceUsedRef.current = true
        setGraceUsed(true)
      }

      window.clearTimeout(feedbackTimerRef.current)
      setWrongCardId(card.cardId)
      setFeedback({
        type: 'wrong',
        message: mode === 'infinite'
          ? '容错保护已消耗，再次点错将立即结束挑战！'
          : '不是这一个，再找找！',
      })
      feedbackTimerRef.current = window.setTimeout(() => {
        setWrongCardId(null)
        setFeedback(null)
      }, mode === 'infinite' ? 1200 : 650)
      return
    }

    clearTimers()
    const nextScore = score + 1
    const nextElapsedMs = elapsedMsRef.current + (performance.now() - roundStartedAtRef.current)
    elapsedMsRef.current = nextElapsedMs
    setStatus('success')
    setCorrectCardId(card.cardId)
    setFeedback({ type: 'success', message: '找到了！+1' })
    setScore(nextScore)

    transitionTimerRef.current = window.setTimeout(() => {
      if (mode === 'finite' && nextScore >= FINITE_TOTAL_ROUNDS) {
        setResult({
          type: 'completed',
          elapsedMs: nextElapsedMs,
          rank: getTimeRank(nextElapsedMs),
        })
        setStatus('ended')
        return
      }

      setRound(createRound(ANGELINA_IMAGES, nextScore))
      setRoundId((value) => value + 1)
      setWrongCardId(null)
      setCorrectCardId(null)
      setFeedback(null)
      roundStartedAtRef.current = performance.now()
      setStatus('playing')
    }, 550)
  }

  const restart = () => {
    clearTimers()
    setScore(0)
    setRound(createRound(ANGELINA_IMAGES, 0))
    setRoundId((value) => value + 1)
    setStatus('playing')
    setResult(null)
    setGraceUsed(false)
    graceUsedRef.current = false
    elapsedMsRef.current = 0
    roundStartedAtRef.current = performance.now()
    setWrongCardId(null)
    setCorrectCardId(null)
    setFeedback(null)
  }

  if (status === 'ended') {
    const finalLevel = getLevel(score)
    const completedChallenge = mode === 'finite' && result?.type === 'completed'
    const failedChallenge = mode === 'finite' && result?.type === 'timeout'
    const infiniteChallenge = mode === 'infinite'

    return (
      <main className="result-page">
        <img className="result-stars" src={UI_ASSETS.stars} alt="" aria-hidden="true" />
        <section className="result-card">
          <span className="eyebrow">
            {completedChallenge ? 'CHALLENGE COMPLETE' : failedChallenge ? 'CHALLENGE OVER' : 'SEARCH COMPLETE'}
          </span>
          <img
            className="result-rabbit"
            src={UI_ASSETS.rabbits[(finalLevel - 1) % UI_ASSETS.rabbits.length]}
            alt=""
            aria-hidden="true"
          />
          <h1>
            {completedChallenge
              ? '挑战完成！'
              : failedChallenge
                ? '挑战未完成'
                : result?.type === 'wrong'
                  ? '选错了，挑战结束'
                  : '时间到！'}
          </h1>

          {completedChallenge ? (
            <>
              <p>15 轮找图总用时</p>
              <strong className="final-score final-score--time">{formatElapsedTime(result.elapsedMs)}</strong>
              <span className="final-score-label">秒</span>
              <div className={`rank-badge rank-badge--${result.rank.toLowerCase()}`}>
                时间评价 · {result.rank}
              </div>
              <p className={`rank-comment rank-comment--${result.rank.toLowerCase()}`}>
                <span aria-hidden="true">✦</span>
                {RANK_COMMENTS[result.rank]}
              </p>
            </>
          ) : infiniteChallenge ? (
            <>
              <p>{result?.type === 'wrong' ? '本次无尽挑战最终得分' : '倒计时结束，本次最终得分'}</p>
              <strong className="final-score">{score}</strong>
              <span className="final-score-label">
                分 · 用时 {formatElapsedTime(result?.elapsedMs ?? 0)} 秒
              </span>
              <div className="infinite-result-badges">
                <div className="level-badge">游戏等级 · Lv.{finalLevel}</div>
                <div className={`rank-badge rank-badge--${result.rank.toLowerCase()}`}>
                  无尽评级 · {result.rank}
                </div>
              </div>
              <p className={`rank-comment rank-comment--${result.rank.toLowerCase()}`}>
                <span aria-hidden="true">✦</span>
                {INFINITE_RANK_COMMENTS[result.rank]}
              </p>
            </>
          ) : (
            <>
              <p>{failedChallenge ? '本次完成进度' : '这次一共找到了'}</p>
              <strong className="final-score">{score}</strong>
              <span className="final-score-label">
                {failedChallenge ? `/ ${FINITE_TOTAL_ROUNDS} 轮` : '张安洁莉娜'}
              </span>
              <div className={`level-badge${failedChallenge ? ' level-badge--with-comment' : ''}`}>
                {failedChallenge ? `止步难度 · Lv.${Math.min(round.level, 5)}` : `游戏等级 · Lv.${finalLevel}`}
              </div>
              {failedChallenge && (
                <p className="progress-comment">
                  <span aria-hidden="true">✦</span>
                  {getIncompleteComment(score)}
                </p>
              )}
            </>
          )}
          <div className="result-actions">
            <button className="primary-button" type="button" onClick={restart}>
              {mode === 'finite' ? '重新挑战' : '再玩一次'} <span aria-hidden="true">↻</span>
            </button>
            <button className="text-button" type="button" onClick={onExit}>
              返回首页
            </button>
          </div>
        </section>
        <FanDisclaimer className="fan-disclaimer--result" />
      </main>
    )
  }

  return (
    <main className="game-page">
      <header className="game-header">
        <button className="back-button" type="button" onClick={onExit} aria-label="返回首页">
          ←
        </button>

        <section className="target-panel" aria-label={`目标：${round.target.label}`}>
          <div className="target-image">
            <img src={round.target.src} alt={`目标：${round.target.label}`} />
          </div>
          <div>
            <span className="target-label">本轮目标</span>
            <strong>找到正在{round.target.label}的安洁莉娜</strong>
          </div>
        </section>

        <Timer
          duration={round.seconds}
          resetKey={roundId}
          running={status === 'playing'}
          onExpire={handleExpire}
        />

        <Score score={score} level={round.level} mode={mode} totalRounds={FINITE_TOTAL_ROUNDS} />
      </header>

      <section className="board-shell">
        <div className="board-heading">
          <span>
            ROUND {String(roundId + 1).padStart(2, '0')}
            {mode === 'finite' ? ` / ${FINITE_TOTAL_ROUNDS}` : ''}
          </span>
          <span className="board-heading-meta">
            {mode === 'infinite' && (
              <GraceStatus roundNumber={roundId + 1} graceUsed={graceUsed} />
            )}
            <span>{round.cards.length} 个候选</span>
          </span>
        </div>
        <GameBoard
          key={roundId}
          cards={round.cards}
          columns={round.columns}
          status={status}
          wrongCardId={wrongCardId}
          correctCardId={correctCardId}
          onSelect={handleSelect}
        />
      </section>

      {feedback && (
        <div className={`feedback feedback--${feedback.type}`} role="status" aria-live="polite">
          {feedback.message}
        </div>
      )}
      <FanDisclaimer className="fan-disclaimer--game" />
    </main>
  )
}

export default Game
