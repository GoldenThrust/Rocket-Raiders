const imgs = ['./assets/imgs/player.svg', './assets/imgs/playerburst.svg', './assets/imgs/explosion.png']

const imgData = [];

imgs.forEach((img) => {
  let image = new Image();
  image.src = img;

  imgData.push(image);
})


export default imgData;

