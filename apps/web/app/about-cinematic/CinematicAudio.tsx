  'use client';

  import React, { useEffect, useRef, useState, useCallback } from 'react';

  // ─────────────────────────────────────────────────────────────────────────────
  // Audio Controller
  //
  // Background: looping HTML <audio> element with the Persian Ney ambient track.
  //   - Royalty-free via Internet Archive / Middle Eastern Meditation Music collection
  //   - Loaded lazily on first user interaction (browser policy)
  //
  // SFX: Web Audio API resin-drop chime played when liquid drops hit the pool.
  // ─────────────────────────────────────────────────────────────────────────────

  class AtelierAudioController {
    private audio: HTMLAudioElement | null = null;
    private sfxCtx: AudioContext | null = null;
    private isRunning = false;

    private ensureAudio() {
      if (this.audio) return;
      this.audio = new Audio('/cinematic/oud-ambience.mp3');
      this.audio.loop = true;
      this.audio.volume = 0;
      this.audio.preload = 'none';
    }

    private ensureSfxCtx() {
      if (this.sfxCtx) return;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.sfxCtx = new AudioCtx();
    }

    async start() {
      this.ensureAudio();
      this.ensureSfxCtx();

      if (this.sfxCtx && this.sfxCtx.state === 'suspended') {
        await this.sfxCtx.resume();
      }

      if (this.audio) {
        try {
          await this.audio.play();
          // Fade-in volume over 2 s
          this.audio.volume = 0;
          const fadeIn = setInterval(() => {
            if (!this.audio) return clearInterval(fadeIn);
            if (this.audio.volume < 0.42) {
              this.audio.volume = Math.min(this.audio.volume + 0.02, 0.42);
            } else {
              clearInterval(fadeIn);
            }
          }, 100);
          this.isRunning = true;
        } catch {
          // Autoplay blocked — browser will surface the error; user must interact
        }
      }
    }

    stop() {
      if (!this.audio) return;
      // Fade-out then pause
      const fadeOut = setInterval(() => {
        if (!this.audio) return clearInterval(fadeOut);
        if (this.audio.volume > 0.03) {
          this.audio.volume = Math.max(this.audio.volume - 0.03, 0);
        } else {
          this.audio.volume = 0;
          this.audio.pause();
          clearInterval(fadeOut);
        }
      }, 60);
      this.isRunning = false;
    }

    // Interactive drop chime — a warm pitched pluck via Web Audio API
    playResinDrop() {
      if (!this.sfxCtx || !this.isRunning) return;
      const ctx = this.sfxCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const reverb = ctx.createConvolver();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.3);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.55);
    }

    get playing() {
      return this.isRunning;
    }
  }

  // Singleton
  let controllerInstance: AtelierAudioController | null = null;
  function getController(): AtelierAudioController {
    if (!controllerInstance) {
      controllerInstance = new AtelierAudioController();
    }
    return controllerInstance;
  }

  // ─── Hook ─────────────────────────────────────────────────────────────────────

  export function useCinematicAudio() {
    const [isPlaying, setIsPlaying] = useState(false);

    const toggleSound = useCallback(async () => {
      const ctrl = getController();
      if (isPlaying) {
        ctrl.stop();
        setIsPlaying(false);
      } else {
        await ctrl.start();
        setIsPlaying(true);
      }
    }, [isPlaying]);

    const playDrop = useCallback(() => {
      getController().playResinDrop();
    }, []);

    // setHeat kept for API compatibility but no-op now
    const setHeat = useCallback((_factor: number) => { }, []);

    return { isPlaying, toggleSound, playDrop, setHeat };
  }

  // ─── HUD Component ────────────────────────────────────────────────────────────

  export default function CinematicAudioHUD() {
    const { isPlaying, toggleSound } = useCinematicAudio();
    const [hasDismissedPrompt, setHasDismissedPrompt] = useState(false);

    return (
      <>
        {/* Floating Audio Controller — bottom-right, above the nav arrows */}
        <div className="fixed bottom-[4.5rem] sm:bottom-[5.5rem] right-3 sm:right-6 z-50 flex flex-col items-end gap-2">
          {/* Pulse prompt to invite user to turn on sound */}
          {!isPlaying && !hasDismissedPrompt && (
            <div
              onClick={toggleSound}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && toggleSound()}
              className="cursor-pointer hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#14120e]/90 border border-[#ffb91d]/35 backdrop-blur-md shadow-2xl text-[10px] font-mono uppercase tracking-[0.2em] text-[#ffb91d] animate-pulse hover:bg-[#ffb91d] hover:text-black transition-all"
            >
              <span>🎧 Play the music</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setHasDismissedPrompt(true);
                }}
                className="ml-1 opacity-50 hover:opacity-100 text-xs leading-none cursor-pointer"
                title="Dismiss"
              >
                ×
              </button>
            </div>
          )}

          {/* Main toggle button */}
          <button
            onClick={toggleSound}
            aria-label={isPlaying ? 'Mute ambient music' : 'Play Persian Ney ambient music'}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-2xl ${isPlaying
              ? 'bg-[#18150f]/95 border-[#ffb91d] text-[#ffb91d] shadow-[0_0_25px_rgba(255,185,29,0.25)]'
              : 'bg-[#101010]/80 border-white/20 text-white/70 hover:border-[#ffb91d]/60 hover:text-white'
              }`}
          >
            {/* Animated waveform bars */}
            <div className="flex items-end gap-0.5 h-3.5 w-4" aria-hidden="true">
              <span
                className={`w-0.5 rounded-full bg-current transition-all ${isPlaying ? 'h-3.5 animate-[pulse_0.65s_infinite_ease-in-out]' : 'h-1.5 opacity-40'
                  }`}
              />
              <span
                className={`w-0.5 rounded-full bg-current transition-all ${isPlaying ? 'h-2 animate-[pulse_1.05s_infinite_ease-in-out]' : 'h-2.5 opacity-40'
                  }`}
              />
              <span
                className={`w-0.5 rounded-full bg-current transition-all ${isPlaying ? 'h-3 animate-[pulse_0.85s_infinite_ease-in-out]' : 'h-1 opacity-40'
                  }`}
              />
              <span
                className={`w-0.5 rounded-full bg-current transition-all ${isPlaying ? 'h-2.5 animate-[pulse_1.2s_infinite_ease-in-out]' : 'h-2 opacity-40'
                  }`}
              />
            </div>

            <span className="text-[10px] font-mono uppercase tracking-[0.25em]">
              {isPlaying ? 'Sound: On ▌▌' : 'Sound: Off'}
            </span>
          </button>
        </div>
      </>
    );
  }
