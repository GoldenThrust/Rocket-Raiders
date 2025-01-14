const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const gainNode = audioContext.createGain();

const pannerNode = audioContext.createStereoPanner();

gainNode.connect(pannerNode);
pannerNode.connect(audioContext.destination);

function createWhiteNoise() {
  const bufferSize = 2 * audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioContext.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  return noise;
}

const explosionSound = new Audio('/assets/audio/explosion.mp3');
const gunshotSound = new Audio('/assets/audio/gunshot.mp3');

const rocketNoise = createWhiteNoise();
rocketNoise.connect(gainNode);
rocketNoise.start();

export function updateRocketSound(objectX, objectY, myX, myY, speed) {
    const deltaX = objectX - myX;
    const deltaY = objectY - myY;
  
    const normalizedX = (deltaX / window.innerWidth) * 2 - 1;
    const normalizedY = (deltaY / window.innerHeight) * 2 - 1;
  
    const clampedPan = Math.max(-1, Math.min(normalizedX, 1));
  
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const normalizedDistance = 1 / (1 + distance / 1000);
  
    gainNode.gain.setValueAtTime(normalizedDistance, audioContext.currentTime);
    pannerNode.pan.setValueAtTime(clampedPan, audioContext.currentTime);
  
    const pitch = 1 + speed / 1000;
    rocketNoise.playbackRate.setValueAtTime(pitch, audioContext.currentTime);
  }
  

export function playExplosionSound(objectX, objectY, myX, myY) {
  const deltaX = objectX - myX;
  const deltaY = objectY - myY;
  
  const normalizedX = (deltaX / window.innerWidth) * 2 - 1;
  const normalizedY = (deltaY / window.innerHeight) * 2 - 1;

  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const normalizedDistance = 1 / (1 + distance / 1000);

  explosionSound.volume = normalizedDistance;
  explosionSound.pan = normalizedX;

  explosionSound.play();
}

export function playGunshotSound(objectX, objectY, myX, myY) {
  const deltaX = objectX - myX;
  const deltaY = objectY - myY;

  const normalizedX = (deltaX / window.innerWidth) * 2 - 1;
  const normalizedY = (deltaY / window.innerHeight) * 2 - 1;

  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const normalizedDistance = 1 / (1 + distance / 1000);

  gunshotSound.volume = normalizedDistance;
  gunshotSound.pan = normalizedX;

  gunshotSound.play();
}
