import Particles from "./particles/particles.js";
import { player } from "./player/currentPlayer.js";
import { distanceBetween, drawLive, drawMiniMapPosition, getGameId, getRandomInt } from "./utils/function.js";
import { ctx, canvas, mapAR, maxDistance } from "./utils/constant.js"
import socket from "./websocket.js";
import axios from "axios";
import { updateRocketSound } from "./utils/audio.js";

const scaleFactor = 0.8;
const x = innerWidth * 0.9;
const y = innerHeight * 0.82;
const radius = 20;
let lastUse = 1000;
let enableSpeciality = false;


const gameid = getGameId();

const gameStarted = sessionStorage.getItem(gameid);
const imgP = new Image();
imgP.src = '/assets/power.png';

if (!gameStarted) {
    sessionStorage.setItem(gameid, true);
}

addEventListener("contextmenu", () => { });

export let cp = new Map();


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
    const gameData = JSON.parse(sessionStorage.getItem(`gameData-${gameid}`));
    const kills = sessionStorage.getItem(`kill-${gameid}`);


    if (Math.floor(t / 1000) < 10 && !gameStarted) {
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        const text = ctx.measureText('Game started in ' + (10 - Math.floor(t / 1000)) + 'seconds');
        ctx.fillText('Game started in ' + (10 - Math.floor(t / 1000)) + ' seconds', (canvas.width / 2 - text.width / 2), canvas.height / 2);
    } else if (Math.floor(t / 100) > 8 && Math.floor(t / 60000) < 15) {
        player.speciality.updatePowersUp()
        if (t - lastUse > 1000) {
            lastUse = t;
            enableSpeciality = true;
        }
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
            updateRocketSound(cplayer.x, cplayer.y, player.x, player.y, cplayer.speed);
            drawMiniMapPosition(cplayer, cplayer.team === 'neutral' || cplayer.team !== player.team ? 'red' : 'blue');
        })
        drawMiniMapPosition(player);
        player.update(t);
        // drawLive(player)




        if (gameData) {
            const endTime = new Date(gameData?.endTime);
            const now = new Date();

            const diffMs = endTime - now;

            if (diffMs > 0) {
                const totalSeconds = Math.floor(diffMs / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;

                const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

                ctx.font = '12px Arial';
                ctx.fillStyle = 'white';
                ctx.fillText(`${formattedTime}`, 15, 15);
            } else {
                ctx.font = '16px Arial';
                ctx.fillStyle = 'white';
                ctx.fillText('00:00', 10, 10);
            }
        }

        ctx.font = '12px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`Kills: ${kills || 0}`, 15, 30);
        ctx.save();

        drawImageInArc();
    }



    requestAnimationFrame(main);
}

requestAnimationFrame(main);

canvas.width = innerWidth;
canvas.height = innerHeight;

addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
})

function drawImageInArc() {
    ctx.save();
    ctx.fillStyle = 'springgreen';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (enableSpeciality) {
        ctx.fill();
    }
    ctx.closePath();

    ctx.clip();

    ctx.drawImage(imgP, x - radius, y - radius, radius * 2, radius * 2);

    ctx.restore();

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
}


function handleClickOrTouch(event) {
    const rect = canvas.getBoundingClientRect();
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;

    const canvasX = clientX - rect.left;
    const canvasY = clientY - rect.top;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();

    if (ctx.isPointInPath(canvasX, canvasY)) {
        if (enableSpeciality) {
            enableSpeciality = false;
            player.speciality.usePowersUp()
        }
        console.log('Clicked or touched inside the arc!');
    }
}

addEventListener('click', handleClickOrTouch);
addEventListener('touchstart', handleClickOrTouch);



function setFullScreen() {
    if (document.fullscreenElement === null) {
        document.documentElement.requestFullscreen().then((response) => {
            if (screen.orientation && screen.orientation.lock) {
                if (
                    ["portrait", "portrait-primary"].includes(screen.orientation.type)
                ) {
                    console.log(screen.orientation.type);
                    screen.orientation
                        .lock("landscape")
                        .then(() => {
                            console.log("Switched to landscape orientation.");
                        })
                        .catch((error) => {
                            console.error("Orientation lock failed:", error);
                        });
                }
            } else {
                alert("Screen Orientation API is not supported on this browser.");
            }
        });
    }
}

document.onclick = () => {
    // setFullScreen();
}