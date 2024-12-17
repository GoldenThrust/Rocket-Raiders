import { lerp } from "../utils/function.js";
import Player from "./player.js";

export default class CPlayer extends Player {
    constructor(username, x, y, ctx) {
        super(username, x, y, ctx);
        this.px = x;
        this.py = y;
        this.pangle = (Math.PI / 180) * 270;
        this._addEventListener = () => {};
    }

    update(x, y, angle, nitroPower) {
        this.updateState()
        this.nitroPower = nitroPower;

        const sec = new Date().getTime() / 1000;
        const t = sec - Math.floor(sec);

        this.x = lerp(this.px, x, t);
        this.y = lerp(this.py, y, t);
        this.px = x;
        this.py = y;
        this.angle = lerp(this.pangle, angle, t);
        this.pangle = angle;

        

        this.weapons.forEach((weapon, i) => {
            const update = weapon.update()

            if (update) {
                this.weapons.splice(i, 1)
            }
        })
    }
}