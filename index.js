import './style.css';
// https://picsum.photos/920/1350

class CanvasImage {
  image;
  resolve;
  complete;
  x = 0;
  y = 0;
  constructor(src){
    this.complete = new Promise(res => this.resolve = res);
    this.image = new Image();
    this.image.onload = () => this.resolve();
    this.image.src = src;
    this.image.crossOrigin = 'anonymous';
  }
}

class Draggle {
  isDrag = false;
  store = new Map;
  target;
  firstX;
  firstY;
  constructor(){
    document.addEventListener('pointerdown', ev => this.pointerDown(ev));
    document.addEventListener('pointermove', ev => this.pointerMove(ev));
    document.addEventListener('pointerup', ev => this.pointerUp(ev));
  }
  pointerDown(ev){
    const {target, clientX, clientY} = ev;
    if(!this.store.has(target)) return;
    this.target = target;
    this.isDrag = true;
    this.firstX = clientX;
    this.firstY = clientY;
  }
  pointerMove(ev){
    if(!this.isDrag) return;
    const {clientX, clientY} = ev;
    if(this.store.has(this.target)) this.store.get(this.target)({type: 'move', x: clientX - this.firstX, y: clientY - this.firstY});
  }
  pointerUp(ev){
    this.isDrag = false;
    const {clientX, clientY} = ev;
    if(this.store.has(this.target)) this.store.get(this.target)({type: 'up', x: clientX - this.firstX, y: clientY - this.firstY});
    this.target = null;
  }
}

const draggle = new Draggle();
const canvasImage = new CanvasImage('https://i.picsum.photos/id/685/920/1350.jpg?hmac=cTSNQSLgq0Wbife9wSSxfJHIVDQPWUeDb2RI0SQlZdw');

const main = async() => {
  const app = document.getElementById('app');  
  const rectData = {width: 300, height: 200, x: 0, y: 0};
  const canvas = Object.assign(document.createElement('canvas'), {id: 'canvas'});
  const ctx = canvas.getContext('2d');
  canvas.width = rectData.width;
  canvas.height = rectData.height;
  ctx.fillRect(rectData.x, rectData.y, rectData.width, rectData.height);
    
  await canvasImage.complete;
  const dragImg = canvasImage.image;
  ctx.drawImage(dragImg, canvasImage.x, canvasImage.y);
  
  const minX = 0;
  const minY = 0;
  const maxX = canvas.width - dragImg.width;
  const maxY = canvas.height - dragImg.height;
  
  draggle.store.set(canvas, ({type, x, y}) => {
    let dx = canvasImage.x + x;
    let dy = canvasImage.y + y;
  
    const min_cx = Math.min(dx, minX, maxX);
    const min_cy = Math.min(dy, minY, maxY);
    
    const max_cx = Math.max(dx, minX, maxX);
    const max_cy = Math.max(dy, minY, maxY);

    if(dx > minX){
      dx = 0;
    }
    if(dy > minY){
      dy = 0;
    }
    if(dy < maxY){
      dy = maxY;
    }
    if(dx < maxX){
      dx = maxX;
    }
    console.log(dx, dy);
    // console.log('dx:', dx, 'dy:', dy, 'min x:', min_cx, 'min y:', min_cy, 'max x:', max_cx, 'max y:', max_cy);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(dragImg, dx, dy);
    if(type === 'up'){
      canvasImage.x = dx;
      canvasImage.y = dy;
    }
  });
  app.appendChild(canvas);
}
main();

