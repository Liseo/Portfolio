import { useWindows } from '../windowStore'

// 바탕화면 폴더 아이콘 → {app} 창 모드로 열기(앱당 1개, 있으면 재사용).
export default function DesktopIcon({ app }) {
  const { openApp } = useWindows()
  return (
    <button className="icon" onClick={() => openApp(app, { maximized: false })}>
      <span className="icon-glyph" aria-hidden>{app.icon}</span>
      <span className="icon-label">{app.title}</span>
    </button>
  )
}
