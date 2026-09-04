import React, { useEffect, useMemo, useRef, useState } from 'react'

type Episode = {
  title: string
  audioUrl: string
  pubDate?: string
  duration?: string
}

type Lang = 'en' | 'zh'

function PlayIcon({ playing }: { playing: boolean }) {
  return <span className={playing ? 'episode-play-icon pause' : 'episode-play-icon'} aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
}

export default function EpisodeList({ lang }: { lang: Lang }) {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [visible, setVisible] = useState(5)
  const [current, setCurrent] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`${import.meta.env.BASE_URL}episodes.json`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then(data => {
        if (!cancelled) setEpisodes(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!cancelled) setEpisodes([])
      })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => { setPlaying(false); setProgress(0) }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  const currentEpisode = current === null ? episodes[0] : episodes[current]
  const hasMore = visible < episodes.length
  const shownEpisodes = useMemo(() => episodes.slice(0, visible), [episodes, visible])

  const toggleEpisode = async (index: number) => {
    const episode = episodes[index]
    const audio = audioRef.current
    if (!episode || !audio) return
    if (current === index) {
      if (audio.paused) await audio.play()
      else audio.pause()
      return
    }
    audio.pause()
    audio.src = episode.audioUrl
    audio.currentTime = 0
    setCurrent(index)
    setProgress(0)
    try {
      await audio.play()
    } catch {
      setPlaying(false)
    }
  }

  const label = lang === 'en'
    ? { latest: 'LATEST EPISODE', all: 'ALL EPISODES', more: 'SHOW MORE EPISODES', empty: 'Audio episodes are loading.' }
    : { latest: '最新一期', all: '全部节目', more: '查看更多节目', empty: '音频节目正在加载。' }

  return <section className="episode-browser">
    <audio ref={audioRef} preload="none" />
    <div className="section-label"><span>{label.all}</span><span>RSS</span></div>
    {currentEpisode ? <div className="episode-feature">
      <div className="episode-feature-top"><span className="episode-feature-kicker">{label.latest}</span><span className="episode-feature-number">{String(current === null ? 0 : current + 1).padStart(3, '0')}</span></div>
      <button className="episode-feature-main" onClick={() => toggleEpisode(current === null ? 0 : current)} aria-label={playing ? 'Pause episode' : 'Play episode'}>
        <span className="episode-feature-play"><PlayIcon playing={playing} /></span>
        <span className="episode-feature-copy"><strong>{currentEpisode.title}</strong><span>{playing ? 'PLAYING' : 'READY TO PLAY'}{currentEpisode.duration ? ` · ${currentEpisode.duration}` : ''}</span></span>
      </button>
      <div className="episode-progress"><span style={{ width: `${progress * 100}%` }} /></div>
    </div> : <div className="episode-empty">{label.empty}</div>}
    <div className="episode-list">
      {shownEpisodes.map((episode, index) => <button className={`episode-row ${current === index && playing ? 'playing' : ''}`} key={`${episode.title}-${index}`} onClick={() => toggleEpisode(index)}>
        <span className="episode-row-play"><PlayIcon playing={current === index && playing} /></span>
        <span className="episode-row-title">{episode.title}</span>
        <span className="episode-row-meta">{episode.duration || ''}</span>
      </button>)}
    </div>
    {hasMore && <button className="episode-more" onClick={() => setVisible(v => Math.min(v + 5, episodes.length))}>{label.more}</button>}
  </section>
}
