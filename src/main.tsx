import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

type Section = 'home' | 'design' | 'entertainment' | 'cultural' | 'about' | 'contact'
type Category = 'residential' | 'park' | 'commercial' | 'hotel' | 'garden' | 'renovation'
type Lang = 'en' | 'zh'

const designCategories: { n: string; key: Category; en: string; zh: string }[] = [
  { n: '01', key: 'residential', en: 'Residential', zh: '豪宅景观' },
  { n: '02', key: 'park', en: 'Park', zh: '公园景观' },
  { n: '03', key: 'commercial', en: 'Commercial', zh: '商业景观' },
  { n: '04', key: 'hotel', en: 'Hotel', zh: '酒店景观' },
  { n: '05', key: 'garden', en: 'Garden', zh: '庭院景观' },
  { n: '06', key: 'renovation', en: 'Renovation', zh: '改造项目' },
]

const projects = [
  { n: '01', enTitle: 'One Central Park', zhTitle: '上海壹号院', category: 'residential' as Category, meta: 'Shanghai · 2024', image: '/one-stage/assets/shanghai-one-central-park.jpg' },
  { n: '02', enTitle: 'CR Land Crest Residence', zhTitle: '温州华润瑞府', category: 'residential' as Category, meta: 'Wenzhou · 2023', image: '/one-stage/assets/wenzhou-crest-residence.jpg' },
  { n: '03', enTitle: 'Greentown Majestic Mansion', zhTitle: '湖州绿城锦玉园', category: 'residential' as Category, meta: 'Huzhou · 2020', image: '/one-stage/assets/huzhou-jade-garden.jpg' },
  { n: '04', enTitle: 'Coast Spring', zhTitle: '平阳郁金香公园', category: 'park' as Category, meta: 'Pingyang · 2018', image: '/one-stage/assets/park.jpg' },
  { n: '05', enTitle: 'Qidong Delta Hotel', zhTitle: '启东Delta酒店', category: 'hotel' as Category, meta: 'Qidong · 2020', image: '/one-stage/assets/hotel.jpg' },
  { n: '06', enTitle: 'Shenzhen Bay The Mix City Stage 2 Wave Plaza', zhTitle: '深圳湾万象城二期水幕广场', category: 'commercial' as Category, meta: 'Shenzhen · 2024', image: '/one-stage/assets/wave-plaza.jpg' },
  { n: '07', enTitle: 'Canaan Villa', zhTitle: '文成嘉南美地', category: 'hotel' as Category, meta: 'Wencheng · 2012–2022', image: '/one-stage/assets/canaan-resort.jpg' },
]

const categoryLabel = (key: Category, lang: Lang) => designCategories.find(c => c.key === key)?.[lang === 'en' ? 'en' : 'zh'] ?? key

function ProjectImage({ src, className = '' }: { src?: string; className?: string }) {
  if (!src) return <div className={`placeholder ${className}`}><span>IMAGE<br/>PLACEHOLDER</span></div>
  return <div className={`project-image ${className}`}><img src={src} alt="" loading="lazy" /></div>
}

function App() {
  const [section, setSection] = useState<Section>('home')
  const [menu, setMenu] = useState(false)
  const [lang, setLang] = useState<Lang>('en')
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL')

  const go = (s: Section) => { setSection(s); setMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const toggleLang = () => setLang(lang === 'en' ? 'zh' : 'en')
  const visibleProjects = activeCategory === 'ALL' ? projects : projects.filter(p => p.category === activeCategory)

  return <div className="site">
    <header className="header">
      <button className="brand" onClick={() => go('home')} aria-label="OneStage Studio home">
        <img src="/one-stage/assets/logo.jpg" alt="OneStage Studio" />
      </button>
      <nav className={menu ? 'nav open' : 'nav'}>
        <button className={section === 'design' ? 'active' : ''} onClick={() => go('design')}>{lang === 'en' ? 'Design' : '设计'}</button>
        <button className={section === 'entertainment' ? 'active' : ''} onClick={() => go('entertainment')}>{lang === 'en' ? 'Entertainment' : '娱乐'}</button>
        <button className={section === 'cultural' ? 'active' : ''} onClick={() => go('cultural')}>{lang === 'en' ? 'Cultural' : '文化'}</button>
        <button onClick={() => go('about')}>{lang === 'en' ? 'About' : '关于'}</button>
        <button onClick={() => go('contact')}>{lang === 'en' ? 'Contact' : '联系'}</button>
      </nav>
      <div className="header-actions">
        <button className="lang-toggle" onClick={toggleLang} aria-label="Switch language">{lang === 'en' ? '中' : 'EN'}</button>
        <button className="menu" onClick={() => setMenu(!menu)}>{menu ? 'CLOSE' : 'MENU'}</button>
      </div>
    </header>

    {section === 'home' && <main className="home-minimal">
      <section className="home-panels">
        <button className="home-panel" onClick={() => go('design')}>
          <ProjectImage src="/one-stage/assets/shanghai-one-central-park.jpg" />
          <div className="panel-overlay"><span>01</span><strong>OneStage {lang === 'en' ? 'Design' : '设计'}</strong><em>{lang === 'en' ? 'Landscape Architecture' : '景观设计'}</em></div>
        </button>
        <button className="home-panel" onClick={() => go('entertainment')}>
          <div className="placeholder home-placeholder"><span>{lang === 'en' ? 'ENTERTAINMENT' : '娱乐'}<br/>IMAGE PLACEHOLDER</span></div>
          <div className="panel-overlay"><span>02</span><strong>OneStage {lang === 'en' ? 'Entertainment' : '娱乐'}</strong><em>{lang === 'en' ? 'Podcast & Video' : '播客与影像'}</em></div>
        </button>
        <button className="home-panel" onClick={() => go('cultural')}>
          <div className="placeholder home-placeholder"><span>{lang === 'en' ? 'CULTURAL' : '文化'}<br/>IMAGE PLACEHOLDER</span></div>
          <div className="panel-overlay"><span>03</span><strong>OneStage {lang === 'en' ? 'Cultural' : '文化'}</strong><em>{lang === 'en' ? 'Writing & Publishing' : '写作与出版'}</em></div>
        </button>
      </section>
    </main>}

    {section === 'design' && <main className="page">
      <PageTitle no="01" lang={lang} en="OneStage Design" zh="壹阶设计" descEn="Landscape architecture / Spatial experience / Place making" descZh="景观设计 / 空间体验 / 场所营造" />
      <div className="category-nav" aria-label="Design categories">
        <button className={activeCategory === 'ALL' ? 'selected' : ''} onClick={() => setActiveCategory('ALL')}><span>00</span>{lang === 'en' ? 'All' : '全部'}</button>
        {designCategories.map(c => <button className={activeCategory === c.key ? 'selected' : ''} key={c.key} onClick={() => setActiveCategory(c.key)}><span>{c.n}</span>{lang === 'en' ? c.en : c.zh}</button>)}
      </div>
      <div id="design-projects" className="project-section-heading"><span>{lang === 'en' ? 'SELECTED PROJECTS' : '精选项目'}</span><span>{activeCategory === 'ALL' ? (lang === 'en' ? 'ALL' : '全部') : categoryLabel(activeCategory, lang)}</span></div>
      <div className="project-grid">
        {visibleProjects.map(p => <article className="project" key={p.n}>
          <ProjectImage src={p.image} className={`p${p.n}`}/>
          <div className="project-info"><span>{p.n}</span><div><h3>{lang === 'en' ? p.enTitle : p.zhTitle}</h3><p>{categoryLabel(p.category, lang)} · {p.meta}</p></div><span>↗</span></div>
        </article>)}
      </div>
      {visibleProjects.length === 0 && <div className="empty-category"><span>COMING SOON</span><p>{lang === 'en' ? 'Projects in this category are being prepared.' : '该门类的项目资料正在整理中。'}</p></div>}
    </main>}

    {section === 'entertainment' && <main className="page">
      <PageTitle no="02" lang={lang} en="OneStage Entertainment" zh="壹阶娱乐" descEn="Podcast / Video / Audio storytelling" descZh="播客 / 影像 / 声音叙事" />
      <section className="feature"><div className="placeholder feature-image"><span>牛马假日<br/>IMAGE PLACEHOLDER</span></div><div className="feature-copy"><p className="eyebrow">FEATURED PROJECT</p><h2>牛马假日</h2><p>{lang === 'en' ? 'A podcast about work, life and the ways ordinary people navigate the city.' : '一档关于工作、生活与城市生存方式的播客。以一个普通人的视角，记录我们如何在“牛马”与“假日”之间寻找自己的节奏。'}</p><button className="text-link">EXPLORE ↗</button></div></section>
      <section className="episode-list">{(lang === 'en' ? ['01 / Pilot', '02 / Work & Cow-Horse Culture', '03 / Coming Soon'] : ['01 / 试播集', '02 / 职场与牛马文化', '03 / Coming Soon']).map((x, i) => <div className="episode" key={x}><span>{x}</span><span>{i === 2 ? '2026' : 'PODCAST'}</span><span>↗</span></div>)}</section>
    </main>}

    {section === 'cultural' && <main className="page">
      <PageTitle no="03" lang={lang} en="OneStage Cultural" zh="壹阶文化" descEn="Writing / Publishing / Independent cultural projects" descZh="写作 / 出版 / 独立文化项目" />
      <section className="writing-feature"><div className="placeholder writing-image"><span>WRITING<br/>IMAGE PLACEHOLDER</span></div><div><p className="eyebrow">WRITING & IDEAS</p><h2>{lang === 'en' ? 'Words are another kind of space.' : '文字，是另一种空间。'}</h2><p>{lang === 'en' ? 'Selected writing, published work and ongoing cultural projects.' : '收录个人文章、出版作品与持续进行中的文化项目。'}</p></div></section>
      <section className="article-list">{(lang === 'en' ? ['Selected Writing / 01', 'Selected Writing / 02', 'Selected Writing / 03', '人间有灵 — Long-form Writing Project'] : ['精选文章 / 01', '精选文章 / 02', '精选文章 / 03', '人间有灵 — 长篇写作计划']).map((x, i) => <div className="article" key={x}><span>0{i+1}</span><h3>{x}</h3><span>↗</span></div>)}</section>
    </main>}

    {section === 'about' && <main className="page about"><PageTitle no="04" lang={lang} en="About" zh="关于壹阶" descEn="A personal creative practice by Kim King." descZh="金宇辰的个人创作实践。"/><div className="about-grid"><ProjectImage src="/one-stage/assets/shanghai-one-central-park.jpg"/><div><p className="large">{lang === 'en' ? 'OneStage Studio is a personal platform for landscape design, media and cultural practice.' : '壹阶是一个围绕景观设计、媒体与文化创作展开的个人平台。'}</p><p>{lang === 'en' ? 'A space to present work, record ideas and connect different creative practices.' : '这里不是一份传统意义上的简历，而是一处用来呈现作品、记录思考，并连接不同创作方向的个人空间。'}</p><p>Landscape Architect · Project Manager · Podcaster · Writer</p></div></div></main>}

    {section === 'contact' && <main className="page contact"><PageTitle no="05" lang={lang} en="Contact" zh="联系" descEn="For projects, collaborations and conversations." descZh="项目合作、创意协作与交流。"/><div className="contact-block"><p className="eyebrow">GET IN TOUCH</p><a className="contact-note" href="mailto:bestyuchenking@aliyun.com">bestyuchenking@aliyun.com</a><p>Shanghai / China</p></div></main>}

    <footer><div className="footer-brand"><img src="/one-stage/assets/logo.jpg" alt="OneStage Studio" /></div><div>{lang === 'en' ? 'DESIGN · ENTERTAINMENT · CULTURAL' : '设计 · 娱乐 · 文化'}</div><div>© 2026</div></footer>
  </div>
}

function PageTitle({ no, lang, en, zh, descEn, descZh }: { no:string; lang:Lang; en:string; zh:string; descEn:string; descZh:string }) {
  return <section className="page-title"><span className="page-no">{no}</span><div><p className="eyebrow">{en.toUpperCase()}</p><h1>{lang === 'en' ? en : zh}</h1><p>{lang === 'en' ? descEn : descZh}</p></div></section>
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
