import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

type Section = 'home' | 'design' | 'entertainment' | 'cultural' | 'about' | 'contact'

const designCategories = [
  ['01', '豪宅景观', 'Residential'],
  ['02', '公园景观', 'Park'],
  ['03', '商业景观', 'Commercial'],
  ['04', '酒店景观', 'Hotel'],
  ['05', '庭院景观', 'Garden'],
  ['06', '改造项目', 'Renovation'],
]

const projects = [
  { n: '01', title: 'Project / 01', category: '豪宅景观', meta: 'Residential Landscape', cls: 'p1' },
  { n: '02', title: 'Project / 02', category: '公园景观', meta: 'Park Landscape', cls: 'p2' },
  { n: '03', title: 'Project / 03', category: '商业景观', meta: 'Commercial Landscape', cls: 'p3' },
  { n: '04', title: 'Project / 04', category: '酒店景观', meta: 'Hospitality Landscape', cls: 'p4' },
  { n: '05', title: 'Project / 05', category: '庭院景观', meta: 'Garden Landscape', cls: 'p5' },
  { n: '06', title: 'Project / 06', category: '改造项目', meta: 'Renovation', cls: 'p6' },
]

function Placeholder({ className = '' }: { className?: string }) {
  return <div className={`placeholder ${className}`}><span>IMAGE<br/>PLACEHOLDER</span></div>
}

function App() {
  const [section, setSection] = useState<Section>('home')
  const [menu, setMenu] = useState(false)

  const go = (s: Section) => { setSection(s); setMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return <div className="site">
    <header className="header">
      <button className="logo" onClick={() => go('home')}>OneStage<span>Studio</span></button>
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
        <Placeholder className="hero-image" />
        <div className="hero-index">01 / 01</div>
      </section>
      <section className="intro grid-12">
        <div className="label">01 — INTRO</div>
        <div className="intro-text">OneStage Studio is an independent creative practice exploring the relationship between <strong>space, media and culture.</strong></div>
      </section>
      <section className="home-sections">
        <div className="home-card" onClick={() => go('design')}><span>01</span><h2>OneStage<br/>Design</h2><p>壹阶设计 / Landscape Architecture</p><Placeholder /></div>
        <div className="home-card offset" onClick={() => go('entertainment')}><span>02</span><h2>OneStage<br/>Entertainment</h2><p>壹阶娱乐 / Podcast & Video</p><Placeholder /></div>
        <div className="home-card" onClick={() => go('cultural')}><span>03</span><h2>OneStage<br/>Cultural</h2><p>壹阶文化 / Writing & Publishing</p><Placeholder /></div>
      </section>
    </main>}

    {section === 'design' && <main className="page">
      <PageTitle no="01" en="OneStage Design" cn="壹阶设计" desc="Landscape architecture / Spatial experience / Place making" />
      <div className="category-list">{designCategories.map(([n, cn, en]) => <div className="category" key={n}><span>{n}</span><div><h3>{cn}</h3><p>{en}</p></div><span>↗</span></div>)}</div>
      <div className="project-grid">{projects.map(p => <article className="project" key={p.n}><Placeholder className={p.cls}/><div className="project-info"><span>{p.n}</span><div><h3>{p.title}</h3><p>{p.category} · {p.meta}</p></div><span>↗</span></div></article>)}</div>
    </main>}

    {section === 'entertainment' && <main className="page">
      <PageTitle no="02" en="OneStage Entertainment" cn="壹阶娱乐" desc="Podcast / Video / Audio storytelling" />
      <section className="feature"><Placeholder className="feature-image"/><div className="feature-copy"><p className="eyebrow">FEATURED PROJECT</p><h2>牛马假日</h2><p>一档关于工作、生活与城市生存方式的播客。以一个普通人的视角，记录我们如何在“牛马”与“假日”之间寻找自己的节奏。</p><button className="text-link">EXPLORE ↗</button></div></section>
      <section className="episode-list">{['01 / 试播集', '02 / 职场与牛马文化', '03 / Coming Soon'].map((x, i) => <div className="episode" key={x}><span>{x}</span><span>{i === 2 ? '2026' : 'PODCAST'}</span><span>↗</span></div>)}</section>
    </main>}

    {section === 'cultural' && <main className="page">
      <PageTitle no="03" en="OneStage Cultural" cn="壹阶文化" desc="Writing / Publishing / Independent cultural projects" />
      <section className="writing-feature"><Placeholder className="writing-image"/><div><p className="eyebrow">WRITING & IDEAS</p><h2>文字，是另一种空间。</h2><p>收录个人文章、出版作品与持续进行中的文化项目。</p></div></section>
      <section className="article-list">{['Selected Writing / 01', 'Selected Writing / 02', 'Selected Writing / 03', '人间有灵 — 长篇写作计划'].map((x, i) => <div className="article" key={x}><span>0{i+1}</span><h3>{x}</h3><span>↗</span></div>)}</section>
    </main>}

    {section === 'about' && <main className="page about"><PageTitle no="04" en="About" cn="关于 OneStage" desc="A personal creative practice by Kim King."/><div className="about-grid"><Placeholder/><div><p className="large">OneStage Studio is a personal platform for landscape design, media and cultural practice.</p><p>这里不是一份传统意义上的简历，而是一处用来呈现作品、记录思考，并连接不同创作方向的个人空间。</p><p>Landscape Architect · Project Manager · Podcaster · Writer</p></div></div></main>}

    {section === 'contact' && <main className="page contact"><PageTitle no="05" en="Contact" cn="联系" desc="For projects, collaborations and conversations."/><div className="contact-block"><p className="eyebrow">GET IN TOUCH</p><a href="mailto:hello@onestage.studio">hello@onestage.studio</a><p>Shanghai / China</p></div></main>}

    <footer><div>ONESTAGE STUDIO</div><div>DESIGN · ENTERTAINMENT · CULTURAL</div><div>© 2026</div></footer>
  </div>
}

function PageTitle({ no, en, cn, desc }: { no:string; en:string; cn:string; desc:string }) { return <section className="page-title"><span className="page-no">{no}</span><div><p className="eyebrow">{en.toUpperCase()}</p><h1>{cn}</h1><p>{desc}</p></div></section> }

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
