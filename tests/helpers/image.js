import sinon from 'sinon';

export function sampleImage() {
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  ctx.fillStyle = 'blue';
  ctx.fillRect(
    randomInt(150),
    randomInt(75),
    randomInt(150),
    randomInt(75)
  );
  return canvas;
}

export function sampleVideo() {
  let image = sampleImage();
  image.play = sinon.stub();
  image.pause = sinon.stub();
  image.videoWidth = image.width;
  image.videoHeight = image.height;
  return image;
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}
