import fs from 'node:fs'

const root = process.cwd()
const mainPath = `${root}/src/main.tsx`
const stylesPath = `${root}/src/styles.css`

let main = fs.readFileSync(mainPath, 'utf8')

// The three homepage directory panels are intentionally unnumbered.
main = main.replace(/<span>0[123]<\/span>/g, '')

// IMDb/Douban are program listings for NiúMǎ Holiday. Each language shows only
// the corresponding local listing: IMDb in English, Douban in Chinese.
main = main.replace(/<section className="podcast-ratings">[\s\S]*?<\/section>/g, '')
const ratings = `<section className="podcast-ratings"><div className="podcast-ratings-label">{lang==='en'?'PROGRAM LISTING':'节目词条'}</div><div className="podcast-ratings-links">{lang==='en'?<a href="https://www.imdb.com/title/tt44772588" target="_blank" rel="noreferrer"><strong>IMDb</strong><span>View NiúMǎ Holiday on IMDb</span><b>↗</b></a>:<a href="https://www.douban.com/doubanapp/dispatch/movie/38625203" target="_blank" rel="noreferrer"><strong>豆瓣</strong><span>查看牛马假日豆瓣词条</span><b>↗</b></a>}</div></section>`

// Podcast and Video are two media forms of the same NiúMǎ Holiday program.
if (main.includes('<EpisodeList lang={lang}/>')) {
  main = main.replace('<EpisodeList lang={lang}/>', `<EpisodeList lang={lang}/>${ratings}`)
}

// Put the same program listing into the Video tab, while leaving Original Music clean.
const feedPattern = /(<p className="feed-note">[\s\S]*?<\/p>)/
if (feedPattern.test(main)) {
  main = main.replace(feedPattern, `$1${ratings}`)
}

fs.writeFileSync(mainPath, main)

let styles = fs.readFileSync(stylesPath, 'utf8')
styles += `\n\n/* Final entertainment corrections: home directories are unnumbered; each language shows only its own NiúMǎ Holiday listing. */\n.home-panel .panel-overlay>span{display:none!important}\n.podcast-ratings-links{grid-template-columns:minmax(0,1fr)!important}\n.podcast-ratings-links a{border-right:0!important}\n@media(max-width:700px){.podcast-ratings-links{grid-template-columns:1fr!important}}\n`
fs.writeFileSync(stylesPath, styles)

console.log('Fixed homepage panel numbering and NiúMǎ Holiday listings across Podcast + Video; Original Music remains without IMDb/Douban.')
