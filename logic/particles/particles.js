import { randomColor } from "../utils/utils.js";

export default class Particles {
    constructor(x, y, ctx) {
        this.x = x;
        this.y = y;
        this.color = randomColor();
        this.size = 0.1 + Math.random() * 3;
        this.ctx = ctx;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        this.ctx.fill();
    }

    update() {
        this.draw()
    }
}
