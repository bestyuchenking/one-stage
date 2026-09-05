import React from 'react'

type Lang = 'en' | 'zh'
const readkuUrl='https://detail.youzan.com/show/goods?alias=36dvoghfymyoay8&from_source=gbox_seo'
const filmReviews=[
  {title:'《网络谜踪》中蕴含的魔鬼细节',href:'https://movie.douban.com/review/9709291',meta:'Douban · Film Review',recognition:'700K+ views'},
  {title:'Douban Film Review · 12640989',href:'https://movie.douban.com/review/12640989/',meta:'Douban · Film Review'},
  {title:'Douban Film Review · 17101161',href:'https://movie.douban.com/review/17101161/',meta:'Douban · Film Review'},
  {title:'Douban Film Review · 12059697',href:'https://movie.douban.com/review/12059697/',meta:'Douban · Film Review'},
  {title:'Douban Film Review · 10568087',href:'https://movie.douban.com/review/10568087/',meta:'Douban · Film Review'},
  {title:'Douban Film Review · 10513148',href:'https://movie.douban.com/review/10513148/',meta:'Douban · Film Review'},
  {title:'Douban Film Review · 10205386',href:'https://movie.douban.com/review/10205386/',meta:'Douban · Film Review'},
  {title:'Douban Film Review · 10138459',href:'https://movie.douban.com/review/10138459/',meta:'Douban · Film Review'},
]
const answers=[
  {title:'绿化草坪为什么不用韭菜',href:'https://www.zhihu.com/question/321494449/answer/665771371',recognition:'知乎日报 · 2018年度300问 · 《新知：人类七分熟》'},
  {title:'知乎精选回答 · 02',href:'https://www.zhihu.com/question/319189226/answer/912885307'},
  {title:'知乎精选回答 · 03',href:'https://www.zhihu.com/question/301604051/answer/530284319'},
  {title:'知乎精选回答 · 04',href:'https://www.zhihu.com/question/268447608/answer/341457341'},
  {title:'知乎精选回答 · 05',href:'https://www.zhihu.com/question/58732650/answer/159030771'},
  {title:'知乎精选回答 · 06',href:'https://www.zhihu.com/question/38518059/answer/77050144'},
  {title:'知乎精选回答 · 07',href:'https://www.zhihu.com/question/36028568/answer/65633702'},
  {title:'知乎精选回答 · 08',href:'https://www.zhihu.com/question/35738932/answer/65178529'},
  {title:'知乎精选回答 · 09',href:'https://www.zhihu.com/question/31516346/answer/52358745'},
  {title:'知乎精选回答 · 10',href:'https://www.zhihu.com/question/27208590/answer/51915274'},
  {title:'知乎精选回答 · 11',href:'https://www.zhihu.com/question/30658907/answer/48932601'},
]
function Collection({lang,PageTitle}:{lang:Lang;PageTitle:React.ComponentType<{no:string;lang:Lang;en:string;zh:string;descEn:string;descZh:string}>}){
  return <main className="page collection-page">
    <PageTitle no="03" lang={lang} en="OneStage Collection" zh="壹阶集录" descEn="Selected writings, observations and answers" descZh="文章 / 影视观察 / 知识型写作"/>
    <section className="collection-intro"><div><p className="eyebrow">SELECTED WRITINGS</p><h2>{lang==='en'?'Words are another kind of space.':'文字，是另一种空间。'}</h2></div><p>{lang==='en'?'A record of writing across print, film criticism and public knowledge platforms. Different places, one archive.':'收录散落于纸媒、影视评论与公共知识平台上的文字作品。来源不同，但以同一种作品档案的方式保存。'}</p></section>
    <section className="collection-feature"><div className="collection-feature-index"><span>FEATURED</span><span>01 / 03</span></div><div className="collection-feature-body"><div className="collection-feature-copy"><p className="collection-type">{lang==='en'?'ESSAY · PRINT':'文章 · 纸媒'}</p><h2>虚拟世界侵入现实</h2><p>{lang==='en'?'An essay on how virtual worlds cross the screen and become part of everyday reality.':'一篇关于虚拟世界如何越过屏幕、进入现实，并让现实本身成为故事一部分的文章。'}</p><div className="collection-recognition">{lang==='en'?'Published in 读库 2401 · pp. 261–283':'发表于《读库2401》· P261–283'}</div><a href={readkuUrl} target="_blank" rel="noreferrer" className="collection-action">{lang==='en'?'VIEW PUBLICATION':'查看《读库2401》'} <span>↗</span></a></div><div className="publication-card"><img src="/one-stage/assets/duku-2401-cover.jpg" alt="读库2401"/><span className="publication-caption">P261—283<br/>虚拟世界侵入现实</span></div></div></section>
    <section className="collection-section"><div className="collection-section-head"><span>01</span><div><h3>{lang==='en'?'FILM & TELEVISION':'影视评论'}</h3><p>{lang==='en'?'Reviews, details & observations':'影视评论、细节考据与观察'}</p></div></div><article className="collection-row featured-row"><span className="collection-row-no">01</span><div><p className="collection-row-type">{filmReviews[0].meta}</p><h4>{filmReviews[0].title}</h4><p className="collection-row-desc">{lang==='en'?'A close reading of the details hidden inside a film told almost entirely through computer screens, websites and digital traces.':'从电脑屏幕、网站和数字痕迹中寻找《网络谜踪》里那些容易被忽略的细节。'}</p><div className="collection-row-recognition">{filmReviews[0].recognition}</div></div><a href={filmReviews[0].href} target="_blank" rel="noreferrer">{lang==='en'?'READ':'查看'} ↗</a></article><div className="collection-archive-list">{filmReviews.slice(1).map((x,i)=><a className="collection-row compact-row" href={x.href} target="_blank" rel="noreferrer" key={x.href}><span className="collection-row-no">{String(i+2).padStart(2,'0')}</span><div><p className="collection-row-type">{x.meta}</p><h4>{x.title}</h4></div><span>↗</span></a>)}</div></section>
    <section className="collection-section"><div className="collection-section-head"><span>02</span><div><h3>{lang==='en'?'ANSWERS':'知乎回答'}</h3><p>{lang==='en'?'Selected public knowledge writing':'精选知乎回答与知识型写作'}</p></div></div><div className="answer-stats"><div><strong>20K+</strong><span>{lang==='en'?'FOLLOWERS':'关注者'}</span></div><div><strong>11</strong><span>{lang==='en'?'SELECTED WORKS':'入选作品'}</span></div><div><strong>2018</strong><span>{lang==='en'?'ZH DAILY / 300 QUESTIONS':'知乎日报 / 300问'}</span></div></div><article className="collection-row featured-row answer-row"><span className="collection-row-no">01</span><div><p className="collection-row-type">Zhihu · Answer</p><h4>{answers[0].title}</h4><p className="collection-row-desc">{lang==='en'?'A seemingly absurd question used to explain the practical logic behind turf selection, planting and urban landscape use.':'从一个看似荒诞的问题出发，解释草坪植物选择背后的耐践踏性、养护与景观使用逻辑。'}</p><div className="collection-row-recognition">{answers[0].recognition}</div></div><a href={answers[0].href} target="_blank" rel="noreferrer">{lang==='en'?'READ':'查看'} ↗</a></article><div className="collection-archive-list">{answers.slice(1).map((x,i)=><a className="collection-row compact-row" href={x.href} target="_blank" rel="noreferrer" key={x.href}><span className="collection-row-no">{String(i+2).padStart(2,'0')}</span><div><p className="collection-row-type">Zhihu · Answer</p><h4>{x.title}</h4></div><span>↗</span></a>)}</div><div className="collection-archive-note">{lang==='en'?'11 answers have been selected for Zhihu editorial features, roundtables, Zhihu Weekly and Zhihu Daily.':'共有11个回答进入知乎编辑精选、知乎圆桌、知乎周刊和知乎日报等栏目。'}</div></section>
    <section className="collection-footer-note"><span>ARCHIVE</span><p>{lang==='en'?'More selected works will be added as the archive grows.':'更多文章与作品将随着资料整理逐步加入。'}</p></section>
  </main>
}
export default Collection
