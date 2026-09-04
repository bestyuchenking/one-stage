import React, { useEffect, useMemo, useRef, useState } from 'react'

type Episode = { title: string; audioUrl: string; duration?: string; pubDate?: string }
type Lang = 'en' | 'zh'

function PlayIcon({ playing }: { playing: boolean }) {
  return <span className={playing ? 'episode-play-icon pause' : 'episode-play-icon'} aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
}

export default function EpisodeListV2({ lang }: { lang: Lang }) {
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
      .then(data => { if (!cancelled) setEpisodes(Array.isArray(data) ? data : []) })
      .catch(() => { if (!cancelled) setEpisodes([]) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => { setPlaying(false); setProgress(0) }
    audio.addEventListener('timeupdate', onTime); audio.addEventListener('play', onPlay); audio.addEventListener('pause', onPause); audio.addEventListener('ended', onEnded)
    return () => { audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('play', onPlay); audio.removeEventListener('pause', onPause); audio.removeEventListener('ended', onEnded) }
  }, [])

  const latest = episodes[0]
  const selected = current === null ? latest : episodes[current]
  const shown = useMemo(() => episodes.slice(0, visible), [episodes, visible])
  const hasMore = visible < episodes.length

  const toggleEpisode = async (index: number) => {
    const episode = episodes[index]
    const audio = audioRef.current
    if (!episode || !audio) return
    if (current === index) {
      if (audio.paused) await audio.play(); else audio.pause()
      return
    }
    audio.pause(); audio.src = episode.audioUrl; audio.currentTime = 0
    setCurrent(index); setProgress(0)
    try { await audio.play() } catch { setPlaying(false) }
  }

  const labels = lang === 'en'
    ? { latest:'LATEST EPISODE', now:'NOW PLAYING', list:'EPISODES', more:'SEE MORE EPISODES', ready:'READY', playing:'● PLAYING', click:'CLICK TO PLAY', empty:'Audio episodes are loading.' }
    : { latest:'最新一期', now:'正在播放', list:'节目列表', more:'查看更多节目', ready:'READY', playing:'● 播放中', click:'点击播放', empty:'音频节目正在加载。' }

  return <section className="episode-browser">
    <audio ref={audioRef} preload="none" />
    <div className="section-label"><span>{labels.list}</span><span>RSS</span></div>
    {selected ? <div className="episode-feature">
      <div className="episode-feature-top"><span>{current === null ? labels.latest : labels.now}</span><span className="episode-feature-status">{playing ? labels.playing : labels.ready}</span></div>
      <button className="episode-feature-main" onClick={() => toggleEpisode(current === null ? 0 : current)} aria-label={playing ? 'Pause episode' : 'Play episode'}>
        <span className="episode-feature-play"><PlayIcon playing={playing} /></span>
        <span className="episode-feature-copy"><strong>{selected.title}</strong><span>{selected.duration || 'PODCAST EPISODE'} · {playing ? 'PLAYING' : labels.click}</span></span>
        <span className="episode-feature-arrow">↗</span>
      </button>
      <div className="episode-progress"><span style={{ width:`${progress * 100}%` }} /></div>
    </div> : <div className="episode-empty">{labels.empty}</div>}
    <div className="episode-list">
      {shown.map((episode, index) => <button className={`episode-row ${current === index && playing ? 'playing' : ''}`} key={`${episode.title}-${index}`} onClick={() => toggleEpisode(index)}>
        <span className="episode-row-play"><PlayIcon playing={current === index && playing} /></span>
        <span className="episode-row-title">{episode.title}</span>
        <span className="episode-row-meta">{episode.duration || ''}</span>
      </button>)}
    </div>
    {hasMore && <button className="episode-more" onClick={() => setVisible(v => Math.min(v + 5, episodes.length))}>{labels.more}</button>}
  </section>
}
