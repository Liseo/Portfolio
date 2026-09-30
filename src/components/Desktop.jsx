import { useMemo, useRef, useState } from 'react'
import { APPS, GALLERY, SITE } from '../desktopConfig'
import { useWindows } from '../windowStore'
import Clock from './Clock'
import DesktopIcon from './DesktopIcon'
import ProjectDetail from './ProjectDetail'
import ProjectsView from './ProjectsView'
import Window from './Window'

export default function Desktop() {
  const { windows, activeId, openApp, closeWindow, genieClose } = useWindows()
  const [view, setView] = useState('desktop') // 'desktop' | 'projects'
  const projectsView = view === 'projects'

  // 바탕화면: 갤러리 이미지 하나를 랜덤으로 골라 블러 배경으로 (새로고침마다 변경)
  const wallpaper = useMemo(
    () => GALLERY[Math.floor(Math.random() * GALLERY.length)]?.image,
    [],
  )

  // macOS 독 자석 확대: 커서 거리에 따라 각 아이콘 확대 + 이웃 밀어내기
  const dockRef = useRef(null)
  const baseCenters = useRef([]) // 정지 상태의 아이콘 중심 X (진입 시 1회 측정 → 고정)
  const DOCK = { MAX: 1.05, SIGMA: 78, PUSH: 24 }

  // 호버 진입: 트랜지션 잠깐 끄고 base 위치로 되돌린 뒤 중심점을 측정(고정)
  const onDockEnter = () => {
    const items = [...(dockRef.current?.querySelectorAll('.dock-item') || [])]
    if (!items.length) return
    items.forEach((el) => {
      el.style.transition = 'none'
      el.style.transform = ''
      el.style.margin = ''
    })
    void dockRef.current.offsetWidth // 강제 리플로우
    baseCenters.current = items.map((el) => {
      const r = el.getBoundingClientRect()
      return r.left + r.width / 2
    })
    items.forEach((el) => {
      el.style.transition = ''
    })
  }

  // 이동: 측정 없이 고정 중심점으로만 계산(레이아웃 재측정 X → 떨림 없음)
  const applyDockMagnify = (cursorX) => {
    const items = dockRef.current?.querySelectorAll('.dock-item')
    if (!items || !baseCenters.current.length) return
    items.forEach((el, i) => {
      const d = cursorX - baseCenters.current[i]
      const scale = 1 + DOCK.MAX * Math.exp(-(d * d) / (2 * DOCK.SIGMA * DOCK.SIGMA))
      el.style.transform = `scale(${scale})`
      el.style.margin = `0 ${(scale - 1) * DOCK.PUSH}px`
    })
  }
  const resetDock = () => {
    dockRef.current?.querySelectorAll('.dock-item').forEach((el) => {
      el.style.transform = ''
      el.style.margin = ''
    })
  }

  return (
    <div className="desktop">
      {wallpaper && (
        <div className="screen">
          <div className="desktop-bg" style={{ backgroundImage: `url(${wallpaper})` }} />
        </div>
      )}

      {/* 화면 전체를 감싸는 프레임 */}
      <div className="desktop-frame" aria-hidden="true" />


      {/* Liquid Glass 굴절용 SVG 필터 (배경을 미세하게 왜곡) */}
      <svg className="svg-defs" aria-hidden="true" width="0" height="0">
        <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.004 0.005"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2.4" result="soft" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="soft"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* 상단 메뉴바 (macOS 메뉴바 느낌) */}
      <header className="menubar">
        <span className="menubar-logo">{SITE.logo}</span>

        {/* 중앙: 뷰 전환 스위치 (데스크톱 ↔ 프로젝트만 보기) */}
        <button
          className="view-switch"
          role="switch"
          aria-checked={projectsView}
          aria-label="프로젝트만 보기"
          title="프로젝트만 보기"
          onClick={() => setView((v) => (v === 'projects' ? 'desktop' : 'projects'))}
        >
          <span className={`switch ${projectsView ? 'is-on' : ''}`}>
            <span className="knob" />
          </span>
          <span className="view-switch-label">
            <span className="vs-long">프로젝트만 보기</span>
            <span className="vs-short">프로젝트</span>
          </span>
        </button>

        <Clock />
      </header>

      {/* 데스크톱 뷰: 폴더 아이콘 / 프로젝트 뷰: 카드 스택 */}
      {projectsView ? (
        <ProjectsView />
      ) : (
        <div className="icon-grid">
          {APPS.map((app) => (
            <DesktopIcon key={app.id} app={app} />
          ))}
        </div>
      )}

      {/* 열린 창들 — 프로젝트 보기에서는 숨김 */}
      {!projectsView &&
        windows
        .filter((w) => !w.minimized)
        .map((w) => (
          <Window
            key={w.id}
            win={w}
            app={APPS.find((a) => a.id === w.appId)}
            isActive={w.id === activeId}
          />
        ))}

      {/* 하단 독 (전체모드 스위처) — 프로젝트 보기에서는 숨김
          - {a} 클릭: 창 → 전체모드 (없으면 열면서 전체)
          - 다른 앱이 전체모드면: 그 앱은 즉시 닫고 이 앱을 전체모드로
          - 이미 전체모드인 앱을 다시 클릭: 지니 효과로 닫힘 */}
      {!projectsView && (
      <footer
        className="dock"
        ref={dockRef}
        onMouseEnter={onDockEnter}
        onMouseMove={(e) => applyDockMagnify(e.clientX)}
        onMouseLeave={resetDock}
      >
        {APPS.map((app) => {
          const win = windows.find((w) => w.appId === app.id && !w.closing)
          const full = win && win.maximized
          return (
            <button
              key={app.id}
              data-dock-app={app.id}
              data-label={app.title}
              aria-label={full ? `${app.title} 닫기` : `${app.title} 열기`}
              className={`dock-item ${win ? 'running' : ''} ${full ? 'active' : ''}`}
              onClick={() => {
                if (full) {
                  genieClose(win.id) // 전체모드에서 재클릭 → 지니 닫힘
                } else {
                  // 다른 전체모드 앱이 있으면 즉시 닫고
                  const otherFull = windows.find(
                    (w) => w.maximized && !w.closing && w.appId !== app.id,
                  )
                  if (otherFull) closeWindow(otherFull.id)
                  openApp(app, { maximized: true }) // 창 → 전체모드 (없으면 열면서 전체)
                }
              }}
            >
              {app.icon}
            </button>
          )
        })}
      </footer>
      )}

      <div className="watermark">{SITE.footer}</div>

      {/* 전역 프로젝트 상세 (상태바 유지, 어느 뷰에서든 열림) */}
      <ProjectDetail />
    </div>
  )
}
