import React from 'react'

type Lang = 'en' | 'zh'

type CollectionItem = {
  no:string
  typeEn:string
  typeZh:string
  title:string
  metaEn:string
  metaZh:string
  descEn:string
  descZh:string
  recognitionEn?:string
  recognitionZh?:string
  href?:string
  actionEn:string
  actionZh:string
  featured?:boolean
}

const readkuUrl='https://detail.youzan.com/show/goods?alias=36dvoghfymyoay8&from_source=gbox_seo'
const zhihuUrl='https://www.zhihu.com/special/19583378'

const items:CollectionItem[]=[
  {
    no:'01',typeEn:'ESSAY',typeZh:'文章',title:'虚拟世界侵入现实',
    metaEn:'读库 2401 · 2024',metaZh:'《读库2401》· 2024',
    descEn:'An exploration of how ARG turns the boundary between a virtual world and everyday reality into part of the story itself.',
    descZh:'一篇关于 ARG 的文章：虚拟世界如何越过屏幕，进入现实，并让现实本身成为故事的一部分。',
    recognitionEn:'Published in 读库 2401 · pp. 261–283',recognitionZh:'发表于《读库2401》· P261–283',
    href:readkuUrl,actionEn:'VIEW PUBLICATION',actionZh:'查看出版物',featured:true,
  },
  {
    no:'02',typeEn:'FILM & TELEVISION',typeZh:'影视评论',title:'《网络谜踪》中蕴含的魔鬼细节',
    metaEn:'Douban · Film Review',metaZh:'豆瓣 · 影视评论',
    descEn:'A close reading of the details hidden inside a film told almost entirely through computer screens, websites and digital traces.',
    descZh:'从电脑屏幕、网站和数字痕迹中寻找《网络谜踪》里那些容易被忽略的细节。',
    recognitionEn:'700K+ views · Featured review',recognitionZh:'70万+ 阅读 · 代表性影评',
    actionEn:'READ ON DOUBAN',actionZh:'在豆瓣查看',
  },
  {
    no:'03',typeEn:'ANSWER',typeZh:'知乎回答',title:'绿化草坪为什么不用韭菜',
    metaEn:'Zhihu · Answer',metaZh:'知乎 · 回答',
    descEn:'A seemingly absurd question used to explain the practical logic behind turf selection, planting and urban landscape use.',
    descZh:'从一个看似荒诞的问题出发，解释草坪植物选择背后的耐践踏性、养护与景观使用逻辑。',
    recognitionEn:'Zhihu Daily · 2018 Annual 300 Questions · 新知：人类七分熟',recognitionZh:'知乎日报 · 2018年度300问 · 《新知：人类七分熟》',
    href:zhihuUrl,actionEn:'READ ON ZHIHU',actionZh:'在知乎查看',featured:true,
  },
]

function CollectionPageTitle({no,lang,en,zh,descEn,descZh}:{no:string;lang:Lang;en:string;zh:string;descEn:string;descZh:string}){
  return <section className="page-title"><span className="page-no">{no}</span><div><h1>{lang==='en'?en:zh}</h1><p>{lang==='en'?descEn:descZh}</p></div></section>
}

function Collection({lang}:{lang:Lang}){
  return <main className="page collection-page">
    <CollectionPageTitle no="03" lang={lang} en="OneStage Collection" zh="壹阶集录" descEn="Selected writings, observations and answers" descZh="文章 / 影视观察 / 知识型写作"/>

    <section className="collection-intro">
      <div><p className="eyebrow">SELECTED WRITINGS</p><h2>{lang==='en'?'Words are another kind of space.':'文字，是另一种空间。'}</h2></div>
      <p>{lang==='en'?'A record of writing across print, film criticism and public knowledge platforms. Different places, one archive.':'收录散落于纸媒、影视评论与公共知识平台上的文字作品。来源不同，但以同一种作品档案的方式保存。'}</p>
    </section>

    <section className="collection-feature">
      <div className="collection-feature-index"><span>FEATURED</span><span>01 / 03</span></div>
      <div className="collection-feature-body">
        <div className="collection-feature-copy">
          <p className="collection-type">{lang==='en'?'ESSAY · PRINT':'文章 · 纸媒'}</p><h2>虚拟世界侵入现实</h2>
          <p>{lang==='en'?items[0].descEn:items[0].descZh}</p>
          <div className="collection-recognition">{lang==='en'?items[0].recognitionEn:items[0].recognitionZh}</div>
          <a href={readkuUrl} target="_blank" rel="noreferrer" className="collection-action">{lang==='en'?'VIEW PUBLICATION':'查看《读库2401》'} <span>↗</span></a>
        </div>
        <div className="publication-card"><span className="publication-kicker">读库</span><strong>2401</strong><span className="publication-caption">P261—283<br/>虚拟世界侵入现实</span></div>
      </div>
    </section>

    <section className="collection-section">
      <div className="collection-section-head"><span>01</span><div><h3>{lang==='en'?'ESSAYS':'文章'}</h3><p>{lang==='en'?'Published writing & non-fiction':'正式发表的文章与非虚构写作'}</p></div></div>
      <article className="collection-row featured-row"><span className="collection-row-no">01</span><div><p className="collection-row-type">{lang==='en'?items[0].metaEn:items[0].metaZh}</p><h4>{items[0].title}</h4><p className="collection-row-desc">{lang==='en'?items[0].descEn:items[0].descZh}</p></div><a href={readkuUrl} target="_blank" rel="noreferrer">{lang==='en'?'VIEW':'查看'} ↗</a></article>
    </section>

    <section className="collection-section">
      <div className="collection-section-head"><span>02</span><div><h3>{lang==='en'?'FILM & TELEVISION':'影视评论'}</h3><p>{lang==='en'?'Reviews, details & observations':'影视评论、细节考据与观察'}</p></div></div>
      <article className="collection-row featured-row"><span className="collection-row-no">01</span><div><p className="collection-row-type">{lang==='en'?items[1].metaEn:items[1].metaZh}</p><h4>{items[1].title}</h4><p className="collection-row-desc">{lang==='en'?items[1].descEn:items[1].descZh}</p><div className="collection-row-recognition">{lang==='en'?items[1].recognitionEn:items[1].recognitionZh}</div></div><span className="collection-row-muted">{lang==='en'?'LINK TO BE ADDED':'待补充直链'}</span></article>
      <div className="collection-archive-note">{lang==='en'?'Other film and television reviews are scattered across Douban and WeChat and will be added here as a unified archive.':'其他影视剧评分与评论散见于豆瓣及公众号，后续将以统一档案形式陆续整理。'}</div>
    </section>

    <section className="collection-section">
      <div className="collection-section-head"><span>03</span><div><h3>{lang==='en'?'ANSWERS':'知乎回答'}</h3><p>{lang==='en'?'Selected public knowledge writing':'精选知乎回答与知识型写作'}</p></div></div>
      <div className="answer-stats"><div><strong>20K+</strong><span>{lang==='en'?'FOLLOWERS':'关注者'}</span></div><div><strong>11</strong><span>{lang==='en'?'SELECTED WORKS':'入选作品'}</span></div><div><strong>2018</strong><span>{lang==='en'?'ZH DAILY / 300 QUESTIONS':'知乎日报 / 300问'}</span></div></div>
      <article className="collection-row featured-row answer-row"><span className="collection-row-no">01</span><div><p className="collection-row-type">{lang==='en'?items[2].metaEn:items[2].metaZh}</p><h4>{items[2].title}</h4><p className="collection-row-desc">{lang==='en'?items[2].descEn:items[2].descZh}</p><div className="collection-row-recognition">{lang==='en'?items[2].recognitionEn:items[2].recognitionZh}</div></div><a href={zhihuUrl} target="_blank" rel="noreferrer">{lang==='en'?'READ':'查看'} ↗</a></article>
      <div className="collection-archive-note">{lang==='en'?'11 answers have been selected for Zhihu editorial features, roundtables, Zhihu Weekly and Zhihu Daily.':'共有11个回答进入知乎编辑精选、知乎圆桌、知乎周刊和知乎日报等栏目。'}</div>
    </section>

    <section className="collection-footer-note"><span>ARCHIVE</span><p>{lang==='en'?'More selected works will be added as the archive grows.':'更多文章与作品将随着资料整理逐步加入。'}</p></section>
  </main>
}

export default Collection
