function FanDisclaimer({ className = '' }) {
  return (
    <aside className={`fan-disclaimer ${className}`.trim()} aria-label="同人创作声明">
      <strong>非商业同人创作</strong>
      <span>
        本项目由玩家制作，与鹰角网络及《明日方舟》官方无关。相关角色与原作权利归原权利人所有，图片素材版权归其各自作者所有。如有侵权请联系删除。
      </span>
    </aside>
  )
}

export default FanDisclaimer
