import Weapon from "./weapon.js";
import { distanceBetween } from "../../utils/function.js";

export default class Gun extends Weapon {
    constructor(id, x, y, angle, speed, ctx, color = 'pink') {
        super(id, x, y, 2, 10, angle, speed, ctx, color);
        this.initX = x;
        this.initY = y;
    }

    draw() {
        this.ctx.save();
        
        this.ctx.translate(this.x, this.y);

        this.ctx.rotate(-this.angle);

        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.w;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -this.h*4);
        this.ctx.lineTo(0, -this.h*2.5);
        // this.ctx.arc(0, -this.h*4, 5, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.restore();
    }

    update(range) {
        this.x -= this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
        
        if(distanceBetween(this, { x: this.initX, y: this.initY })[0] > range) {
            return true;
        }
    }
}
