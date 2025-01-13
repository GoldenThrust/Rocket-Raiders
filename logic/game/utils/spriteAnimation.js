import { drawSpriteFrame, getFrameDuration } from "./function.js";

export default class SpriteAnimation {
    constructor(spritesheet, x, y, cutWidth, cutHeight, scaleWidth, scaleHeight, numberOfRows, numberOfColumns, fps, maxIterations = 0) {
        this.spritesheet = spritesheet;
        this.x = x;
        this.y = y;
        this.cutWidth = cutWidth;
        this.cutHeight = cutHeight;
        this.scaleWidth = cutWidth * scaleWidth;
        this.scaleHeight = cutHeight * scaleHeight;
        this.totalFrames = numberOfRows * numberOfColumns;
        this.numberOfColumns = numberOfColumns;
        this.maxIterations = maxIterations;
        this.fps = fps;
        this.currentFrame = 0;
        this.lastUpdate = 0;
        this.numberOfIterations = 0;
        this.state = 'running';
    }

    animate(t) {
        if (this.state === 'running') {
            const duration = getFrameDuration(t, this.lastUpdate, this.fps);

            if (duration) {
                this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
                this.lastUpdate = duration;
            }

            if (this.maxIterations !== 0 && (this.currentFrame + 1) >= this.totalFrames) {
                this.numberOfIterations++;
            }

            if (this.numberOfIterations >= this.maxIterations) {
                this.state = 'paused';
            }

            console.log('Iterations: ' + this.numberOfIterations, this.state, this.numberOfIterations >= this.maxIterations);
        }

        const column = this.currentFrame % this.numberOfColumns;
        const row = Math.floor(this.currentFrame / this.numberOfColumns);

        drawSpriteFrame(this.spritesheet, column, row, this.x, this.y, this.cutWidth, this.cutHeight, this.scaleWidth, this.scaleHeight);
    }

    slide(t, x, y) {
        this.update(x, y);
        const duration = getFrameDuration(t, this.lastUpdate, this.fps);

        if (duration) {
            this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
            this.lastUpdate = duration;
        }

        const column = this.currentFrame % this.numberOfColumns;
        const row = Math.floor(this.currentFrame / this.numberOfColumns);

        drawSpriteFrame(this.spritesheet, column, row, this.x, this.y, this.cutWidth, this.cutHeight, this.scaleWidth, this.scaleHeight);
    }

    update(x, y) {
        this.x = x;
        this.y = y;
    }
}
