import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

type Section = 'home' | 'design' | 'entertainment' | 'cultural' | 'about' | 'contact'

type Category = '豪宅景观' | '公园景观' | '商业景观' | '酒店景观' | '庭院景观' | '改造项目'

const designCategories: { n: string; cn: Category; en: string }[] = [
  { n: '01', cn: '豪宅景观', en: 'Residential' },
  { n: '02', cn: '公园景观', en: 'Park' },
  { n: '03', cn: '商业景观', en: 'Commercial' },
  { n: '04', cn: '酒店景观', en: 'Hotel' },
  { n: '05', cn: '庭院景观', en: 'Garden' },
  { n: '06', cn: '改造项目', en: 'Renovation' },
]

const projects: { n: string; title: string; category: Category; meta: string; image: string }[] = [
  { n: '01', title: '上海壹号院', category: '豪宅景观', meta: 'Shanghai · 2024', image: '/one-stage/assets/shanghai-one-central-park.jpg' },
  { n: '02', title: '温州华润瑞府', category: '豪宅景观', meta: 'Wenzhou · 2023', image: '/one-stage/assets/wenzhou-crest-residence.jpg' },
  { n: '03', title: '湖州绿城锦玉园', category: '豪宅景观', meta: 'Huzhou · 2020', image: '/one-stage/assets/huzhou-jade-garden.jpg' },
  { n: '04', title: '平阳郁金香公园', category: '公园景观', meta: 'Pingyang · 2018', image: '/one-stage/assets/park.jpg' },
  { n: '05', title: '启东 Delta 酒店', category: '酒店景观', meta: 'Qidong · 2020', image: '/one-stage/assets/hotel.jpg' },
  { n: '06', title: '深圳湾万象城水幕广场', category: '商业景观', meta: 'Shenzhen · 2024', image: '/one-stage/assets/wave-plaza.jpg' },
  { n: '07', title: '文成嘉南美地', category: '酒店景观', meta: 'Wencheng · 2012–2022', image: '/one-stage/assets/canaan-resort.jpg' },
]

function ProjectImage({ src, className = '' }: { src?: string; className?: string }) {
  if (!src) return <div className={`placeholder ${className}`}><span>IMAGE<br/>PLACEHOLDER</span></div>
  return <div className={`project-image ${className}`}><img src={src} alt="" loading="lazy" /></div>
}

function App() {
  const [section, setSection] = useState<Section>('home')
  const [menu, setMenu] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL')

  const go = (s: Section) => { setSection(s); setMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const showCategory = (category: Category | 'ALL') => {
    setActiveCategory(category)
    window.setTimeout(() => document.getElementById('design-projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const visibleProjects = activeCategory === 'ALL'
    ? projects
    : projects.filter(project => project.category === activeCategory)

  return <div className="site">
    <header className="header">
      <button className="brand" onClick={() => go('home')} aria-label="OneStage Studio home">
        <img src="/one-stage/assets/logo.jpg" alt="OneStage Studio" />
      </button>
      <nav className={menu ? 'nav open' : 'nav'}>
        <button className={section === 'design' ? 'active' : ''} onClick={() => go('design')}>Design</button>
        <button className={section === 'entertainment' ? 'active' : ''} onClick={() => go('entertainment')}>Entertainment</button>
        <button className={section === 'cultural' ? 'active' : ''} onClick={() => go('cultural')}>Cultural</button>
        <button onClick={() => go('about')}>About</button>
        <button onClick={() => go('contact')}>Contact</button>
      </nav>
      <button className="menu" onClick={() => setMenu(!menu)}>{menu ? 'CLOSE' : 'MENU'}</button>
    </header>

    {section === 'home' && <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">ONE STAGE / CREATIVE STUDIO</p>
          <h1>OneStage<br/><i>Studio</i></h1>
          <p className="hero-desc">Designing spaces, stories<br/>and cultural experiences.</p>
        </div>
        <ProjectImage src="/one-stage/assets/wave-plaza.jpg" className="hero-image" />
        <div className="hero-index">01 / 01</div>
      </section>
      <section className="intro grid-12">
        <div className="label">01 — INTRO</div>
        <div className="intro-text">OneStage Studio is an independent creative practice exploring the relationship between <strong>space, media and culture.</strong></div>
      </section>
      <section className="home-sections">
        <div className="home-card" onClick={() => go('design')}><span>01</span><h2>OneStage<br/>Design</h2><p>壹阶设计 / Landscape Architecture</p><ProjectImage src="/one-stage/assets/shanghai-one-central-park.jpg" /></div>
        <div className="home-card offset" onClick={() => go('entertainment')}><span>02</span><h2>OneStage<br/>Entertainment</h2><p>壹阶娱乐 / Podcast & Video</p><div className="placeholder"><span>牛马假日<br/>IMAGE PLACEHOLDER</span></div></div>
        <div className="home-card" onClick={() => go('cultural')}><span>03</span><h2>OneStage<br/>Cultural</h2><p>壹阶文化 / Writing & Publishing</p><div className="placeholder"><span>WRITING<br/>IMAGE PLACEHOLDER</span></div></div>
      </section>
    </main>}

    {section === 'design' && <main className="page">
      <PageTitle no="01" en="OneStage Design" cn="壹阶设计" desc="Landscape architecture / Spatial experience / Place making" />
      <div className="category-list">
        <button className={`category ${activeCategory === 'ALL' ? 'selected' : ''}`} onClick={() => showCategory('ALL')}>
          <span>00</span><div><h3>全部项目</h3><p>All Projects</p></div><span>↗</span>
        </button>
        {designCategories.map(({ n, cn, en }) => <button className={`category ${activeCategory === cn ? 'selected' : ''}`} key={n} onClick={() => showCategory(cn)}>
          <span>{n}</span><div><h3>{cn}</h3><p>{en}</p></div><span>↗</span>
        </button>)}
      </div>
      <div id="design-projects" className="project-section-heading"><span>SELECTED PROJECTS</span><span>{activeCategory === 'ALL' ? 'ALL' : activeCategory}</span></div>
      {visibleProjects.length > 0 ? <div className="project-grid">
        {visibleProjects.map(p => <article className="project" key={p.n}>
          <ProjectImage src={p.image} className={`p${p.n}`}/>
          <div className="project-info"><span>{p.n}</span><div><h3>{p.title}</h3><p>{p.category} · {p.meta}</p></div><span>↗</span></div>
        </article>)}
      </div> : <div className="empty-category"><span>COMING SOON</span><p>该门类的项目资料正在整理中。</p></div>}
    </main>}

    {section === 'entertainment' && <main className="page">
      <PageTitle no="02" en="OneStage Entertainment" cn="壹阶娱乐" desc="Podcast / Video / Audio storytelling" />
      <section className="feature"><div className="placeholder feature-image"><span>牛马假日<br/>IMAGE PLACEHOLDER</span></div><div className="feature-copy"><p className="eyebrow">FEATURED PROJECT</p><h2>牛马假日</h2><p>一档关于工作、生活与城市生存方式的播客。以一个普通人的视角，记录我们如何在“牛马”与“假日”之间寻找自己的节奏。</p><button className="text-link">EXPLORE ↗</button></div></section>
      <section className="episode-list">{['01 / 试播集', '02 / 职场与牛马文化', '03 / Coming Soon'].map((x, i) => <div className="episode" key={x}><span>{x}</span><span>{i === 2 ? '2026' : 'PODCAST'}</span><span>↗</span></div>)}</section>
    </main>}

    {section === 'cultural' && <main className="page">
      <PageTitle no="03" en="OneStage Cultural" cn="壹阶文化" desc="Writing / Publishing / Independent cultural projects" />
      <section className="writing-feature"><div className="placeholder writing-image"><span>WRITING<br/>IMAGE PLACEHOLDER</span></div><div><p className="eyebrow">WRITING & IDEAS</p><h2>文字，是另一种空间。</h2><p>收录个人文章、出版作品与持续进行中的文化项目。</p></div></section>
      <section className="article-list">{['Selected Writing / 01', 'Selected Writing / 02', 'Selected Writing / 03', '人间有灵 — 长篇写作计划'].map((x, i) => <div className="article" key={x}><span>0{i+1}</span><h3>{x}</h3><span>↗</span></div>)}</section>
    </main>}

    {section === 'about' && <main className="page about"><PageTitle no="04" en="About" cn="关于 OneStage" desc="A personal creative practice by Kim King."/><div className="about-grid"><ProjectImage src="/one-stage/assets/shanghai-one-central-park.jpg"/><div><p className="large">OneStage Studio is a personal platform for landscape design, media and cultural practice.</p><p>这里不是一份传统意义上的简历，而是一处用来呈现作品、记录思考，并连接不同创作方向的个人空间。</p><p>Landscape Architect · Project Manager · Podcaster · Writer</p></div></div></main>}

    {section === 'contact' && <main className="page contact"><PageTitle no="05" en="Contact" cn="联系" desc="For projects, collaborations and conversations."/><div className="contact-block"><p className="eyebrow">GET IN TOUCH</p><a className="contact-note" href="mailto:bestyuchenking@aliyun.com">bestyuchenking@aliyun.com</a><p>Shanghai / China</p></div></main>}

    <footer><div className="footer-brand"><img src="/one-stage/assets/logo.jpg" alt="OneStage Studio" /></div><div>DESIGN · ENTERTAINMENT · CULTURAL</div><div>© 2026</div></footer>
  </div>
}

function PageTitle({ no, en, cn, desc }: { no:string; en:string; cn:string; desc:string }) { return <section className="page-title"><span className="page-no">{no}</span><div><p className="eyebrow">{en.toUpperCase()}</p><h1>{cn}</h1><p>{desc}</p></div></section> }

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
