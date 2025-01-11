import Particles from "./particles/particles.js";
import { player } from "./player/currentPlayer.js";
import { distanceBetween, drawLive, drawMiniMapPosition, getGameId, getRandomInt } from "./utils/function.js";
import { ctx, canvas, mapAR, maxDistance } from "./utils/constant.js"
import socket from "./websocket.js";
import axios from "axios";
// window.addEventListener('click', () => {
//     const audioCtx = new AudioContext();
// })
const scaleFactor = 0.5;

const gameid = getGameId();

const gameStarted = sessionStorage.getItem(gameid);

if (!gameStarted) {
    sessionStorage.setItem(gameid, true);
}

addEventListener("contextmenu", () => { });

export let cp = new Map();


const elem = document.documentElement;

ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

const particles = [];


for (let i = 0; i < 100; i++) {
    const x = getRandomInt(-1000, 1000);
    const y = getRandomInt(-1000, 1000);
    particles.push(new Particles(x, y, ctx))
}

function renderParticles() {
    particles.forEach((particle) => {
        const dB = distanceBetween(particle, player);
        particle.update();
        if (dB[0] > canvas.width + 1000) {
            let x = getRandomInt(player.x - dB[0], player.x + dB[0]);
            let y = getRandomInt(player.y - dB[0], player.y + dB[0]);

            particle.x = dB[1] > 0 ? Math.min(x, -x) + canvas.width : Math.max(x, -x) - canvas.width;
            particle.y = dB[2] > 0 ? Math.min(y, -y) + canvas.height : Math.max(y, -y) - canvas.height;
        }
    });
}

let map = null;
axios.get(`/api/game/get-game/${gameid}`).then((response) => {
    player.team = response.data?.match?.team;
    sessionStorage.setItem(`gameData-${gameid}`, JSON.stringify(response.data?.match));
    const image = new Image();
    image.src = `/${response.data.match.map.background}`;
    map = image;
    socket.emit("connected", player);
}).catch((error) => {
    console.error(error)
})

function main(t) {
    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    canvas.width = innerWidth;
    // mapCanvas.width = (maxDistance.w * 2);

    if (Math.floor(t / 1000) < 10 && !gameStarted) {
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        const text = ctx.measureText('Game started in ' + (10 - Math.floor(t / 1000)) + 'seconds');
        ctx.fillText('Game started in ' + (10 - Math.floor(t / 1000)) + ' seconds', (canvas.width / 2 - text.width / 2), canvas.height / 2);
    } else if (Math.floor(t / 100) > 8 && Math.floor(t / 60000) < 15) {
        ctx.strokeStyle = 'red';

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scaleFactor, scaleFactor);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        ctx.translate(-player.x + canvas.width / 2, -player.y + canvas.height / 2);


        if (map) {
            ctx.drawImage(
                map, (-maxDistance.w), (-maxDistance.h), (maxDistance.w * 2), (maxDistance.h * 2)
            );
        }
        if (!map)
            renderParticles();
        player.draw(t);

        cp.forEach((cplayer) => {
            cplayer.draw(t);
        })


        ctx.restore();



        ctx.strokeStyle = 'grey';
        ctx.fillStyle = '#111';
        ctx.strokeRect(mapAR.x, mapAR.y, mapAR.width, mapAR.height)
        ctx.fillRect(mapAR.x, mapAR.y, mapAR.width, mapAR.height)
        cp.forEach((cplayer) => {
            drawMiniMapPosition(cplayer, cplayer.team === 'neutral' || cplayer.team !== player.team ? 'red' : 'blue' );
        })
        drawMiniMapPosition(player);
        player.update(t);
    }

    if (Math.floor(t / 60000) < 15) {
        // endGame();
    }


    drawLive(player)

    requestAnimationFrame(main);
}

requestAnimationFrame(main);

canvas.width = innerWidth;
canvas.height = innerHeight;

// event listeners
addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
})


function goFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

document.onclick = () => {
    if (document.fullscreenElement || document.mozFullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        console.log('Exit Fullscreen')
        // exitFullscreen();
    } else {
        console.log('Go Fullscreen')
        // goFullscreen();
    }
}