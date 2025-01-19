import { player } from "../player/currentPlayer.js";

export let audioCtx;

export function initaudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitaudioContext)();
  }
}



// const panningModel = "HRTF";
// const innerCone = 60;
// const outerCone = 90;
// const outerGain = 0.01;
const distanceModel = "linear";
const maxDistance = 2000;
// const refDistance = 1;
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
  initaudioCtx();
  if (!audioCtx) {
    console.error('audioCtx is not initialized');
    return null;
  }

  const panner = new PannerNode(audioCtx, {
    // panningModel,
    distanceModel,
    positionX: x,
    positionY: y,
    positionZ,
    orientationX: Math.cos(angle),
    orientationY: Math.sin(angle),
    orientationZ: 0,
    // refDistance,
    maxDistance,
    rolloffFactor: rollOff,
    // coneInnerAngle: innerCone,
    // coneOuterAngle: outerCone,
    // coneOuterGain: outerGain,
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

async function playSound(path, panner, gain = null) {
  const source = audioCtx.createBufferSource();
  if (gain) {
    source.connect(panner).connect(gain).connect(audioCtx.destination);
  } else {
    source.connect(panner).connect(audioCtx.destination);
  }

  const response = await fetch(path);
  const audioData = await response.arrayBuffer();
  const buffer = await audioCtx.decodeAudioData(audioData);

  source.buffer = buffer;

  source.start();
}

export async function playPowerUp(name, panner) {
  await playSound(`/assets/audio/${name}.mp3`, panner);
}

export function playRocketMove(panner) {
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'sawtooth';
  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
  oscillator.frequency.setValueAtTime(30, audioCtx.currentTime);
  oscillator.frequency.linearRampToValueAtTime(80, audioCtx.currentTime + 2);

  oscillator.connect(gainNode).connect(panner).connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 1);
}


export async function playGunshot(panner) {
  await playSound('/assets/audio/gunshot.mp3', panner);
}

export async function playExplosion(panner) {
  await playSound('/assets/audio/explosion.mp3', panner);
}