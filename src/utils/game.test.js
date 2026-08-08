import test from 'node:test'
import assert from 'node:assert/strict'
import {
  getInfiniteGraceState,
  getInfiniteRank,
  getLevel,
  INFINITE_GRACE_ROUNDS,
} from './game.js'

test('infinite grace remains available through the third max-difficulty round', () => {
  assert.equal(INFINITE_GRACE_ROUNDS, 18)
  assert.equal(getInfiniteGraceState(18, false), 'available')
  assert.equal(getInfiniteGraceState(18, true), 'used')
  assert.equal(getInfiniteGraceState(19, false), 'expired')
})

test('infinite rank follows completed-round thresholds', () => {
  assert.equal(getInfiniteRank(0), 'C')
  assert.equal(getInfiniteRank(5), 'C')
  assert.equal(getInfiniteRank(6), 'B')
  assert.equal(getInfiniteRank(11), 'B')
  assert.equal(getInfiniteRank(15), 'A')
  assert.equal(getInfiniteRank(17), 'A')
  assert.equal(getInfiniteRank(18), 'S')
})

test('difficulty level stays capped after reaching maximum difficulty', () => {
  assert.equal(getLevel(15), 6)
  assert.equal(getLevel(18), 6)
  assert.equal(getLevel(99), 6)
})
