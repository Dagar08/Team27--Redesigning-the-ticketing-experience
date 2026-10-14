'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Browsers only autoplay muted media; set it explicitly and start playback in
    // case the autoplay attribute was skipped (e.g. after client-side navigation).
    video.muted = true
    video.play().catch(() => setPlaying(false))
  }, [])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/media/race-poster.jpg"
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 size-full object-cover"
      >
        <source src="/media/race-loop.mp4" type="video/mp4" />
      </video>

      {/* WCAG 2.2.2: looping background motion needs a pause control. */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause background video' : 'Play background video'}
        className="bg-asphalt-950/70 absolute top-6 left-6 z-10 inline-flex size-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:top-10 sm:left-10"
      >
        {playing ? (
          <Pause aria-hidden="true" className="size-4" />
        ) : (
          <Play aria-hidden="true" className="size-4" />
        )}
      </button>
    </>
  )
}
