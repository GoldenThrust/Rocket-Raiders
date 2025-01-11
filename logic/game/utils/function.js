import { ctx, mapAR, maxDistance } from "./constant.js";


export function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export function getRandomNZeroInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  let random = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
  if (random === 0) {
    random = min;
  }

  return random;
}


export function distanceBetween(obj, obj2) {
  return [Math.sqrt((obj.x - obj2.x) ** 2 + (obj.y - obj2.y) ** 2), (obj.x - obj2.x), (obj.y - obj2.y)];
}

export function angleBetween(obj, obj2) {
  return Math.atan2((obj.y - obj2.y), (obj.x - obj2.x))
}

export const randomColor = () => `hsl(${Math.random() * 360}, 50%, 50%)`;

export function radToDeg(rad) {
  return rad * 180 / Math.PI;
}

export function degToRad(deg) {
  return deg * Math.PI / 180;
}

export function getRandomCharacters() {
  let char = '';
  for (let i = 0; i < 10; i++) {
    if (i === 0) {
      char += String.fromCharCode(getRandomInt(65, 91))
    } else {
      char += String.fromCharCode(getRandomInt(97, 123))
    }
  }

  return char;
}

export function debug() {
  const p = document.createElement('p');
  document.body.appendChild(p)

  return p;
}


export function lerp(a, b, t) {
  return a + (b - a) * t;
}


function projectPolygon(axis, vertices) {
  const projections = vertices.map(v => (v.x * axis.x + v.y * axis.y));
  return {
    min: Math.min(...projections),
    max: Math.max(...projections)
  };
}

function isSeparatingAxis(axis, vertices1, vertices2) {
  const proj1 = projectPolygon(axis, vertices1);
  const proj2 = projectPolygon(axis, vertices2);

  return proj1.max < proj2.min || proj2.max < proj1.min;
}

function getEdges(vertices) {
  let edges = [];
  for (let i = 0; i < vertices.length; i++) {
    const next = (i + 1) % vertices.length;
    edges.push({
      x: vertices[next].x - vertices[i].x,
      y: vertices[next].y - vertices[i].y
    });
  }
  return edges;
}


export function checkCollision(obj1, obj2) {
  const vertices1 = obj1.getVertices();
  const vertices2 = obj2.getVertices();

  const edges = [
    ...getEdges(vertices1),
    ...getEdges(vertices2)
  ];

  for (let edge of edges) {
    const axis = { x: -edge.y, y: edge.x };
    if (isSeparatingAxis(axis, vertices1, vertices2)) {
      return false;
    }
  }

  return true;
}

export function drawLive(player) {
  player.ctx.save();
  player.ctx.fillStroke = 'springGreen';
  player.ctx.lineWidth = 4;
  for (let i = 0; i < player.live; i++) {
    player.ctx.beginPath();
    player.ctx.moveTo((innerWidth - 10) - (i * 5), 10);
    player.ctx.lineTo((innerWidth - 10) - (i * 5), 20);
    player.ctx.stroke();
  }
  player.ctx.restore()
}

export function damageAnimation(player) {
  player.live--;
  player.weaponHit = true;
  const interVal = setInterval(() => {
    player.damage = !player.damage;
  }, 100);
  setTimeout(() => {
    player.weaponHit = false;
    player.damage = false;
    clearInterval(interVal);
  }, 300)
}


export function drawSpriteFrame(spriteSheet, frameX, frameY, canvasX, canvasY, width, height, scaleWidth, scaleHeight) {
  ctx.drawImage(spriteSheet, frameX * width, frameY * height, width, height, canvasX, canvasY, scaleWidth, scaleHeight)
}


export function getFrameDuration(timestamp, lastUpdate, fps) {
  if (timestamp - lastUpdate > 1000 / fps) {
    lastUpdate = timestamp;
    return lastUpdate;
  }

  return null;
}


export function getGameId() {
  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);

  const gameid = urlParams.get('gameid');

  return gameid ? gameid : null;
}


export function drawMiniMapPosition(player, color = 'green') {
  const scaleDown = mapAR.scaleDown(maxDistance.w + player.x, maxDistance.h + player.y);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(scaleDown.x, scaleDown.y, 2, 0, Math.PI * 2);
  ctx.fill();
}
