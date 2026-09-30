import { useEffect } from 'react'
import { COLLECTION, GALLERY, PROJECTS } from '../desktopConfig'
import { useWindows } from '../windowStore'

// jkane.co 케이스 스터디 스타일 2단 상세 (상단 상태바 유지)
//  좌 = 헤더 카드 + 태그 + 본문 + 연락처 / 우 = 히어로 + 케이스 이미지 세로 스택
export default function ProjectDetail() {
  const { detailId, closeDetail } = useWindows()

  useEffect(() => {
    if (!detailId) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeDetail()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [detailId, closeDetail])

  if (!detailId) return null
  const d = PROJECTS.find((p) => p.id === detailId)
  if (!d) return null

  const year = d.date.slice(0, 4)
  const tags = [...(d.tags ?? []), year]

  return (
    <div className="pv-detail cs" style={{ '--accent': d.accent }}>
      {/* ── 좌측 ── */}
      <div className="cs-left">
        <button className="cs-back" onClick={closeDetail}>
          ← 뒤로
        </button>

        <div className="jk-card cs-head">
          <span className="cs-head-thumb" style={{ '--accent': d.accent }} />
          <div>
            <div className="cs-head-title">{d.title}</div>
            <div className="cs-head-desc">{d.desc}</div>
          </div>
        </div>

        <div className="cs-tags">
          {tags.map((t) => (
            <span className="cs-tag" key={t}>{t}</span>
          ))}
        </div>

        <div className="cs-body">
          <h1>{d.title}</h1>
          <p>{d.desc}</p>
          <p>
            여기에 케이스 스터디 본문을 적으세요. 프로젝트의 목표와 문제, 접근 방식, 그리고
            결과를 문단으로 구성하면 좋습니다. 비주얼 언어·로고·타이포그래피 같은 디자인
            결정을 설명하세요.
          </p>
          <p>
            {COLLECTION} 컬렉션의 작업으로, 리서치부터 브랜드 시스템과 웹 경험까지 아우르는
            과정을 담았습니다. 텍스트·이미지는 desktopConfig 의 PROJECTS / GALLERY 에서
            연결·수정할 수 있습니다.
          </p>
        </div>

        <div className="jk-card jk-contact cs-contact">
          <a href="mailto:you@example.com">contact@example.com</a>
          <span className="jk-socials" aria-hidden>🐦 📸 ↻</span>
        </div>
      </div>

      {/* ── 우측: 케이스 이미지 스택 ── */}
      <div className="cs-right">
        <div className="cs-hero" style={{ '--accent': d.accent }}>
          <div className="cs-hero-kicker">{COLLECTION} · {year}</div>
          <div className="cs-hero-title">{d.title}</div>
        </div>
        {GALLERY.slice(0, 5).map((g) => (
          <figure className="cs-shot" key={g.id}>
            <img src={g.image} alt="" loading="lazy" />
          </figure>
        ))}
      </div>
    </div>
  )
}
