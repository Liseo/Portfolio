import { createContext, useCallback, useContext, useMemo, useReducer } from 'react'

/**
 * 창 상태 모델
 * window = { id, appId, title, x, y, w, h, z, minimized, maximized, closing }
 *  - maximized: false=창 모드, true=전체모드
 *  - closing: 지니 닫힘 애니메이션 진행 중(컴포넌트가 끝나면 CLOSE 호출)
 * 규칙: 앱당 창 1개(중복 없음). 전체모드는 한 번에 하나.
 */
const WindowContext = createContext(null)
const START_Z = 10

function reducer(state, action) {
  switch (action.type) {
    case 'OPEN': {
      // 앱당 창 1개 — 있으면 재사용, 없으면 생성. maximized 로 창/전체 모드 지정.
      const { app, spawn, maximized = false } = action
      const z = state.topZ + 1
      const existing = state.windows.find((w) => w.appId === app.id)
      if (existing) {
        return {
          ...state,
          topZ: z,
          activeId: existing.id,
          windows: state.windows.map((w) =>
            w.id === existing.id
              ? { ...w, z, minimized: false, maximized, closing: false }
              : w,
          ),
        }
      }
      const id = `${app.id}-${state.seq}`
      const win = {
        id,
        appId: app.id,
        title: app.window?.title ?? app.title,
        x: spawn.x,
        y: spawn.y,
        w: spawn.w ?? app.window?.w ?? 520,
        h: spawn.h ?? app.window?.h ?? 380,
        z,
        minimized: false,
        maximized,
        closing: false,
      }
      return {
        ...state,
        seq: state.seq + 1,
        topZ: z,
        activeId: id,
        windows: [...state.windows, win],
      }
    }
    case 'CLOSE':
      return {
        ...state,
        windows: state.windows.filter((w) => w.id !== action.id),
        activeId: state.activeId === action.id ? null : state.activeId,
      }
    case 'FOCUS': {
      const z = state.topZ + 1
      // 맨 앞으로만 (다른 창은 그대로)
      return {
        ...state,
        topZ: z,
        activeId: action.id,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, z, minimized: false } : w,
        ),
      }
    }
    case 'MINIMIZE':
      return {
        ...state,
        activeId: state.activeId === action.id ? null : state.activeId,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, minimized: true } : w,
        ),
      }
    case 'TOGGLE_MAX': {
      const z = state.topZ + 1
      return {
        ...state,
        topZ: z,
        activeId: action.id,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, z, maximized: !w.maximized } : w,
        ),
      }
    }
    case 'GENIE':
      // 지니 닫힘 시작 표시 — Window 컴포넌트가 애니메이션 후 CLOSE 를 호출
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, closing: true } : w,
        ),
      }
    case 'MOVE':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, x: action.x, y: action.y } : w,
        ),
      }
    case 'OPEN_DETAIL':
      return { ...state, detailId: action.id }
    case 'CLOSE_DETAIL':
      return { ...state, detailId: null }
    default:
      return state
  }
}

const initialState = { windows: [], topZ: START_Z, seq: 1, activeId: null, detailId: null }

export function WindowProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const openApp = useCallback((app, opts = {}) => {
    // 화면 밖으로 나가지 않도록 크기·위치를 화면 경계에 맞춰 계산
    const TOP = 64 // 상단 상태바 + 간격 아래
    const BOTTOM = 90 // 하단 독 위
    const M = 16
    const vw = window.innerWidth
    const vh = window.innerHeight
    const w = Math.min(app.window?.w ?? 520, vw - M * 2)
    const h = Math.min(app.window?.h ?? 380, vh - TOP - BOTTOM)
    // 센터가 아니라 좌상단 기본 위치에서 (여러 개면 계단식으로만 살짝 이동)
    const count = document?.querySelectorAll?.('[data-window]')?.length ?? 0
    const step = (count % 6) * 30
    const baseX = 56
    const baseY = 60
    const maxX = Math.max(M, vw - w - M)
    const maxY = Math.max(TOP, vh - h - BOTTOM)
    const x = Math.min(baseX + step, maxX)
    const y = Math.min(baseY + step, maxY)
    dispatch({ type: 'OPEN', app, spawn: { x, y, w, h }, maximized: !!opts.maximized })
  }, [])

  const closeWindow = useCallback((id) => dispatch({ type: 'CLOSE', id }), [])
  const focusWindow = useCallback((id) => dispatch({ type: 'FOCUS', id }), [])
  const minimizeWindow = useCallback((id) => dispatch({ type: 'MINIMIZE', id }), [])
  const toggleMaximize = useCallback((id) => dispatch({ type: 'TOGGLE_MAX', id }), [])
  const genieClose = useCallback((id) => dispatch({ type: 'GENIE', id }), [])
  const moveWindow = useCallback((id, x, y) => dispatch({ type: 'MOVE', id, x, y }), [])
  const openDetail = useCallback((id) => dispatch({ type: 'OPEN_DETAIL', id }), [])
  const closeDetail = useCallback(() => dispatch({ type: 'CLOSE_DETAIL' }), [])

  const value = useMemo(
    () => ({
      windows: state.windows,
      activeId: state.activeId,
      detailId: state.detailId,
      openApp,
      closeWindow,
      focusWindow,
      minimizeWindow,
      toggleMaximize,
      genieClose,
      moveWindow,
      openDetail,
      closeDetail,
    }),
    [
      state.windows,
      state.activeId,
      state.detailId,
      openApp,
      closeWindow,
      focusWindow,
      minimizeWindow,
      toggleMaximize,
      genieClose,
      moveWindow,
      openDetail,
      closeDetail,
    ],
  )

  return <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
}

export function useWindows() {
  const ctx = useContext(WindowContext)
  if (!ctx) throw new Error('useWindows must be used within WindowProvider')
  return ctx
}
