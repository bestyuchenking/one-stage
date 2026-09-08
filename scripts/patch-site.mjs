import fs from 'node:fs'

const root = process.cwd()
const mainPath = `${root}/src/main.tsx`
const collectionPath = `${root}/src/Collection.tsx`
const stylesPath = `${root}/src/styles.css`

let main = fs.readFileSync(mainPath, 'utf8')

const appState = "const [section,setSection]=useState<Section>('home'),[menu,setMenu]=useState(false),[lang,setLang]=useState<Lang>('en'),[activeCategory,setActiveCategory]=useState<Category|'ALL'>('ALL'),[imageMap,setImageMap]=useState<Record<string,string[]>>({})"
const appStatePatched = "const [section,setSection]=useState<Section>('home'),[menu,setMenu]=useState(false),[lang,setLang]=useState<Lang>('en'),[langMenu,setLangMenu]=useState(false),[activeCategory,setActiveCategory]=useState<Category|'ALL'>('ALL'),[imageMap,setImageMap]=useState<Record<string,string[]>>({}),[homeAssets,setHomeAssets]=useState<{collection?:string;entertainment?:string}>({})"
if (main.includes(appState)) main = main.replace(appState, appStatePatched)

const imageEffect = "useEffect(()=>{fetch(`${import.meta.env.BASE_URL}project-images.json`,{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject(new Error(`HTTP ${r.status}`))).then(data=>setImageMap(data&&typeof data==='object'?data:{})).catch(()=>setImageMap({}))},[])"
const imageEffectPatched = `${imageEffect}\n  useEffect(()=>{fetch(`${'${'}import.meta.env.BASE_URL}home-assets.json`,{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject(new Error(`HTTP ${'${'}r.status}`))).then(data=>setHomeAssets(data&&typeof data==='object'?data:{})).catch(()=>{})},[])\n  useEffect(()=>{\n    let cancelled=false\n    const controller=new AbortController()\n    const timer=setTimeout(()=>controller.abort(),3000)\n    fetch('https://ipapi.co/country/',{signal:controller.signal,cache:'no-store'})\n      .then(r=>r.ok?r.text():'')\n      .then(country=>{if(!cancelled)setLang(country.trim().toUpperCase()==='CN'?'zh':'en')})\n      .catch(()=>{if(!cancelled)setLang(navigator.language.toLowerCase().startsWith('zh')?'zh':'en')})\n      .finally(()=>clearTimeout(timer))\n    return()=>{cancelled=true;controller.abort();clearTimeout(timer)}\n  },[])`
if (main.includes(imageEffect)) main = main.replace(imageEffect, imageEffectPatched)

const oldToggle = "<button className=\"lang-toggle\" onClick={toggleLang}>{lang==='en'?'中':'EN'}</button>"
const newToggle = "<div className=\"language-switcher\"><button className=\"lang-toggle\" onClick={()=>setLangMenu(v=>!v)} aria-label={lang==='en'?'Language':'语言'} aria-expanded={langMenu}>🌐</button>{langMenu&&<div className=\"language-menu\"><button className={lang==='zh'?'selected':''} onClick={()=>{setLang('zh');setLangMenu(false)}}>中文</button><button className={lang==='en'?'selected':''} onClick={()=>{setLang('en');setLangMenu(false)}}>English</button></div>}</div>"
if (main.includes(oldToggle)) main = main.replace(oldToggle, newToggle)
main = main.replace(",toggleLang=()=>setLang(lang==='en'?'zh':'en'),visibleProjects", ",visibleProjects")

// Use content-hashed WebP filenames generated from the uploaded JPGs.
// This prevents GitHub Pages/CDN from serving an older image when a source JPG is replaced.
const oldHomeCollection = '<img src="/one-stage/assets/home-collection.webp" alt="OneStage Collection" loading="eager" decoding="async"/>'
const newHomeCollection = '<img src={homeAssets.collection||`${import.meta.env.BASE_URL}assets/home-collection.webp`} alt="OneStage Collection" loading="eager" decoding="async"/>'
if (main.includes(oldHomeCollection)) main = main.replace(oldHomeCollection, newHomeCollection)
const oldHomeEntertainment = '<img src="/one-stage/assets/home-entertainment.webp" alt="OneStage Entertainment" loading="eager" decoding="async"/>'
const newHomeEntertainment = '<img src={homeAssets.entertainment||`${import.meta.env.BASE_URL}assets/home-entertainment.webp`} alt="OneStage Entertainment" loading="eager" decoding="async"/>'
if (main.includes(oldHomeEntertainment)) main = main.replace(oldHomeEntertainment, newHomeEntertainment)

fs.writeFileSync(mainPath, main)

let collection = fs.readFileSync(collectionPath, 'utf8')
const oldTitle = '<h2>虚拟世界侵入现实</h2>'
const newTitle = "<h2>{lang==='en'?'Reality Is Being Altered':'虚拟世界侵入现实'}</h2>"
if (collection.includes(oldTitle)) collection = collection.replace(oldTitle, newTitle)
fs.writeFileSync(collectionPath, collection)

let styles = fs.readFileSync(stylesPath, 'utf8')
styles += `\n\n/* Language selector */\n.language-switcher{position:relative;display:flex;align-items:center}.lang-toggle{width:30px;height:30px;padding:0;border:0;background:transparent;color:inherit;display:grid;place-items:center;font-size:17px;line-height:1;cursor:pointer}.language-menu{position:absolute;top:calc(100% + 10px);right:0;min-width:108px;padding:6px;background:rgba(245,245,242,.98);border:1px solid #ccc;box-shadow:0 8px 24px rgba(0,0,0,.08);z-index:1000}.language-menu button{display:block;width:100%;padding:9px 11px;border:0;background:transparent;text-align:left;font:10px 'DM Mono',monospace;letter-spacing:.04em;cursor:pointer;color:#111}.language-menu button:hover,.language-menu button.selected{background:#e7e7e3}.language-menu button.selected{font-weight:600}@media(max-width:700px){.language-menu{right:-4px;min-width:100px}}\n`
fs.writeFileSync(stylesPath, styles)

console.log('Patched IP-based language default, language dropdown, bilingual Collection title, and cache-safe homepage image manifest.')
