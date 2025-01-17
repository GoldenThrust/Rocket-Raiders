import AspectRatio from "./aspectRatio.js";

export const maxDistance = { w: 5000, h: 5000 * (9 / 16) };

export const canvas = document.createElement('canvas');

document.body.appendChild(canvas);

export const ctx = canvas.getContext('2d');

export const mapAR = new AspectRatio(0.8, 0, null, 0.3);