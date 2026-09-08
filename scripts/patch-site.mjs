import fs from 'node:fs'
import crypto from 'node:crypto'

const root = process.cwd()
const mainPath = `${root}/src/main.tsx`
const collectionPath = `${root}/src/Collection.tsx`
const stylesPath = `${root}/src/styles.css`
const assetsPath = `${root}/public/assets`

// Generate a cache-busting manifest from the actual JPG source files.
// Replacing a JPG in public/assets will therefore produce a new URL automatically.
const homeManifest = {}
for (const name of ['home-collection.jpg', 'home-entertainment.jpg']) {
  const file = `${assetsPath}/${name}`
  if (fs.existsSync(file)) {
    const hash = crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 12)
    const key = name.replace(/^home-/, '').replace(/\.jpg$/i, '')
    homeManifest[key] = `/one-stage/assets/${name.replace(/\.jpg$/i, '.webp')}?v=${hash}`
  }
}
fs.mkdirSync(`${root}/public`, { recursive: true })
fs.writeFileSync(`${root}/public/home-assets.json`, JSON.stringify(homeManifest, null, 2))

let main = fs.readFileSync(mainPath, 'utf8')

const appState = "const [section,setSection]=useState<Section>('home'),[menu,setMenu]=useState(false),[lang,setLang]=useState<Lang>('en'),[activeCategory,setActiveCategory]=useState<Category|'ALL'>('ALL'),[imageMap,setImageMap]=useState<Record<string,string[]>>({})"
const appStatePatched = "const [section,setSection]=useState<Section>('home'),[menu,setMenu]=useState(false),[lang,setLang]=useState<Lang>('en'),[langMenu,setLangMenu]=useState(false),[activeCategory,setActiveCategory]=useState<Category|'ALL'>('ALL'),[imageMap,setImageMap]=useState<Record<string,string[]>>({}),[homeAssets,setHomeAssets]=useState<{collection?:string;entertainment?:string}>({})"
if (main.includes(appState)) main = main.replace(appState, appStatePatched)

const imageEffect = "useEffect(()=>{fetch(`${import.meta.env.BASE_URL}project-images.json`,{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject(new Error(`HTTP ${r.status}`))).then(data=>setImageMap(data&&typeof data==='object'?data:{})).catch(()=>setImageMap({}))},[])"
const imageEffectPatched = `${imageEffect}\n  useEffect(()=>{fetch(import.meta.env.BASE_URL+'home-assets.json',{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject(new Error('HTTP '+r.status))).then(data=>setHomeAssets(data&&typeof data==='object'?data:{})).catch(()=>{})},[])\n  useEffect(()=>{\n    let cancelled=false\n    const controller=new AbortController()\n    const timer=setTimeout(()=>controller.abort(),3000)\n    fetch('https://ipapi.co/country/',{signal:controller.signal,cache:'no-store'})\n      .then(r=>r.ok?r.text():'')\n      .then(country=>{if(!cancelled)setLang(country.trim().toUpperCase()==='CN'?'zh':'en')})\n      .catch(()=>{if(!cancelled)setLang(navigator.language.toLowerCase().startsWith('zh')?'zh':'en')})\n      .finally(()=>clearTimeout(timer))\n    return()=>{cancelled=true;controller.abort();clearTimeout(timer)}\n  },[])`
if (main.includes(imageEffect)) main = main.replace(imageEffect, imageEffectPatched)

const oldToggle = "<button className=\"lang-toggle\" onClick={toggleLang}>{lang==='en'?'中':'EN'}</button>"
const newToggle = "<div className=\"language-switcher\"><button className=\"lang-toggle\" onClick={()=>setLangMenu(v=>!v)} aria-label={lang==='en'?'Language':'语言'} aria-expanded={langMenu}>🌐</button>{langMenu&&<div className=\"language-menu\"><button className={lang==='zh'?'selected':''} onClick={()=>{setLang('zh');setLangMenu(false)}}>中文</button><button className={lang==='en'?'selected':''} onClick={()=>{setLang('en');setLangMenu(false)}}>English</button></div>}</div>"
if (main.includes(oldToggle)) main = main.replace(oldToggle, newToggle)
main = main.replace(",toggleLang=()=>setLang(lang==='en'?'zh':'en'),visibleProjects", ",visibleProjects")

// Homepage images are resolved through the generated cache-busting manifest.
const oldHomeCollection = '<img src="/one-stage/assets/home-collection.webp" alt="OneStage Collection" loading="eager" decoding="async"/>'
const newHomeCollection = '<img src={homeAssets.collection||`${import.meta.env.BASE_URL}assets/home-collection.webp`} alt="OneStage Collection" loading="eager" decoding="async"/>'
if (main.includes(oldHomeCollection)) main = main.replace(oldHomeCollection, newHomeCollection)
const oldHomeEntertainment = '<img src="/one-stage/assets/home-entertainment.webp" alt="OneStage Entertainment" loading="eager" decoding="async"/>'
const newHomeEntertainment = '<img src={homeAssets.entertainment||`${import.meta.env.BASE_URL}assets/home-entertainment.webp`} alt="OneStage Entertainment" loading="eager" decoding="async"/>'
if (main.includes(oldHomeEntertainment)) main = main.replace(oldHomeEntertainment, newHomeEntertainment)

// IMDb / Douban belong to NiúMǎ Holiday, not Original Music.
main = main.replace(/<section className="ratings-row">[\s\S]*?<\/section>/, '')
const podcastRatings = `<section className="podcast-ratings"><div className="podcast-ratings-label">{lang==='en'?'PROGRAM LISTINGS':'节目词条'}</div><div className="podcast-ratings-links"><a href="https://www.imdb.com/title/tt44772588" target="_blank" rel="noreferrer"><strong>IMDb</strong><span>{lang==='en'?'View NiúMǎ Holiday':'查看牛马假日 IMDb 词条'}</span><b>↗</b></a><a href="https://www.douban.com/doubanapp/dispatch/movie/38625203" target="_blank" rel="noreferrer"><strong>豆瓣</strong><span>{lang==='en'?'View NiúMǎ Holiday':'查看牛马假日豆瓣词条'}</span><b>↗</b></a></div></section>`
if (main.includes('<EpisodeList lang={lang}/>')) main = main.replace('<EpisodeList lang={lang}/>', `<EpisodeList lang={lang}/>${podcastRatings}`)

fs.writeFileSync(mainPath, main)

let collection = fs.readFileSync(collectionPath, 'utf8')
const oldTitle = '<h2>虚拟世界侵入现实</h2>'
const newTitle = "<h2>{lang==='en'?'Reality Is Being Altered':'虚拟世界侵入现实'}</h2>"
if (collection.includes(oldTitle)) collection = collection.replace(oldTitle, newTitle)
fs.writeFileSync(collectionPath, collection)

let styles = fs.readFileSync(stylesPath, 'utf8')
styles += `\n\n/* Language selector */\n.language-switcher{position:relative;display:flex;align-items:center}.lang-toggle{width:30px;height:30px;padding:0;border:0;background:transparent;color:inherit;display:grid;place-items:center;font-size:17px;line-height:1;cursor:pointer}.language-menu{position:absolute;top:calc(100% + 10px);right:0;min-width:108px;padding:6px;background:rgba(245,245,242,.98);border:1px solid #ccc;box-shadow:0 8px 24px rgba(0,0,0,.08);z-index:1000}.language-menu button{display:block;width:100%;padding:9px 11px;border:0;background:transparent;text-align:left;font:10px 'DM Mono',monospace;letter-spacing:.04em;cursor:pointer;color:#111}.language-menu button:hover,.language-menu button.selected{background:#e7e7e3}.language-menu button.selected{font-weight:600}@media(max-width:700px){.language-menu{right:-4px;min-width:100px}}\n\n/* Remove redundant page-level 01–05 labels and let the main title use the full grid. */\n.page-title{grid-template-columns:1fr}.page-no{display:none!important}\n\n/* Entertainment: editorial two-column media layout instead of stacked card widgets. */\n.entertainment-category-nav{display:flex;gap:0;margin:42px 0 70px;border-top:1px solid #111;border-bottom:1px solid #ccc;overflow-x:auto;scrollbar-width:none}.entertainment-category-nav::-webkit-scrollbar{display:none}.entertainment-category-nav button{padding:17px 30px 17px 0;margin-right:30px;font:10px 'DM Mono',monospace;letter-spacing:.08em;color:#777;border-bottom:1px solid transparent;white-space:nowrap}.entertainment-category-nav button.selected{color:#111;border-bottom-color:#111}.entertainment-tab-content{padding-bottom:8vw}.entertainment-page .show-intro{padding:5vw 0 4vw}.entertainment-page .episode-browser{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(260px,.8fr);column-gap:5vw;align-items:start;padding:4vw 0 6vw}.entertainment-page .episode-browser>.section-label{grid-column:1/-1}.entertainment-page .episode-feature{margin:0;border:0;border-top:1px solid #111;border-bottom:1px solid #ccc;box-shadow:none;background:transparent}.entertainment-page .episode-feature-top{padding:12px 0;border-bottom:1px solid #ccc}.entertainment-page .episode-feature-main{padding:34px 0 30px;grid-template-columns:76px 1fr auto}.entertainment-page .episode-feature-play{width:58px;height:58px;border-radius:0;background:#111}.entertainment-page .episode-feature-copy strong{font-size:clamp(24px,3vw,46px);font-weight:300}.entertainment-page .episode-progress{margin:0 0 20px}.entertainment-page .episode-list{border-top:1px solid #111}.entertainment-page .episode-row{grid-template-columns:28px 1fr auto;padding:17px 0;background:transparent}.entertainment-page .episode-row:hover,.entertainment-page .episode-row.playing{background:transparent}.entertainment-page .episode-row-title{font-size:13px}.entertainment-page .episode-row-play{width:22px;height:22px;border-radius:0}.entertainment-page .episode-more{margin:20px 0 0;background:transparent;color:#111;border-bottom:1px solid #111;padding:10px 0;font:10px 'DM Mono',monospace;text-align:left;width:max-content}.entertainment-page .video-column{margin-top:0;padding-top:4vw;border-top:1px solid #111}.entertainment-page .video-embed{aspect-ratio:16/9}.entertainment-page .ratings-row{display:none!important}.podcast-ratings{border-top:1px solid #111;margin-top:2vw}.podcast-ratings-label{padding:14px 0;font:9px 'DM Mono',monospace;letter-spacing:.08em;color:#777}.podcast-ratings-links{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid #ccc}.podcast-ratings-links a{display:grid;grid-template-columns:auto 1fr auto;gap:16px;align-items:center;padding:18px 0;color:#111;text-decoration:none;border-right:1px solid #ccc}.podcast-ratings-links a:last-child{padding-left:24px;border-right:0}.podcast-ratings-links strong{font-size:15px;font-weight:600}.podcast-ratings-links span{font:9px 'DM Mono',monospace;letter-spacing:.05em;color:#666}.podcast-ratings-links b{font:13px 'DM Mono',monospace;font-weight:400}\n\n/* Original Music: clean catalogue layout, no fake covers or track numbering. */\n.music-section{padding-bottom:8vw}.music-grid{display:block}.music-card{display:grid;grid-template-columns:minmax(260px,.75fr) minmax(0,1.5fr);column-gap:7vw;border-top:1px solid #111;padding:4vw 0 5vw}.music-card:first-child{border-top:0}.music-cover{display:none!important}.music-card-head{display:block;padding:0}.music-card-head>span,.music-card-index{display:none!important}.music-card-head h3{font-size:clamp(34px,4.8vw,72px);font-weight:300;letter-spacing:-.06em;line-height:.95;margin:0 0 18px}.music-card-head p{font:9px 'DM Mono',monospace;letter-spacing:.08em;color:#777;margin:0;text-transform:uppercase}.music-tracks{border-top:1px solid #ccc}.music-track{display:grid;grid-template-columns:1fr;gap:10px;padding:18px 0;border-bottom:1px solid #ccc}.music-track-meta{display:block}.music-track-meta>span{display:none!important}.music-track-meta strong{font-size:15px;font-weight:400}.music-track iframe{width:100%;height:66px;border:0;display:block}.music-link-card{grid-column:1/-1;display:flex;justify-content:space-between;align-items:center;margin-top:25px;padding-top:15px;border-top:1px solid #111;color:#111;text-decoration:none;font:9px 'DM Mono',monospace;letter-spacing:.08em}.music-link-card b{font-size:14px;font-weight:400}.music-note{font:9px/1.7 'DM Mono',monospace;color:#777;margin:0;padding-top:12px;border-top:1px solid #ccc}\n\n@media(max-width:700px){.entertainment-category-nav{margin:32px 0 45px}.entertainment-page .show-intro{padding:6vw 0}.entertainment-page .episode-browser{display:block;padding:6vw 0}.entertainment-page .episode-list{margin-top:30px}.podcast-ratings-links{grid-template-columns:1fr}.podcast-ratings-links a,.podcast-ratings-links a:last-child{padding:16px 0;border-right:0;border-bottom:1px solid #ccc}.podcast-ratings-links a:last-child{border-bottom:0}.music-card{display:block;padding:10vw 0}.music-card-head{margin-bottom:35px}.music-card-head h3{font-size:13vw}.music-track iframe{height:66px}.music-link-card{margin-top:20px}.page-title{grid-template-columns:1fr}}\n`
fs.writeFileSync(stylesPath, styles)

console.log('Patched cache-safe homepage images, language selector, page-title numbering, podcast-only ratings, and redesigned Entertainment/Music layouts.')
