import { COLLECTION, GALLERY, PROJECTS, SITE } from '../desktopConfig'
import { useWindows } from '../windowStore'

// jkane.co 스타일 2단 레이아웃:
//  좌 = 프로필 + 소개 + 프로젝트 리스트 / 우 = Playground 이미지 메이슨리
//  좌측 프로젝트를 누르면 전역 상세(ProjectDetail)로 이동한다.

export default function ProjectsView() {
  const { openDetail } = useWindows()
  const list = [...PROJECTS].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="projects-view">
      <div className="jk">
      {/* ── 좌측 ── */}
      <section className="jk-left">
        <div className="jk-card jk-profile">
          <div className="jk-avatar" aria-hidden>{SITE.profile}</div>
          <div className="jk-id">
            <div className="jk-name">{SITE.logo}</div>
            <div className="jk-sub">{COLLECTION} · Creative Portfolio</div>
          </div>
          <span className="jk-lang">EN</span>
        </div>

        <div className="jk-card jk-bio">
          <p>
            여기에 소개를 적으세요. 브랜드·프로덕트·아트디렉션을 넘나들며 새로운 기술로
            창의적 경계를 넓히는 작업을 합니다. 아래는 대표 프로젝트입니다.
          </p>
        </div>

        <div className="jk-card jk-list">
          {list.map((p) => (
            <button key={p.id} className="jk-proj" onClick={() => openDetail(p.id)}>
              <span className="jk-proj-thumb" style={{ '--accent': p.accent }} />
              <span className="jk-proj-text">
                <span className="jk-proj-title">{p.title}</span>
                <span className="jk-proj-desc">{p.desc}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="jk-card jk-contact">
          <a href="mailto:you@example.com">contact@example.com</a>
          <span className="jk-socials" aria-hidden>🐦 📸 ↻</span>
        </div>
      </section>

      {/* ── 우측: Gallery (이미지 나열) ── */}
      <section className="jk-right">
        <div className="jk-play-head">✦ Gallery</div>
        <div className="jk-masonry">
          {GALLERY.map((g) => (
            <figure className="jk-shot" key={g.id}>
              <img src={g.image} alt="" loading="lazy" />
            </figure>
          ))}
        </div>
      </section>
      </div>
    </div>
  )
}
