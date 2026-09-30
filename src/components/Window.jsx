import { useEffect, useRef } from 'react'
import { useWindows } from '../windowStore'
import { useIsMobile } from '../useIsMobile'

export default function Window({ win, app, isActive }) {
  const { closeWindow, focusWindow, minimizeWindow, toggleMaximize, moveWindow } = useWindows()
  const isMobile = useIsMobile()
  const dragRef = useRef(null)
  const elRef = useRef(null)
  const isMax = win.maximized

  // 지니(요술램프) 닫힘: 해당 독 아이콘 위치로 빨려들어가듯 축소+페이드 후 제거
  useEffect(() => {
    if (!win.closing) return
    const el = elRef.current
    if (!el) { closeWindow(win.id); return }
    const dockIcon = document.querySelector(`[data-dock-app="${win.appId}"]`)
    let dx = 0
    let dy = window.innerHeight // 기본값: 화면 하단(독 방향)
    if (dockIcon) {
      const wr = el.getBoundingClientRect()
      const dr = dockIcon.getBoundingClientRect()
      dx = dr.left + dr.width / 2 - (wr.left + wr.width / 2)
      dy = dr.top + dr.height / 2 - (wr.top + wr.height / 2)
    }
    el.style.transformOrigin = 'center center'
    el.style.pointerEvents = 'none'
    el.style.transition =
      'transform 0.45s cubic-bezier(0.55, 0, 0.85, 0.25), opacity 0.45s ease-in'
    requestAnimationFrame(() => {
      // 세로로 먼저 좁아지며 아이콘 쪽으로 빨려드는 느낌
      el.style.transform = `translate(${dx}px, ${dy}px) scale(0.08, 0.02)`
      el.style.opacity = '0'
    })
    const done = () => closeWindow(win.id)
    el.addEventListener('transitionend', done, { once: true })
    const t = setTimeout(done, 650) // 안전장치
    return () => {
      clearTimeout(t)
      el.removeEventListener('transitionend', done)
    }
  }, [win.closing, win.id, win.appId, closeWindow])

  // 제목 표시줄 포인터 드래그 (마우스 + 터치 공용)
  function onPointerDown(e) {
    if (isMobile || isMax || win.closing) return // 모바일/전체화면/닫는 중엔 드래그 비활성화
    focusWindow(win.id)
    const startX = e.clientX
    const startY = e.clientY
    const originX = win.x
    const originY = win.y
    dragRef.current = { startX, startY, originX, originY }

    const onMove = (ev) => {
      const d = dragRef.current
      if (!d) return
      const nx = originX + (ev.clientX - d.startX)
      const ny = originY + (ev.clientY - d.startY)
      // 창 전체가 항상 화면 안에 머물도록 제한
      const M = 12
      const TOP = 60
      const clampedX = Math.min(Math.max(nx, M), Math.max(M, window.innerWidth - win.w - M))
      const clampedY = Math.min(Math.max(ny, TOP), Math.max(TOP, window.innerHeight - win.h - M))
      moveWindow(win.id, clampedX, clampedY)
    }
    const onUp = () => {
      dragRef.current = null
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const Content = app?.Content ?? (() => <div className="doc">내용 없음</div>)

  const style = isMobile
    ? undefined
    : isMax
      ? { zIndex: win.z } // 전체모드: 위치/크기는 CSS가 담당
      : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }

  return (
    <div
      ref={elRef}
      data-window
      className={`window ${isActive ? 'is-active' : ''} ${isMobile ? 'is-mobile' : ''} ${
        isMax ? 'is-max' : ''
      }`}
      style={style}
      onPointerDown={() => !isMobile && !win.closing && focusWindow(win.id)}
    >
      <div className="titlebar" onPointerDown={onPointerDown}>
        <div className="traffic">
          <button
            className="dot red"
            aria-label="닫기"
            onClick={(e) => { e.stopPropagation(); closeWindow(win.id) }}
          />
          <button
            className="dot yellow"
            aria-label="최소화"
            onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id) }}
          />
          <button
            className="dot green"
            aria-label="전체모드"
            onClick={(e) => { e.stopPropagation(); toggleMaximize(win.id) }}
          />
        </div>
        <div className="title">{win.title}</div>
        <div className="titlebar-spacer" />
      </div>
      <div className="window-body">
        <Content />
      </div>
    </div>
  )
}
