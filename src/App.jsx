import { useState } from 'react'
import Home from './pages/Home.jsx'
import Game from './pages/Game.jsx'

function App() {
  const [screen, setScreen] = useState('home')
  const [gameMode, setGameMode] = useState('finite')

  const startGame = (mode = 'finite') => {
    setGameMode(mode)
    setScreen('game')
  }

  return screen === 'home' ? (
    <Home onStart={startGame} />
  ) : (
    <Game mode={gameMode} onExit={() => setScreen('home')} />
  )
}

export default App
