import fs from 'node:fs'

const root = process.cwd()
const mainPath = `${root}/src/main.tsx`
const collectionPath = `${root}/src/Collection.tsx`
const publicDir = `${root}/public`
fs.mkdirSync(publicDir,{recursive:true})

const sources = {
  film: [
    ['https://movie.douban.com/review/9709291','《网络谜踪》中蕴含的魔鬼细节'],
    ['https://movie.douban.com/review/12640989/',''],
    ['https://movie.douban.com/review/17101161/',''],
    ['https://movie.douban.com/review/12059697/',''],
    ['https://movie.douban.com/review/10568087/',''],
    ['https://movie.douban.com/review/10513148/',''],
    ['https://movie.douban.com/review/10205386/',''],
    ['https://movie.douban.com/review/10138459/',''],
  ],
  answer: [
    ['https://www.zhihu.com/question/321494449/answer/665771371','绿化草坪为什么不用韭菜'],
    ['https://www.zhihu.com/question/319189226/answer/912885307',''],
    ['https://www.zhihu.com/question/301604051/answer/530284319',''],
    ['https://www.zhihu.com/question/268447608/answer/341457341',''],
    ['https://www.zhihu.com/question/58732650/answer/159030771',''],
    ['https://www.zhihu.com/question/38518059/answer/77050144',''],
    ['https://www.zhihu.com/question/36028568/answer/65633702',''],
    ['https://www.zhihu.com/question/35738932/answer/65178529',''],
    ['https://www.zhihu.com/question/31516346/answer/52358745',''],
    ['https://www.zhihu.com/question/27208590/answer/51915274',''],
    ['https://www.zhihu.com/question/30658907/answer/48932601',''],
  ]
}

function cleanTitle(raw=''){
  const text = raw.replace(/\s+/g,' ').trim()
  return text
    .replace(/\s*[|｜]\s*(知乎|豆瓣电影|豆瓣)\s*$/i,'')
    .replace(/\s*-\s*(知乎|豆瓣电影|豆瓣)\s*$/i,'')
    .replace(/^知乎[：:]\s*/,'')
    .trim()
}

async function fetchTitle(url,fallback){
  try{
    const res = await fetch(url,{headers:{'user-agent':'Mozilla/5.0 (compatible; OneStageBot/1.0)','accept-language':'zh-CN,zh;q=0.9,en;q=0.8'},signal:AbortSignal.timeout(15000)})
    const html = await res.text()
    const og = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1]
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i)?.[1]
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
    return cleanTitle(og || title || fallback) || fallback
  }catch{return fallback}
}

async function translate(text){
  if(!text) return ''
  try{
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=zh-CN|en`
    const res = await fetch(url,{signal:AbortSignal.timeout(12000)})
    const data = await res.json()
    const out = data?.responseData?.translatedText
    if(out && !/MYMEMORY WARNING/i.test(out)) return out.replace(/\s+/g,' ').trim()
  }catch{}
  return text
}

const film=[]
for(const [href,fallback] of sources.film){
  const zh = await fetchTitle(href,fallback)
  film.push({zh,en:await translate(zh),href,meta:'Douban · Film Review'})
}
const answers=[]
for(const [href,fallback] of sources.answer){
  const zh = await fetchTitle(href,fallback)
  answers.push({zh,en:await translate(zh),href})
}

fs.writeFileSync(`${publicDir}/collection-metadata.json`,JSON.stringify({film,answers},null,2))

let collection = fs.readFileSync(collectionPath,'utf8')
const filmLiteral = JSON.stringify(film).replace(/"/g,"'")
const answerLiteral = JSON.stringify(answers).replace(/"/g,"'")
collection = collection.replace(/const filmReviews=\[[\s\S]*?\n\]\nconst answers=\[[\s\S]*?\n\]\n/,`const filmReviews=${filmLiteral}\nconst answers=${answerLiteral}\n`)
fs.writeFileSync(collectionPath,collection)

let main = fs.readFileSync(mainPath,'utf8')
const start = main.indexOf('function Entertainment({lang}:{lang:Lang}){')
const end = main.indexOf('\nfunction App(){',start)
if(start<0 || end<0) throw new Error('Entertainment function markers not found')
const entertainment = `function Entertainment({lang}:{lang:Lang}){
  const youtubeEmbed='https://www.youtube.com/embed/v9qaddGKum8?rel=0',bilibiliUrl='https://b23.tv/NvH8KU3'
  const albums=[
    {zh:'牛马假日',en:'NiúMǎ Holiday',id:'385484900'},
    {zh:'池塘里的那片海',en:'The Sea in the Pond',id:'385484965'}
  ]
  return <main className="page entertainment-page"><PageTitle no="02" lang={lang} en="OneStage Entertainment" zh="壹阶娱乐" descEn="Podcast / Music / Video" descZh="播客 / 音乐 / 影像"/><section className="show-intro"><div><p className="eyebrow">ORIGINAL PODCAST</p><h2>{lang==='en'?'NiúMǎ Holiday':'牛马假日'}</h2><p className="show-desc">{lang==='en'?'A podcast documenting the lives, work and small absurdities of ordinary working people.':'一档记录普通打工人故事的播客。聊工作，也聊生活，以及那些发生在“牛马”与“假日”之间的真实切片。'}</p></div><div className="show-meta"><span>01 / ONESTAGE ENTERTAINMENT</span><span>{lang==='en'?'AUDIO + VIDEO PODCAST':'音频 + 视频播客'}</span></div></section><section className="media-layout"><EpisodeList lang={lang}/><div className="video-column"><div className="section-label"><span>{lang==='en'?'LATEST VIDEO':'最新视频'}</span><span>{lang==='en'?'YOUTUBE':'BILIBILI'}</span></div>{lang==='en'?<div className="video-embed"><iframe title="NiúMǎ Holiday latest video on YouTube" src={youtubeEmbed} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/></div>:<a className="video-link-card" href={bilibiliUrl} target="_blank" rel="noreferrer"><div className="video-link-inner"><span className="video-link-kicker">BILIBILI</span><strong>打开《牛马假日》最新视频</strong><span className="video-link-url">b23.tv/NvH8KU3 ↗</span></div></a>}<p className="feed-note">{lang==='en'?'Latest video · YouTube':'最新视频 · Bilibili（点击打开）'}</p></div></section><section className="music-section"><div className="section-label"><span>{lang==='en'?'ORIGINAL MUSIC':'原创音乐'}</span><span>{lang==='en'?'NETEASE CLOUD MUSIC':'网易云音乐'}</span></div><div className="music-grid">{albums.map((album,i)=><article className="music-card" key={album.id}><div className="music-card-head"><span>0{i+1}</span><div><h3>{lang==='en'?album.en:album.zh}</h3><p>{lang==='en'?'Album · Rainchen':'专辑 · 雨尘'}</p></div><a href={\`https://music.163.com/album/${album.id}/?userid=310622971\`} target="_blank" rel="noreferrer">↗</a></div><div className="music-player"><iframe title={album.en} src={\`https://music.163.com/outchain/player?type=0&id=${album.id}&auto=0&height=90\`} loading="lazy" frameBorder="0" marginWidth="0" marginHeight="0"/></div></article>)}</div></section><section className="ratings-row"><span>{lang==='en'?'RATINGS':'评分网站'}</span><a className="rating-card" href={lang==='en'?'https://www.imdb.com/title/tt44772588':'https://www.douban.com/doubanapp/dispatch/movie/38625203'} target="_blank" rel="noreferrer"><span className={\`rating-mark ${lang==='en'?'imdb-mark':'douban-mark'}\`}>{lang==='en'?'IMDb':'豆瓣'}</span><span className="rating-text">{lang==='en'?'View on IMDb':'查看豆瓣词条'}</span><span className="rating-arrow">↗</span></a></section><section className="platform-row"><span>{lang==='en'?'ALSO AVAILABLE ON':'同步发布于'}</span><span>{lang==='en'?'Xiaoyuzhou · Himalaya · Apple Podcasts · YouTube · Bilibili':'小宇宙 · 喜马拉雅 · Apple Podcasts · YouTube · Bilibili'}</span></section></main>
}
`
main = main.slice(0,start) + entertainment + main.slice(end)
fs.writeFileSync(mainPath,main)
console.log(`Prepared collection metadata: ${film.length} film reviews + ${answers.length} Zhihu answers`)
console.log('Prepared two NetEase Cloud Music album players')
`
