/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Clock,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface SpiceMixQuickRecipeVideoProps {
  onOpenRecipeGuide?: () => void;
}

function formatClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const SpiceMixQuickRecipeVideo: React.FC<SpiceMixQuickRecipeVideoProps> = ({
  onOpenRecipeGuide,
}) => {
  const { quickRecipeVideo, videoOptimization } = useShop();
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isInViewport, setIsInViewport] = useState(
    !videoOptimization.lazyLoadOnStorefront
  );
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);

  // Lazy-activate video source only when section nears viewport for ultra-fast initial load
  useEffect(() => {
    if (!videoOptimization.lazyLoadOnStorefront) {
      setIsInViewport(true);
      return;
    }
    const el = sectionRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      setIsInViewport(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setIsInViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '250px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [videoOptimization.lazyLoadOnStorefront]);

  if (!quickRecipeVideo.enabled) return null;

  const chapters = quickRecipeVideo.chapters || [];
  const activeChapterIdx = chapters.reduce((acc, ch, idx) => {
    if (currentTime >= ch.timeSec - 0.15) return idx;
    return acc;
  }, 0);
  const activeChapter = chapters[activeChapterIdx] || chapters[0];

  const progressPct =
    duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (!isInViewport) setIsInViewport(true);
    if (vid.paused || vid.ended) {
      if (vid.ended) vid.currentTime = 0;
      setHasStarted(true);
      void vid.play().then(
        () => setIsPlaying(true),
        () => {
          vid.muted = true;
          setIsMuted(true);
          void vid.play().then(() => setIsPlaying(true));
        }
      );
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const seekToTime = (sec: number, autoPlay = true) => {
    const vid = videoRef.current;
    if (!vid) return;
    if (!isInViewport) setIsInViewport(true);
    setHasStarted(true);
    const clamped = Math.max(0, Math.min(duration || 30, sec));
    vid.currentTime = clamped;
    setCurrentTime(clamped);
    if (autoPlay) {
      void vid.play().then(
        () => setIsPlaying(true),
        () => {
          vid.muted = true;
          setIsMuted(true);
          void vid.play().then(() => setIsPlaying(true));
        }
      );
    }
  };

  const handleScrubClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekToTime(ratio * (duration || 30), isPlaying || hasStarted);
  };

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
  };

  const handleFullscreen = () => {
    const target = containerRef.current || videoRef.current;
    if (!target) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else if (target.requestFullscreen) {
      void target.requestFullscreen();
    }
  };

  return (
    <section
      ref={sectionRef}
      id="quick-recipe-video"
      aria-label="Quick Recipe Video Demonstration"
      className="py-24 sm:py-32 lg:py-36 bg-[#FAF9F4] text-[#40563D] scroll-mt-20 bajoz-seamless-section"
    >
      <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-14 xl:px-16 space-y-12 sm:space-y-16">
        {/* Centered Editorial Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <p className="bajoz-subheadline text-xs sm:text-sm uppercase tracking-[0.14em] text-[#5A4E38]">
            {quickRecipeVideo.kicker}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#40563D] leading-tight text-balance">
            {quickRecipeVideo.title}
          </h2>
          <p className="text-sm sm:text-base text-[#5A4E38] leading-relaxed max-w-2xl mx-auto">
            {quickRecipeVideo.subtitle}
          </p>
        </div>

        {/* Video Theater + Interactive 4-Step Chapter Rail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left 7 Cols: Embedded 16:9 HTML5 Video Player with Custom Poster */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            <div
              ref={containerRef}
              className="relative rounded-[1.75rem] overflow-hidden border-2 border-[#5A4E38] bg-[#243122] shadow-[0_24px_60px_-24px_rgba(64,86,61,0.38)] aspect-video group"
            >
              <video
                ref={videoRef}
                key={quickRecipeVideo.videoUrl}
                src={isInViewport ? quickRecipeVideo.videoUrl : undefined}
                poster={quickRecipeVideo.posterUrl}
                playsInline
                preload={videoOptimization.lazyLoadOnStorefront ? 'metadata' : 'auto'}
                muted={isMuted}
                onLoadedMetadata={(e) => {
                  const d = e.currentTarget.duration;
                  if (Number.isFinite(d) && d > 0) setDuration(d);
                }}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onPlay={() => {
                  setHasStarted(true);
                  setIsPlaying(true);
                }}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
              />

              {/* Top-Right Duration Indicator (kept clear of top-left in-video step banner) */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#243122]/85 text-[#F2EBD0] border border-[#E9F390]/40 font-dm text-[11px] font-bold tracking-wider backdrop-blur-xs pointer-events-none tabular-nums">
                <Clock className="w-3.5 h-3.5 text-[#E9F390]" />
                <span>{quickRecipeVideo.durationLabel || '0:30'}</span>
              </div>

              {/* Poster Play Overlay (Smooth Fade Out Upon Play) */}
              <div
                className={`absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-t from-[#1E291C]/80 via-[#1E291C]/30 to-transparent transition-all duration-500 ${
                  isPlaying
                    ? 'opacity-0 pointer-events-none scale-102'
                    : 'opacity-100 pointer-events-auto scale-100'
                }`}
              >
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={
                    hasStarted
                      ? 'Resume SpiceMix 4-step cooking video'
                      : 'Play SpiceMix 4-step cooking video'
                  }
                  className="group/play flex flex-col items-center gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#E9F390] rounded-2xl p-2"
                >
                  <span className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#E9F390] group-hover/play:bg-[#F2EBD0] text-[#5A4E38] border-2 border-[#5A4E38] shadow-[4px_4px_0px_#5A4E38] group-hover/play:shadow-[2px_2px_0px_#5A4E38] group-hover/play:scale-105 flex items-center justify-center transition-all duration-300">
                    <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-current ml-1" />
                  </span>
                  <span className="px-5 py-2.5 rounded-full bg-[#FAF9F4]/95 text-[#40563D] border border-[#5A4E38] font-dm text-xs sm:text-sm font-bold tracking-wide shadow-sm backdrop-blur-xs">
                    {hasStarted ? 'Resume Cooking Video' : 'Watch 4-Step Cooking Video'}
                  </span>
                </button>
              </div>

              {/* Live Synchronized Step Caption + Sleek Bottom Control Bar */}
              <div
                className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#1A2418]/95 via-[#1A2418]/78 to-transparent pt-12 pb-3.5 px-4 sm:px-6 space-y-2.5 transition-opacity duration-300 ${
                  hasStarted
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                {activeChapter && (
                  <div className="space-y-0.5 min-w-0">
                    <span className="inline-block font-dm text-[11px] font-bold tracking-[0.06em] text-[#E9F390]">
                      {activeChapter.title.replace(/^\d+\.\s*/, '')}
                    </span>
                    <p className="text-xs sm:text-sm text-[#F2EBD0] leading-snug line-clamp-2">
                      {activeChapter.caption}
                    </p>
                  </div>
                )}

                {/* Interactive Seekable Progress Scrubber with 4-Step Tick Marks */}
                <div
                  role="slider"
                  aria-label="Video playback progress"
                  aria-valuemin={0}
                  aria-valuemax={Math.round(duration)}
                  aria-valuenow={Math.round(currentTime)}
                  tabIndex={0}
                  onClick={handleScrubClick}
                  className="relative h-2 w-full rounded-full bg-[#F2EBD0]/25 cursor-pointer group/bar overflow-hidden"
                >
                  <div
                    className="h-full rounded-full bg-[#E9F390] transition-all duration-150"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {/* Transport Controls */}
                <div className="flex items-center justify-between gap-3 text-[#F2EBD0]">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause video' : 'Play video'}
                      className="w-9 h-9 rounded-full bg-[#E9F390] hover:bg-[#F2EBD0] text-[#5A4E38] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => seekToTime(0, true)}
                      aria-label="Replay from start"
                      className="w-9 h-9 rounded-full bg-[#F2EBD0]/15 hover:bg-[#F2EBD0]/25 text-[#F2EBD0] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-[11px] sm:text-xs font-semibold tabular-nums text-[#F2EBD0]/90">
                      {formatClock(currentTime)} / {formatClock(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                      className="w-9 h-9 rounded-full bg-[#F2EBD0]/15 hover:bg-[#F2EBD0]/25 text-[#F2EBD0] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleFullscreen}
                      aria-label="Toggle fullscreen"
                      className="w-9 h-9 rounded-full bg-[#F2EBD0]/15 hover:bg-[#F2EBD0]/25 text-[#F2EBD0] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5/4 Cols: Clickable 4-Step Cooking Guide Timeline */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between gap-5">
            <div className="rounded-[1.75rem] bg-[#F2EBD0] border-2 border-[#5A4E38] p-6 sm:p-7 space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <p className="bajoz-subheadline text-[11px] uppercase tracking-[0.14em] text-[#5A4E38]">
                  4 Simple Steps · Tap Any Step to Jump
                </p>
                <h3 className="text-xl sm:text-2xl text-[#40563D] leading-snug">
                  Meat &amp; Vegetable Method
                </h3>
              </div>

              <div className="space-y-3">
                {chapters.map((chapter, idx) => {
                  const isActive = hasStarted && activeChapterIdx === idx;
                  return (
                    <button
                      key={`${chapter.timeLabel}-${idx}`}
                      type="button"
                      onClick={() => seekToTime(chapter.timeSec, true)}
                      className={`w-full text-left p-4 rounded-2xl border-[1.5px] transition-all duration-300 cursor-pointer flex items-start gap-3.5 ${
                        isActive
                          ? 'bg-[#40563D] text-[#F2EBD0] border-[#40563D] shadow-sm'
                          : 'bg-[#FAF9F4] hover:bg-[#E9F390]/45 text-[#40563D] border-[#5A4E38]'
                      }`}
                    >
                      <span
                        className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold tabular-nums shrink-0 ${
                          isActive
                            ? 'bg-[#E9F390] text-[#5A4E38]'
                            : 'bg-[#DCE7C9] text-[#40563D]'
                        }`}
                      >
                        {chapter.timeLabel}
                      </span>
                      <div className="min-w-0 space-y-1">
                        <p
                          className={`font-dm text-xs sm:text-sm font-bold leading-snug flex items-start gap-2 ${
                            isActive ? 'text-[#E9F390]' : 'text-[#40563D]'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isActive
                                ? 'bg-[#E9F390] text-[#5A4E38]'
                                : 'bg-[#DCE7C9] text-[#40563D]'
                            }`}
                          >
                            <Check className="w-2.5 h-2.5 stroke-[2.75]" />
                          </span>
                          <span>{chapter.title.replace(/^\d+\.\s*/, '')}</span>
                        </p>
                        <p
                          className={`text-xs leading-relaxed ${
                            isActive ? 'text-[#F2EBD0]/90' : 'text-[#5A4E38]'
                          }`}
                        >
                          {chapter.caption}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {onOpenRecipeGuide && (
                <button
                  type="button"
                  onClick={onOpenRecipeGuide}
                  className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#E9F390] hover:bg-[#5A4E38] text-[#5A4E38] hover:text-[#F2EBD0] border border-[#5A4E38] shadow-[2px_2px_0px_#5A4E38] hover:shadow-none font-dm text-xs font-bold uppercase tracking-[0.08em] inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                >
                  <span>Explore Full Recipe Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
