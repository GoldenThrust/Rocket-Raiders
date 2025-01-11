import { maxDistance } from "./constant.js";

export default class AspectRatio {
    constructor(xRatio, yRatio, widthRatio = null, heightRatio = null) {
      this._x = innerWidth * xRatio;
      this._y = innerHeight * yRatio;
  
      if (widthRatio) this._width = innerWidth * widthRatio;
      else this._width = (1 - xRatio) * innerWidth;
  
      if (heightRatio) this._height = innerHeight * heightRatio;
      else this._height = (1 - yRatio) * innerHeight;
    }
  
    get x() {
      return this._x;
    }
  
    get y() {
      return this._y;
    }
  
    scaleDown(origX, origY, width = maxDistance.w * 2, height = maxDistance.h * 2, by = 1) {
      const scaledX = this._x + ((origX / width) * this._width) / by;
      const scaledY = this._y + ((origY / height) * this._height) / by;
  
      const clampedX = Math.max(this._x, Math.min(scaledX, this._x + this._width));
      const clampedY = Math.max(this._y, Math.min(scaledY, this._y + this._height));
  
      return { x: clampedX, y: clampedY };
    }
  
    get width() {
      return this._width;
    }
  
    get height() {
      return this._height;
    }
  }