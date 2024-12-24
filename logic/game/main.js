import Particles from "./particles/particles.js";
import { player } from "./player/currentPlayer.js";
import { distanceBetween, drawLive, getRandomInt } from "./utils/function.js";
import { ctx, canvas } from "./utils/constant.js"
import socket from "./websocket.js";
// window.addEventListener('click', () => {
//     const audioCtx = new AudioContext();
// })

const scaleFactor = 0.5;

export let cp = []

const bg = new Image();
bg.src = './imgs/star.png'

ctx.drawImage(bg, 0, 0, 100, 100)

socket.emit("connected", player);

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

function main(t) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);


    ctx.strokeStyle = 'red';

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scaleFactor, scaleFactor);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.translate(-player.x + canvas.width / 2, -player.y + canvas.height / 2);
    renderParticles();


    player.draw(t);
    player.update();

    cp.forEach((player) => {
        player.draw(t);
    })


    ctx.restore();
 
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