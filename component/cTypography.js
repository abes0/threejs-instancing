import { CanvasTexture } from "three/src/textures/CanvasTexture";
import { LinearFilter } from "three/src/constants";

export default class CTypography {
  constructor({ el }) {
    this.el = el;
    this.style = getComputedStyle(el);
    this.text = el.textContent;
    this.rect = el.getBoundingClientRect();
    // this.init();
  }

  init() {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "rgba(255, 100, 0, 0.0)";
      ctx.fillRect(0, 0, width, height);
      console.log(this.style.color);

      ctx.fillStyle = this.style.color;
      console.log(this.style.fontStyle);
      ctx.fontStyle = this.style.fontStyle;
      ctx.lineHeight = this.style.lineHeight;
      ctx.fontSize = this.style.fontSize;
      ctx.font = `${this.style.fontSize} ${this.style.fontFamily}`;

      ctx.fillText(this.text, this.rect.left, this.rect.top + this.rect.height);

      const texture = new CanvasTexture(canvas);
      texture.needsUpdate = false;
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;
      texture.generateMipmaps = false;
      texture.w = canvas.width;
      texture.h = canvas.height;

      this.texture = texture;
      resolve();
    });
  }

  getTexture() {
    return this.texture;
  }
}
