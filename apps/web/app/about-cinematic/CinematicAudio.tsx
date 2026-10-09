'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// Web Audio API ambient desert soundscape & tactile SFX engine
class DesertAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning = false;
  private masterGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // 1. Desert Wind Generator (Soft pink/brown noise via buffer)
    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown/Pink filter
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to simulate soft wind blowing over dunes
    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
    windFilter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    whiteNoise.connect(windFilter);
    windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);
    whiteNoise.start();
    this.noiseNode = whiteNoise;

    // 2. Meditative 432Hz Amber Drone Pad
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

    const droneFilter = this.ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(260, this.ctx.currentTime);

    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(108, this.ctx.currentTime); // 432Hz subharmonic

    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(216, this.ctx.currentTime); // warm harmonic

    this.droneOsc1.connect(droneFilter);
    this.droneOsc2.connect(droneFilter);
    droneFilter.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    this.droneOsc1.start();
    this.droneOsc2.start();
  }

  start() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 1.8);
      this.isRunning = true;
    }
  }

  stop() {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      this.isRunning = false;
    }
  }

  // Interactive drop chime (sound of molten resin droplet)
  playResinDrop() {
    if (!this.ctx || !this.isRunning) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Frequency drop sweep
    osc.frequency.setValueAtTime(740, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.28);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain || this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // Interactive temperature hum modulation
  setHeatFactor(factor: number) {
    if (!this.ctx || !this.droneGain) return;
    // factor from 0.0 (20°C) to 1.0 (48°C)
    const targetFreq = 180 + factor * 240;
    const now = this.ctx.currentTime;
    if (this.droneOsc1) {
      this.droneOsc1.frequency.linearRampToValueAtTime(108 + factor * 28, now + 0.4);
    }
    if (this.droneGain) {
      this.droneGain.gain.linearRampToValueAtTime(0.04 + factor * 0.05, now + 0.4);
    }
  }
}

let engineInstance: DesertAudioEngine | null = null;

function getAudioEngine(): DesertAudioEngine {
  if (!engineInstance) {
    engineInstance = new DesertAudioEngine();
  }
  return engineInstance;
}

export function useCinematicAudio() {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSound = useCallback(() => {
    const engine = getAudioEngine();
    if (isPlaying) {
      engine.stop();
      setIsPlaying(false);
    } else {
      engine.start();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const playDrop = useCallback(() => {
    getAudioEngine().playResinDrop();
  }, []);

  const setHeat = useCallback((factor: number) => {
    getAudioEngine().setHeatFactor(factor);
  }, []);

  return { isPlaying, toggleSound, playDrop, setHeat };
}

export default function CinematicAudioHUD() {
  const { isPlaying, toggleSound } = useCinematicAudio();
  const [hasDismissedPrompt, setHasDismissedPrompt] = useState(false);

  return (
    <>
      {/* Floating Audio Controller */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isPlaying && !hasDismissedPrompt && (
          <div
            onClick={toggleSound}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && toggleSound()}
            className="cursor-pointer hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#14120e]/90 border border-[#ffb91d]/35 backdrop-blur-md shadow-2xl text-[10px] font-mono uppercase tracking-[0.2em] text-[#ffb91d] animate-pulse hover:bg-[#ffb91d] hover:text-black transition-all"
          >
            <span>🎧 Turn Sound On</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setHasDismissedPrompt(true);
              }}
              className="ml-1 opacity-50 hover:opacity-100 text-xs leading-none"
              title="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        <button
          onClick={toggleSound}
          aria-label={isPlaying ? 'Mute atmospheric sound' : 'Enable atmospheric sound'}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-2xl ${
            isPlaying
              ? 'bg-[#18150f]/95 border-[#ffb91d] text-[#ffb91d] shadow-[0_0_25px_rgba(255,185,29,0.25)]'
              : 'bg-[#101010]/80 border-white/20 text-white/70 hover:border-[#ffb91d]/60 hover:text-white'
          }`}
        >
          {/* Animated Audio Bars */}
          <div className="flex items-end gap-0.5 h-3.5 w-3.5" aria-hidden="true">
            <span
              className={`w-0.5 rounded-full bg-current transition-all ${
                isPlaying ? 'h-3.5 animate-[pulse_0.7s_infinite_ease-in-out]' : 'h-1.5 opacity-40'
              }`}
            />
            <span
              className={`w-0.5 rounded-full bg-current transition-all ${
                isPlaying ? 'h-2 animate-[pulse_1.1s_infinite_ease-in-out]' : 'h-2.5 opacity-40'
              }`}
            />
            <span
              className={`w-0.5 rounded-full bg-current transition-all ${
                isPlaying ? 'h-3 animate-[pulse_0.9s_infinite_ease-in-out]' : 'h-1 opacity-40'
              }`}
            />
          </div>

          <span className="text-[10px] font-mono uppercase tracking-[0.25em]">
            {isPlaying ? 'Audio: Dune Wind' : 'Sound: Off'}
          </span>
        </button>
      </div>
    </>
  );
}
