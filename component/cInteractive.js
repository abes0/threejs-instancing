export default class CInteractive {
  constructor() {
    this.mouse = {};
    this.init();
  }

  init() {
    this.getSize();

    this.eResizeHandler = this.eResize.bind(this);
    window.addEventListener("resize", this.eResizeHandler, false);

    this.eMousemoveHnadler = this.eMousemove.bind(this);
    window.addEventListener("mousemove", this.eMousemoveHnadler, false);
  }

  eMousemove(e) {
    // console.log(e);
    const x = e.clientX;
    const y = e.clientY;
    this.mouse.x = x - this.sw / 2;
    this.mouse.y = -y + this.sh / 2;
    this.mouse.mapX = this.mouse.x / (this.sw / 2);
    this.mouse.mapY = this.mouse.y / (this.sh / 2);
    // console.log(this.mouse);
  }

  eResize() {
    this.getSize();
  }

  getSize() {
    this.sw = window.innerWidth;
    this.sh = window.innerHeight;
  }

  mouse(callback) {
    callback(this.mouse);
  }
}
