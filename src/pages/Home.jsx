import { useMemo } from 'react'
import FanDisclaimer from '../components/FanDisclaimer.jsx'
import titleLineOne from '../assets/UI素材/title-line-1.png'
import titleLineTwo from '../assets/UI素材/title-line-2.png'
import titleLineThree from '../assets/UI素材/title-line-3.png'
import { HOME_GIFS, UI_ASSETS } from '../data/images.js'

function Home({ onStart }) {
  const heroGif = useMemo(
    () => HOME_GIFS[Math.floor(Math.random() * HOME_GIFS.length)],
    [],
  )

  return (
    <main className="home-page">
      <img className="home-stars" src={UI_ASSETS.stars} alt="" aria-hidden="true" />
      <img
        className="home-rabbit-pattern"
        src={UI_ASSETS.rabbitPattern}
        alt=""
        aria-hidden="true"
      />

      <section className="home-card">
        <div className="home-copy">
          <h1 className="kinetic-title" aria-label="把星星都找遍，安洁莉娜在哪里？">
            <img className="title-line title-line--one" src={titleLineOne} alt="" aria-hidden="true" />
            <img className="title-line title-line--two" src={titleLineTwo} alt="" aria-hidden="true" />
            <img className="title-line title-line--three" src={titleLineThree} alt="" aria-hidden="true" />
            <span className="kinetic-star kinetic-star--one" aria-hidden="true">✦</span>
            <span className="kinetic-star kinetic-star--two" aria-hidden="true">★</span>
          </h1>
          <p className="home-intro">
            默认挑战共 15 轮、5 个难度阶段。记住目标动作，尽快找到唯一正确的图片！
          </p>

          <div className="rules" aria-label="游戏规则">
            <div><strong>01</strong><span>观察本轮目标</span></div>
            <div><strong>02</strong><span>快速找出图片</span></div>
            <div><strong>03</strong><span>完成挑战获得评级</span></div>
          </div>

          <div className="mode-actions">
            <button className="primary-button" type="button" onClick={() => onStart('finite')}>
              <span>开始 15 轮挑战</span>
              <span aria-hidden="true">→</span>
            </button>
            <button className="secondary-button" type="button" onClick={() => onStart('infinite')}>
              <span>∞</span> 无限模式
            </button>
          </div>
          <p className="rank-rules">时间评级：S ≤ 45秒 · A ≤ 60秒 · B ≤ 75秒 · C 完成挑战</p>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <span className="hero-orbit hero-orbit--one" />
          <span className="hero-orbit hero-orbit--two" />
          <img src={heroGif.src} alt="" />
          <span className="hero-caption">今天在{heroGif.label}</span>
          {UI_ASSETS.flowers.map((flower, index) => (
            <img
              className={`hero-flower hero-flower--${index + 1}`}
              src={flower}
              alt=""
              key={flower}
            />
          ))}
        </div>
      </section>

      <FanDisclaimer className="fan-disclaimer--home" />
    </main>
  )
}

export default Home
