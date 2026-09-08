import fs from 'node:fs'

const root=process.cwd(), mainPath=`${root}/src/main.tsx`, collectionPath=`${root}/src/Collection.tsx`, publicDir=`${root}/public`
fs.mkdirSync(publicDir,{recursive:true})

const sources={
  film:[
    ['https://movie.douban.com/review/9709291','《网络迷踪》中蕴含的魔鬼细节','The Devilish Details Hidden in Searching'],
    ['https://movie.douban.com/review/12640989','《捍卫雅各布》不窥全貌，不予置评','Don’t Judge Without Seeing the Whole Picture: Defending Jacob'],
    ['https://movie.douban.com/review/17101161','《漫威丧尸》带大家回顾一下前作','Marvel Zombies: A Look Back at the Previous Installments'],
    ['https://movie.douban.com/review/12059697','《利刃出鞘》上映在即，凭记忆电影彩蛋全解析','Knives Out Is Coming: A Complete Analysis of the Film’s Easter Eggs from Memory'],
    ['https://movie.douban.com/review/10568087','《难以置信》恶魔在人间，幸好还有天使守护','Unbelievable: Demons Among Us, Thankfully Angels Still Protect Us'],
    ['https://movie.douban.com/review/10513148','《抹去重来》脑洞观众的穿越指南','Undone: A Time-Travel Guide for Brainy Viewers'],
    ['https://movie.douban.com/review/10205386','《Ghosts》里都是什么鬼？','What Kind of Ghosts Are in Ghosts?'],
    ['https://movie.douban.com/review/10138459','《复仇者联盟4：终局之战》时间理论解析','Avengers: Endgame — An Analysis of Its Time Theory']
  ],
  answer:[
    ['https://www.zhihu.com/question/268447608/answer/341457341','绿化草坪为什么不用韭菜？','Why Don’t We Use Chives for Lawn Grass?','周刊收录 · 2018 年度 300 问 | 新知：人类七分熟 · 知乎日报收录','weekly'],
    ['https://www.zhihu.com/question/321494449/answer/665771371','如何解读《复仇者联盟 4》涉及到的时间悖论？','How Should We Understand the Time Paradox in Avengers: Endgame?','圆桌收录：再见初代复联','roundtable'],
    ['https://www.zhihu.com/question/319189226/answer/912885307','为什么裸子植物普遍长得很直？','Why Are Gymnosperms Generally So Straight?','2019 科学季 / 圆桌收录：让植物说话 | 非常想问','roundtable'],
    ['https://www.zhihu.com/question/58732650/answer/159030771','如何看待 27 岁设计师加班到凌晨猝死？','What Do You Think About the Death of a 27-Year-Old Designer After Working Overtime Until Late at Night?','知乎日报收录 · 编辑推荐','daily'],
    ['https://www.zhihu.com/question/36028568/answer/65633702','《死亡笔记》中 L 的推理究竟是有理有据的逻辑分析，还是凭直觉的开脑洞？','Is L’s Reasoning in Death Note Logical Analysis or Intuitive Guesswork?','知乎日报收录 · 编辑推荐','daily'],
    ['https://www.zhihu.com/question/35738932/answer/65178529','从《天龙八部》到《鹿鼎记》，为什么金庸小说中的武林高手越来越弱？','Why Do Martial Arts Masters Become Weaker from Demi-Gods and Semi-Devils to The Deer and the Cauldron?','知乎日报收录','daily'],
    ['https://www.zhihu.com/question/30658907/answer/48932601','观看话剧演出为什么不能拍照摄影？','Why Are Photography and Filming Not Allowed During Stage Performances?','知乎日报收录 · 编辑推荐','daily'],
    ['https://www.zhihu.com/question/301604051/answer/530284319','地产景观设计和市政景观设计的区别是什么？','What Is the Difference Between Real Estate Landscape Design and Municipal Landscape Design?','编辑推荐','editorial'],
    ['https://www.zhihu.com/question/38518059/answer/77050144','如何看待雨水园以及设计中水资源的可持续利用与发展？','How Should We Understand Rain Gardens and the Sustainable Use of Water Resources in Design?','编辑推荐','editorial'],
    ['https://www.zhihu.com/question/31516346/answer/52358745','一个话剧剧组或者音乐剧组每到一个地方巡演，需要准备些什么东西？','What Does a Theatre or Musical Company Need to Prepare When Touring to Different Places?','编辑推荐','editorial'],
    ['https://www.zhihu.com/question/27208590/answer/51915274','看《歌剧魅影》最合适的座位在哪儿？','Where Is the Best Seat for Watching The Phantom of the Opera?','编辑推荐','editorial']
  ]
}
function cleanTitle(raw=''){return raw.replace(/\s+/g,' ').trim().replace(/\s*[|｜]\s*(知乎|豆瓣电影|豆瓣)\s*$/i,'').replace(/\s*-\s*(知乎|豆瓣电影|豆瓣)\s*$/i,'').replace(/^知乎[：:]\s*/,'').trim()}
async function fetchTitle(url,fallback){try{const res=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 (compatible; OneStageBot/1.0)','accept-language':'zh-CN,zh;q=0.9,en;q=0.8'},signal:AbortSignal.timeout(10000)});const html=await res.text();const og=html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1]||html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["'][^>]*>/i)?.[1];const title=html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];return cleanTitle(og||title||fallback)||fallback}catch{return fallback}}
const film=await Promise.all(sources.film.map(async([href,zh,en])=>({zh,en,href,meta:'Douban · Film Review'})))
const answers=await Promise.all(sources.answer.map(async([href,zh,en,recognition,category])=>({zh,en,href,recognition,category})))
fs.writeFileSync(`${publicDir}/collection-metadata.json`,JSON.stringify({film,answers},null,2))

let collection=fs.readFileSync(collectionPath,'utf8')
const collectionData=`const filmReviews=${JSON.stringify(film)}\nconst answers=${JSON.stringify(answers)}\n`
collection=collection.replace(/const filmReviews=\[[\s\S]*?\n\]\nconst answers=\[[\s\S]*?\n\]\n/,collectionData)
const oldCollectionStart=collection.indexOf("    {active==='film'&&")
const oldCollectionEnd=collection.indexOf("  </main>",oldCollectionStart)
if(oldCollectionStart<0||oldCollectionEnd<0)throw new Error('Collection section markers not found')
const collectionSections=`    {active==='film'&&<section className="collection-section collection-tab-content"><div className="collection-section-head"><span>01</span><div><h3>{lang==='en'?'FILM & TELEVISION':'影视评论'}</h3><p>{lang==='en'?'Reviews, details & observations':'影视评论、细节考据与观察'}</p></div></div><div className="collection-archive-list">{filmReviews.map(x=><a className="collection-row" href={x.href} target="_blank" rel="noreferrer" key={x.href}><div><p className="collection-row-type">{x.meta}</p><h4>{lang==='en'?x.en:x.zh}</h4></div><span className="collection-row-arrow">↗</span></a>)}</div></section>}
    {active==='answers'&&<section className="collection-section collection-tab-content"><div className="collection-section-head"><span>02</span><div><h3>{lang==='en'?'ANSWERS':'知乎回答'}</h3><p>{lang==='en'?'Selected public knowledge writing':'精选知乎回答与知识型写作'}</p></div></div><div className="answer-stats"><div><strong>20K+</strong><span>{lang==='en'?'FOLLOWERS':'关注者'}</span></div><div><strong>11</strong><span>{lang==='en'?'SELECTED WORKS':'入选作品'}</span></div><div><strong>2018</strong><span>{lang==='en'?'ZH DAILY / 300 QUESTIONS':'知乎日报 / 300问'}</span></div></div><div className="collection-archive-list">{answers.map(x=><a className="collection-row answer-row" href={x.href} target="_blank" rel="noreferrer" key={x.href}><div><p className="collection-row-type">Zhihu · Answer</p><h4>{lang==='en'?x.en:x.zh}</h4>{x.recognition&&<div className="collection-row-recognition">{x.recognition}</div>}</div><span className="collection-row-arrow">↗</span></a>)}</div><div className="collection-archive-note">{lang==='en'?'11 answers have been selected for Zhihu editorial features, roundtables, Zhihu Weekly and Zhihu Daily.':'共有11个回答进入知乎编辑精选、知乎圆桌、知乎周刊和知乎日报等栏目。'}</div></section>}
`
collection=collection.slice(0,oldCollectionStart)+collectionSections+collection.slice(oldCollectionEnd)
fs.writeFileSync(collectionPath,collection)

let main=fs.readFileSync(mainPath,'utf8')
if(!main.includes("import './music.css'"))main=main.replace("import './styles.css'","import './styles.css'\nimport './music.css'")
const start=main.indexOf('function Entertainment({lang}:{lang:Lang}){'),end=main.indexOf('\nfunction App(){',start)
if(start<0||end<0)throw new Error('Entertainment function markers not found')
const entertainment=`function Entertainment({lang}:{lang:Lang}){
  const [active,setActive]=useState<'podcast'|'music'|'video'>('podcast')
  const [video,setVideo]=useState({youtubeVideoId:'v9qaddGKum8',bilibiliBvid:'BV18nbE6kE18'})
  const [musicData,setMusicData]=useState<any[]>([])
  useEffect(()=>{fetch(\`${'${'}import.meta.env.BASE_URL}video-data.json\`).then(r=>r.ok?r.json():null).then(data=>{if(data)setVideo(v=>({...v,...data}))}).catch(()=>{})},[])
  useEffect(()=>{fetch(\`${'${'}import.meta.env.BASE_URL}music-data.json\`).then(r=>r.ok?r.json():null).then(data=>{if(Array.isArray(data?.albums))setMusicData(data.albums)}).catch(()=>{})},[])
  const albums=[{zh:'牛马假日',en:'NiúMǎ Holiday',id:'385484900',year:'2026'},{zh:'池塘里的那片海',en:'The Sea in the Pond',id:'385484965',year:'2026'}]
  const nav=[{key:'podcast' as const,en:'Podcast',zh:'播客'},{key:'music' as const,en:'Original Music',zh:'原创音乐'},{key:'video' as const,en:'Video',zh:'影像'}]
  return <main className="page entertainment-page"><PageTitle no="02" lang={lang} en="OneStage Entertainment" zh="壹阶娱乐" descEn="Podcast / Music / Video" descZh="播客 / 音乐 / 影像"/><div className="entertainment-category-nav">{nav.map(item=><button key={item.key} className={active===item.key?'selected':''} onClick={()=>{setActive(item.key);window.scrollTo({top:0,behavior:'smooth'})}}>{lang==='en'?item.en:item.zh}</button>)}</div>
    {active==='podcast'&&<section className="entertainment-tab-content"><section className="show-intro"><div><p className="eyebrow">ORIGINAL PODCAST</p><h2>{lang==='en'?'NiúMǎ Holiday':'牛马假日'}</h2><p className="show-desc">{lang==='en'?'A podcast documenting the lives, work and small absurdities of ordinary working people.':'一档记录普通打工人故事的播客。聊工作，也聊生活，以及那些发生在“牛马”与“假日”之间的真实切片。'}</p></div><div className="show-meta"><span>01 / ONESTAGE ENTERTAINMENT</span><span>{lang==='en'?'AUDIO PODCAST':'音频播客'}</span></div></section><EpisodeList lang={lang}/></section>}
    {active==='music'&&<section className="music-section entertainment-tab-content"><div className="section-label"><span>{lang==='en'?'ORIGINAL MUSIC':'原创音乐'}</span><span>{lang==='en'?'NETEASE CLOUD MUSIC':'网易云音乐'}</span></div><div className="music-grid">{albums.map((album,i)=>{const live=musicData.find(x=>String(x.id)===album.id);const tracks=Array.isArray(live?.tracks)?live.tracks:[];return <article className="music-card" key={album.id}><div className="music-cover" aria-hidden="true"><span>{String(i+1).padStart(2,'0')}</span><small>ONESTAGE<br/>ORIGINAL MUSIC</small></div><div className="music-card-head"><span>0{i+1}</span><div><h3>{lang==='en'?album.en:album.zh}</h3><p>{lang==='en'?'Album · Rainchen · '+album.year:'专辑 · 雨尘 · '+album.year}</p></div><span className="music-card-index">{String(i+1).padStart(2,'0')}</span></div>{tracks.length>0?<div className="music-tracks">{tracks.map((track:any,j:number)=><div className="music-track" key={track.id}><div className="music-track-meta"><span>{String(j+1).padStart(2,'0')}</span><strong>{track.name}</strong></div><iframe title={track.name} src={'https://music.163.com/outchain/player?type=2&id='+track.id+'&auto=0&height=66'} loading="lazy" allow="autoplay"/></div>)}</div>:<div className="music-unavailable"><span>{lang==='en'?'Loading official player…':'正在加载官方播放器…'}</span></div>}<a className="music-link-card" href={'https://music.163.com/album/'+album.id+'/?userid=310622971'} target="_blank" rel="noreferrer"><span>{lang==='en'?'OPEN ALBUM ON NETEASE CLOUD MUSIC':'在网易云音乐打开专辑'}</span><b>↗</b></a></article>})}</div><p className="music-note">{lang==='en'?'Playback uses NetEase Cloud Music official external players; tracks remain hosted by NetEase.':'播放使用网易云音乐官方外链播放器，音频仍由网易云音乐提供。'}</p></section>}
    {active==='video'&&<section className="video-tab-content entertainment-tab-content"><div className="section-label"><span>{lang==='en'?'LATEST VIDEO':'最新视频'}</span><span>{lang==='en'?'YOUTUBE':'BILIBILI'}</span></div>{lang==='en'?<div className="video-embed"><iframe title="NiúMǎ Holiday latest video on YouTube" src={'https://www.youtube.com/embed/'+video.youtubeVideoId+'?rel=0'} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/></div>:<div className="video-embed"><iframe title="牛马假日 latest video on Bilibili" src={'https://player.bilibili.com/player.html?bvid='+video.bilibiliBvid+'&autoplay=0&danmaku=0'} loading="lazy" allowFullScreen/></div>}<p className="feed-note">{lang==='en'?'Latest video · YouTube':'最新视频 · Bilibili'}</p></section>}
    <section className="ratings-row"><span>{lang==='en'?'RATINGS':'评分网站'}</span><a className="rating-card" href={lang==='en'?'https://www.imdb.com/title/tt44772588':'https://www.douban.com/doubanapp/dispatch/movie/38625203'} target="_blank" rel="noreferrer"><span className={\`rating-mark \${lang==='en'?'imdb-mark':'douban-mark'}\`}>{lang==='en'?'IMDb':'豆瓣'}</span><span className="rating-text">{lang==='en'?'View on IMDb':'查看豆瓣词条'}</span><span className="rating-arrow">↗</span></a></section><section className="platform-row"><span>{lang==='en'?'ALSO AVAILABLE ON':'同步发布于'}</span><span>{lang==='en'?'Xiaoyuzhou · Himalaya · Apple Podcasts · YouTube · Bilibili':'小宇宙 · 喜马拉雅 · Apple Podcasts · YouTube · Bilibili'}</span></section></main>
}
`
main=main.slice(0,start)+entertainment+main.slice(end)
fs.writeFileSync(mainPath,main)
console.log(`Prepared ${film.length} film reviews + ${answers.length} Zhihu entries and 2 music albums`)
