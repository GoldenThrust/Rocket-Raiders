import { player } from "../player/player.js";
import Gun from "../player/weapons/Gun.js";
import { angleBetween, ctx, distanceBetween, getRandomInt, randomColor } from "../utils/utils.js";
import alienImgData from "./alienImg.js";

export default class Alien {
    constructor(x, y, ctx, type) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.type = type;
        const alien = alienImgData.find((alien) => alien.type === type);
        this.alien = new Image();
        this.alien.src = alien.img(randomColor()); // Assuming alien.img is a valid URL
        this.angle = 0;
        this.speed = 5;
        this.activeGun = [];
    }

    draw() {
        this.ctx.save();

        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(-this.angle);
        this.ctx.drawImage(this.alien, -25, -30, 50, 68);

        this.ctx.restore();
    }

    update() {
        const dB = distanceBetween(player, this);
        if (dB[0] > 100 && dB[0] < 1000) {
            document.querySelector('p').innerText = this.angle;

            const dirX = dB[1] / dB[0];
            const dirY = dB[2] / dB[0];

            this.x += dirX * this.speed;
            this.y += dirY * this.speed;

            this.ctx.beginPath();
            this.ctx.strokeStyle = 'white';
            this.ctx.moveTo(player.x, player.y);
            this.ctx.lineTo(this.x, this.y);
            this.ctx.stroke();
        }

        if (getRandomInt(0, 2) && this.activeGun.length < 100) {
            const gunAngle = angleBetween(this, player) - player.angle;
            this.activeGun.push(new Gun('gun', this.x - 10, this.y + 24, gunAngle, this.speed + 2, 'green'));
        }

        this.activeGun.forEach((gun, i) => {
            gun.draw();
            gun.update();

            if (distanceBetween(gun, player)[0] < 10) {
                console.log('player dead', distanceBetween(player, gun)[0]);
                this.activeGun.splice(i, 1); // Remove gun from array
            }

            if (distanceBetween(gun, this)[0] > 2000) {
                this.activeGun.splice(i, 1);
            }
        });

        player.activeGun.forEach((gun, i) => {
            if (distanceBetween(gun, this)[0] < 10) {
                player.activeGun.splice(i, 1);
            }
        });

        this.draw();
    }
}
