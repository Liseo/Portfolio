import { useEffect, useState } from 'react'

// macOS 메뉴바 우측 시계: "8월 20일 (수) 오후 3:45"
function format(now) {
  const date = now.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
  const time = now.toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
  })
  return { date, time }
}

export default function Clock() {
  const [label, setLabel] = useState(() => format(new Date()))

  useEffect(() => {
    const tick = () => setLabel(format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="menubar-clock">
      <span className="clock-date">{label.date} </span>
      {label.time}
    </span>
  )
}
