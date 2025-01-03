import { randomColor } from "../utils/function.js";

export const alien = (color) => `data:image/svg+xml;base64,${btoa(`<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 160.96 215.38">
  <defs>
    <style>
      .cls-1 {
        fill: url(#linear-gradient);
        opacity: .98;
      }

      .cls-1, .cls-2, .cls-3 {
        stroke-width: 0px;
      }

      .cls-2 {
        fill: ${color};
      }

      .cls-4 {
        fill: #7dc242;
        stroke: #fff;
        stroke-miterlimit: 10;
        stroke-width: .25px;
      }

      .cls-3 {
        fill: #141715;
      }
    </style>
    <linearGradient id="linear-gradient" x1="0" y1="143.87" x2="157.28" y2="143.87" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#28524e"/>
      <stop offset=".34" stop-color="#162825"/>
      <stop offset=".51" stop-color="#0c110e"/>
      <stop offset="1" stop-color="#0a4246"/>
    </linearGradient>
  </defs>
  <path class="cls-4" d="M117.99,123.45c0,11.28-3.8,20.43-39.08,20.43s-40.92-9.58-40.92-20.86,5.64-19.99,40.92-19.99c32.61,0,39.08,9.14,39.08,20.43Z"/>
  <g>
    <ellipse class="cls-2" cx="78.32" cy="163.78" rx="42.64" ry="7.5"/>
    <g>
      <ellipse class="cls-1" cx="78.64" cy="143.87" rx="78.64" ry="23.3"/>
      <ellipse class="cls-3" cx="78.32" cy="165.83" rx="42" ry="7.5"/>
    </g>
  </g>
</svg>`)}`

const alienImgData = [{ type: 'shooter', img: alien }]


export default alienImgData;

