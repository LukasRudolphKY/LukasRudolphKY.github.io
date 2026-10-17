/* Forge10 interface sound design — synthesized locally; no audio downloads or tracking. */
(function () {
  'use strict';
  var KEY = 'forge10-sound-enabled-v1';
  var enabled = true;
  try { enabled = localStorage.getItem(KEY) !== 'false'; } catch (_) {}
  var context = null;
  var lastPlay = 0;
  var toggle = null;
  function audio() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!context) context = new AC();
    if (context.state === 'suspended') context.resume().catch(function () {});
    return context;
  }
  function tone(ctx, when, frequency, fall, duration, volume, wave) {
    var oscillator = ctx.createOscillator();
    var amp = ctx.createGain();
    oscillator.type = wave || 'sine';
    oscillator.frequency.setValueAtTime(frequency, when);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(35, frequency * fall), when + duration);
    amp.gain.setValueAtTime(0.0001, when);
    amp.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), when + 0.008);
    amp.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    oscillator.connect(amp); amp.connect(ctx.destination);
    oscillator.start(when); oscillator.stop(when + duration + 0.015);
  }
  function metal(ctx, when, duration, cutoff, peak) {
    // A filtered metal-on-metal transient, decaying naturally instead of a stock beep.
    var length = Math.ceil(ctx.sampleRate * duration);
    var buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    var samples = buffer.getChannelData(0);
    for (var i = 0; i < length; i++) {
      var time = i / ctx.sampleRate;
      samples[i] = (Math.random() * 2 - 1) * Math.exp(-12 * time / duration);
    }
    var source = ctx.createBufferSource();
    source.buffer = buffer;
    var band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = cutoff;
    band.Q.value = 0.75;
    var amp = ctx.createGain();
    amp.gain.value = peak;
    source.connect(band); band.connect(amp); amp.connect(ctx.destination);
    source.start(when); source.stop(when + duration);
  }
  function play(kind) {
    if (!enabled) return false;
    var now = performance.now();
    if (now - lastPlay < 160) return false;
    lastPlay = now;
    try {
      var ctx = audio();
      if (!ctx) return false;
      var at = ctx.currentTime + 0.018;
      if (kind === 'open') {
        // 1.05 s: crisp ratchet engagement, followed by low gearbox resonance and fade.
        metal(ctx, at, 0.18, 2150, 0.22);
        tone(ctx, at, 255, 0.64, 0.20, 0.055, 'triangle');
        metal(ctx, at + 0.105, 0.24, 1650, 0.15);
        tone(ctx, at + 0.11, 365, 0.79, 0.42, 0.025, 'sine');
        tone(ctx, at + 0.19, 145, 0.58, 0.86, 0.032, 'triangle');
      } else if (kind === 'remove') {
        // Short, positive mechanical disengagement for removing a component.
        metal(ctx, at, 0.17, 1100, 0.15);
        tone(ctx, at, 185, 0.55, 0.52, 0.038, 'triangle');
      } else {
        // 1.0 s: unmistakable descending mechanical release on confirmed reset/delete.
        metal(ctx, at, 0.22, 1530, 0.19);
        tone(ctx, at, 245, 0.62, 0.28, 0.055, 'triangle');
        metal(ctx, at + 0.16, 0.22, 830, 0.15);
        tone(ctx, at + 0.16, 153, 0.54, 0.78, 0.044, 'triangle');
      }
      return true;
    } catch (_) {
      // A browser without audio support must never prevent the tool from working.
      return false;
    }
  }
  function updateToggle() {
    if (!toggle) return;
    toggle.textContent = enabled ? '♪ Sound On' : '♪ Sound Off';
    toggle.setAttribute('aria-label', enabled ? 'Mute interface sounds' : 'Enable interface sounds');
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.title = 'Toggle Forge10 interface sounds';
  }
  function installToggle() {
    var nav = document.querySelector('header nav');
    if (!nav) return;
    toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.id = 'forge10-sound-toggle';
    toggle.style.cssText = 'background:transparent;border:1px solid #49718b;border-radius:8px;color:#b8dcf1;padding:7px 10px;font:600 12px system-ui,sans-serif;cursor:pointer;white-space:nowrap';
    updateToggle();
    toggle.addEventListener('click', function () {
      enabled = !enabled;
      try { localStorage.setItem(KEY, String(enabled)); } catch (_) {}
      updateToggle();
    });
    nav.appendChild(toggle);
  }
  window.Forge10Sound = {play: play, isEnabled: function () { return enabled; }};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', installToggle);
  else installToggle();
  // Opening the tracker is a deliberate click. Let the short sound finish before navigation.
  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target && link.target !== '_self') return;
    var dest;
    try { dest = new URL(link.href, location.href); } catch (_) { return; }
    if (dest.origin !== location.origin || !/\/free-oee-tracker\.html$/.test(dest.pathname)) return;
    if (enabled && play('open')) {
      event.preventDefault();
      window.setTimeout(function () { window.location.assign(dest.href); }, 1110);
    }
  });
  // A first-time user opening the legally gated tool also receives the engagement sound.
  document.addEventListener('submit', function (event) {
    if (event.target && event.target.id === 'legal-consent-form') play('open');
  });
})();
