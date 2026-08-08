import { useEffect, useRef, useState } from 'react'

function Timer({ duration, resetKey, running, onExpire }) {
  const [remainingMs, setRemainingMs] = useState(duration * 1000)
  const onExpireRef = useRef(onExpire)

  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  useEffect(() => {
    setRemainingMs(duration * 1000)

    if (!running) return undefined

    const deadline = Date.now() + duration * 1000
    let expired = false

    const update = () => {
      const nextRemaining = Math.max(0, deadline - Date.now())
      setRemainingMs(nextRemaining)

      if (nextRemaining === 0 && !expired) {
        expired = true
        onExpireRef.current()
      }
    }

    update()
    const timerId = window.setInterval(update, 100)

    return () => window.clearInterval(timerId)
  }, [duration, resetKey, running])

  const seconds = Math.ceil(remainingMs / 1000)
  const progress = Math.max(0, Math.min(1, remainingMs / (duration * 1000)))
  const isUrgent = seconds <= 3

  return (
    <div
      className={`timer ${isUrgent ? 'timer--urgent' : ''}`}
      style={{ '--timer-progress': progress }}
      role="timer"
      aria-live={isUrgent ? 'assertive' : 'off'}
      aria-label={`剩余 ${seconds} 秒`}
    >
      <span className="timer-label">TIME</span>
      <strong>{seconds}</strong>
      <span className="timer-unit">SEC</span>
      <span className="timer-track" aria-hidden="true">
        <span className="timer-fill" />
      </span>
    </div>
  )
}

export default Timer
