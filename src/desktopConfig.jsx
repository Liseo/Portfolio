/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  여기만 고치면 사이트 콘텐츠가 바뀝니다.                      │
 * │  - SITE: 로고/프로필/툴바 등 전역 정보                        │
 * │  - APPS: 바탕화면 카드 + 각 창 안에 뜰 내용                   │
 * │  카드 필드: title/subtitle/icon/accent/people/badge          │
 * └─────────────────────────────────────────────────────────────┘
 */
import { useWindows } from './windowStore'

// "프로젝트만 보기" 뷰의 프로젝트들. date 기준 오래된→최신 정렬.
// (썸네일 이미지가 있으면 각 항목에 image: '/경로.jpg' 를 추가하세요)
export const PROJECTS = [
  { id: 'p1', title: 'Comsic', date: '2020-05', accent: '#7c5cff', desc: '브랜드 아이덴티티와 웹 경험을 설계한 스타트업 프로젝트.', tags: ['BRANDING', 'WEB'] },
  { id: 'p2', title: 'Precision CNC', date: '2021-01', accent: '#c0705f', desc: '제조 스타트업의 랜딩페이지·디자인 시스템 구축.', tags: ['WEB', 'DESIGN SYSTEM'] },
  { id: 'p3', title: 'Ember', date: '2021-08', accent: '#b03a2e', desc: '모듈러 오디오 제품의 대담한 웹 아트디렉션.', tags: ['ART DIRECTION', 'WEB'] },
  { id: 'p4', title: '490 Chips', date: '2022-03', accent: '#5b6cf0', desc: '반도체 기술을 설명하는 인터랙티브 사이트.', tags: ['INTERACTIVE', 'WEB'] },
  { id: 'p5', title: 'Vyve Systems', date: '2022-11', accent: '#1f6f5c', desc: 'AI로 상호운용 시스템을 만드는 브랜드 리뉴얼.', tags: ['BRANDING', 'STRATEGY'] },
  { id: 'p6', title: 'K-Clinic', date: '2023-04', accent: '#4a90d9', desc: '헬스케어 클리닉의 예약·브랜딩 경험.', tags: ['PRODUCT', 'BRANDING'] },
  { id: 'p7', title: 'GovSell', date: '2023-10', accent: '#ff7a2f', desc: '공공조달 SaaS의 세일즈 랜딩 설계.', tags: ['SAAS', 'LANDING'] },
  { id: 'p8', title: 'Robotic Hand', date: '2024-05', accent: '#7fb8e6', desc: 'AI 로보틱스 스타트업의 제품 소개 페이지.', tags: ['PRODUCT', 'WEB'] },
  { id: 'p9', title: 'Red Barn', date: '2024-12', accent: '#8a5a3c', desc: '로보틱스 농업 브랜드의 캠페인 사이트.', tags: ['CAMPAIGN', 'BRANDING'] },
  { id: 'p10', title: 'Plan Review', date: '2025-09', accent: '#e03535', desc: 'AI 기반 플랜 리뷰 도구의 브랜드·UI.', tags: ['BRANDING', 'UI'] },
]

// 프로젝트 뷰 좌측 상단에 표시되는 컬렉션(카테고리) 라벨
export const COLLECTION = 'Startups'

// 우측 "Gallery" 메이슨리에 나열할 이미지들.
// (지금은 placeholder — image 를 본인 이미지 경로/URL 로 바꾸면 됩니다)
export const GALLERY = [
  { id: 's1', image: 'https://picsum.photos/seed/pf-a/600/800' },
  { id: 's2', image: 'https://picsum.photos/seed/pf-b/600/460' },
  { id: 's3', image: 'https://picsum.photos/seed/pf-c/600/700' },
  { id: 's4', image: 'https://picsum.photos/seed/pf-d/600/600' },
  { id: 's5', image: 'https://picsum.photos/seed/pf-e/600/820' },
  { id: 's6', image: 'https://picsum.photos/seed/pf-f/600/500' },
  { id: 's7', image: 'https://picsum.photos/seed/pf-g/600/720' },
  { id: 's8', image: 'https://picsum.photos/seed/pf-h/600/560' },
]

export const SITE = {
  logo: 'my portfolio',
  profile: '🧑‍💻', // 좌상단 프로필 아바타 (이모지 또는 이미지 URL로 교체)
  footer: '© 2026 YOUR NAME',
  // 상단 우측 세그먼트 컨트롤 (레퍼런스의 Dashboard / Rooms)
  segments: ['Dashboard', 'Rooms'],
}

// 바탕화면 카드(앱). accent = 카드 하단 그라데이션 틴트/뱃지 색.
export const APPS = [
  {
    id: 'about',
    title: 'About',
    subtitle: '소개 · me.txt',
    icon: '📁',
    accent: '#7cc4ff',
    people: ['🧑‍💻'],
    badge: 1,
    window: { title: 'about — me.txt', w: 460, h: 360 },
    Content: () => (
      <div className="doc">
        <h2>안녕하세요 👋</h2>
        <p>
          여기에 자기소개를 적으세요. 이 사이트는 rksband.com의 "데스크톱 OS"
          컨셉 + 글래스모피즘 UI를 참고해 만든 React(Vite) 스타터입니다.
        </p>
        <p>
          카드를 클릭하면 창이 열리고, 제목 표시줄을 드래그해 옮길 수 있으며,
          하단 독을 누르면 전체화면 페이지로 열립니다. 모바일에서는 전체화면
          시트로 전환됩니다.
        </p>
        <ul>
          <li>이름 / 직함</li>
          <li>한 줄 소개</li>
          <li>관심사 · 기술 스택</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'projects',
    title: 'Projects',
    subtitle: `작업 모음 · ${PROJECTS.length}개`,
    icon: '🗂️',
    accent: '#8bd07a',
    people: ['👩‍🎨', '🧑‍🔬', '👨‍💻'],
    badge: PROJECTS.length,
    window: { title: 'projects', w: 760, h: 580 },
    // '프로젝트만 보기' 뷰와 동일한 PROJECTS 데이터를 공유. 항목 클릭 → 상세로 이동.
    Content: () => {
      const { openDetail } = useWindows()
      return (
        <div className="doc">
          <h2>Projects</h2>
          <p className="hint">‘프로젝트만 보기’ 뷰와 동일한 목록입니다. 클릭하면 상세로 이동합니다.</p>
          <div className="cards">
            {[...PROJECTS]
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((p) => (
                <button
                  key={p.id}
                  className="card card-btn"
                  onClick={() => openDetail(p.id)}
                >
                  <div
                    className="card-thumb"
                    style={{
                      background: p.accent,
                      borderRadius: 8,
                      height: 44,
                      marginBottom: 8,
                    }}
                  />
                  <div className="card-title">{p.title}</div>
                  <div className="card-desc">{p.date}</div>
                </button>
              ))}
          </div>
        </div>
      )
    },
  },
  {
    id: 'gallery',
    title: 'Gallery',
    subtitle: `이미지 · ${GALLERY.length}컷`,
    icon: '🖼️',
    accent: '#f6b352',
    people: ['📷'],
    badge: GALLERY.length,
    window: { title: 'gallery', w: 600, h: 440 },
    // 프로젝트 뷰 우측 갤러리와 동일한 GALLERY 데이터 공유
    Content: () => (
      <div className="doc">
        <h2>Gallery</h2>
        <div className="gallery-grid">
          {GALLERY.map((g) => (
            <img key={g.id} src={g.image} alt="" loading="lazy" />
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'music',
    title: 'Music',
    subtitle: 'Now Playing',
    icon: '🎵',
    accent: '#c79bff',
    people: ['🎧'],
    badge: null,
    window: { title: 'music player', w: 420, h: 300 },
    Content: () => (
      <div className="doc">
        <h2>Now Playing</h2>
        <div className="player">
          <div className="cover">💿</div>
          <div>
            <div className="track">트랙 제목</div>
            <div className="artist">아티스트</div>
            <div className="controls">
              <button>⏮</button>
              <button>▶️</button>
              <button>⏭</button>
            </div>
          </div>
        </div>
        <p className="hint">여기에 실제 오디오/스트리밍 링크를 연결하세요.</p>
      </div>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    subtitle: '연락 · 3채널',
    icon: '✉️',
    accent: '#ff8a7a',
    people: ['✉️', '🐙', '📸'],
    badge: 3,
    window: { title: 'contact', w: 440, h: 340 },
    Content: () => (
      <div className="doc">
        <h2>Contact</h2>
        <p>연락처를 남겨두세요.</p>
        <ul className="links">
          <li><a href="mailto:you@example.com">✉️ you@example.com</a></li>
          <li><a href="#" onClick={(e) => e.preventDefault()}>🐙 GitHub</a></li>
          <li><a href="#" onClick={(e) => e.preventDefault()}>📸 Instagram</a></li>
        </ul>
      </div>
    ),
  },
]
