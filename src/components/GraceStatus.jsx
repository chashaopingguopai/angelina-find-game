import { getInfiniteGraceState } from '../utils/game.js'

const STATUS_COPY = {
  available: {
    label: '容错保护 · 1 次',
    detail: '第 1–18 轮有效',
  },
  used: {
    label: '容错保护 · 已使用',
    detail: '再次点错将结束',
  },
  expired: {
    label: '容错保护 · 已失效',
    detail: '点错立即结束',
  },
}

function GraceStatus({ roundNumber, graceUsed }) {
  const status = getInfiniteGraceState(roundNumber, graceUsed)
  const copy = STATUS_COPY[status]

  return (
    <span
      className={`grace-status grace-status--${status}`}
      aria-label={`${copy.label}，${copy.detail}`}
    >
      <span aria-hidden="true">{status === 'available' ? '◇' : status === 'used' ? '◆' : '×'}</span>
      <span>
        <strong>{copy.label}</strong>
        <small>{copy.detail}</small>
      </span>
    </span>
  )
}

export default GraceStatus
