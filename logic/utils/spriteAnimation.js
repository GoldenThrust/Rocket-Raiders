import { drawSpriteFrame, getFrameDuration } from "./utils.js";

export default class SpriteAnimation {
    constructor(spritesheet, x, y, cutWidth, cutHeight, scaleWidth, scaleHeight, numberOfRows, numberOfColumns, fps, maxInterations = 0) {
        this.spritesheet = spritesheet;
        this.x = x;
        this.y = y;
        this.cutWidth = cutWidth;
        this.cutHeight = cutHeight;
        this.scaleWidth = cutWidth * scaleWidth;
        this.scaleHeight = cutHeight * scaleHeight;
        this.totalFrames = numberOfRows * numberOfColumns;
        this.numberOfColumns = numberOfColumns;
        this.maxInterations = maxInterations;
        this.fps = fps;
        this.CanvasX = 0;
        this.CanvasY = 0;
        this.currentFrame = 0;
        this.lastUpdate = 0;
        this.numberOfInterations = 0;
        this.state = 'running';
    }

    animate(t) {
        if (this.state === 'running') {
            const duration = getFrameDuration(t, this.lastUpdate, this.fps);

            if (duration) {
                if (this.maxInterations !== 0 && (this.currentFrame + 1) >= this.totalFrames)
                    this.numberOfInterations++;
                this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
                this.lastUpdate = duration;
            }


            if (this.numberOfInterations >= this.maxInterations)
                this.state = 'paused';
        }


        const column = this.currentFrame % this.numberOfColumns;
        const row = Math.floor(this.currentFrame / this.numberOfColumns)

        drawSpriteFrame(this.spritesheet, column, row, this.x, this.y, this.cutWidth, this.cutHeight, this.scaleWidth, this.scaleHeight)
    }

    slide(x, y) {
        this.update(x, y)
        const duration = getFrameDuration(t, this.lastUpdate, this.fps);

        if (duration) {
            this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
            this.lastUpdate = duration;
        }

        const column = this.currentFrame % this.numberOfColumns;
        const row = Math.floor(this.currentFrame / this.numberOfColumns)

        drawSpriteFrame(this.spritesheet, column, row, this.x, this.y, this.cutWidth, this.cutHeight, this.scaleWidth, this.scaleHeight)
    }

    update(x, y) {
        this.x = x;
        this.y = y;
    }
}