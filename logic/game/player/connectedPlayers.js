import { lerp } from "../utils/function.js";
import Player from "./player.js";

export default class CPlayer extends Player {
    constructor(x, y, angle, team, ctx, user) {
        const { username, selectedRocket } = user;
        super(x, y, angle, ctx, username, selectedRocket.rocket, selectedRocket.flame, selectedRocket.speed, selectedRocket.range, selectedRocket.durability, selectedRocket.fireRate, selectedRocket.speciality);
        this.team = team;
        this.px = x;
        this.py = y;
        this.pangle = angle;
        this._addEventListener = () => { };
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