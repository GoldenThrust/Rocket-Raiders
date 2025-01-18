import { player } from "../player/currentPlayer.js";

export let audioCtx;

export function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}



const panningModel = "HRTF";
const innerCone = 60;
const outerCone = 90;
const outerGain = 0.1;
const distanceModel = "linear";
const maxDistance = 2000;
const refDistance = 1;
const rollOff = 1;

const positionX = player?.x || window.innerWidth / 2;
const positionY = player?.y || window.innerHeight / 2;
const positionZ = 300;

if (audioCtx) {
  const listener = audioCtx.listener;
  listener.positionX.value = positionX;
  listener.positionY.value = positionY;
  listener.positionZ.value = positionZ - 5;
  listener.forwardX.value = 0;
  listener.forwardY.value = 0;
  listener.forwardZ.value = -1;
  listener.upX.value = 0;
  listener.upY.value = 1;
  listener.upZ.value = 0;
}

export function updateListenerPosition(x, y) {
  if (audioCtx) {
    const listener = audioCtx.listener;
    listener.positionX.value = x || window.innerWidth / 2;
    listener.positionY.value = y || window.innerHeight / 2;
  }
}

export function createSpatialAudio(x, y, angle) {
  initAudioContext();
  if (!audioCtx) {
    console.error('AudioContext is not initialized');
    return null;
  }

  const panner = new PannerNode(audioCtx, {
    panningModel,
    distanceModel,
    positionX: x,
    positionY: y,
    positionZ,
    orientationX: Math.cos(angle),
    orientationY: Math.sin(angle),
    orientationZ: 0,
    refDistance,
    maxDistance,
    rolloffFactor: rollOff,
    coneInnerAngle: innerCone,
    coneOuterAngle: outerCone,
    coneOuterGain: outerGain,
  });

  return panner;
}

export function changePannerPosition(x, y, angle, panner) {
  console.log(x, y, angle, panner, 'panner position')
  panner.positionX.value = x;
  panner.positionY.value = y;
  panner.orientationX.value = Math.cos(angle);
  panner.orientationY.value = Math.sin(angle);
}

export async function playExplosion(panner) {
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(100, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.5);

  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

  oscillator.connect(gainNode).connect(panner).connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.5);
}

export function playPowerUp(panner) {
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.5);

  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

  oscillator.connect(panner).connect(gainNode).connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.5);
}

export function playRocketMove(panner) {
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(50, audioCtx.currentTime);
  oscillator.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 2);

  oscillator.connect(panner).connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 1);
}

export function playGunshot(panner) {
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);

  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

  oscillator.connect(gainNode).connect(panner).connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.1);
}
