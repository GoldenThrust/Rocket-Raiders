import { getRandomCharacters } from "./function.js";

export const maxDistance = 10000;

export const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

export const ctx = canvas.getContext('2d');

export const userName = getRandomCharacters()