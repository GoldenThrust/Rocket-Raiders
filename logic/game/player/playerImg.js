const imgs = ['./imgs/player.svg', './imgs/playerburst.svg', './imgs/explosion.png']

const imgData = [];

imgs.forEach((img) => {
  let image = new Image();
  image.src = img;

  imgData.push(image);
})


export default imgData;

