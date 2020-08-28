import { StripOrientation } from "./util";

export class Led {
  static width: number;
  static spacing: number;
  static spread: number;
  static projection: number = 25;

  offset: number = 0;
  orientation: StripOrientation = StripOrientation.HORIZONTAL;
  ctx: CanvasRenderingContext2D;
  color: string = "white";

  constructor(
    ctx: CanvasRenderingContext2D,
    orientation: StripOrientation,
    offset: number
  ) {
    this.ctx = ctx;
    this.offset = offset;
    this.orientation = orientation;
  }

  updateParams() {}

  updatePosition() {}

  get gradient(): CanvasGradient {
    let gradient;
    if (this.orientation === StripOrientation.HORIZONTAL)
      gradient = this.ctx.createRadialGradient(
        this.offset,
        -Led.width / 2,
        Led.width / 2,
        this.offset,
        0,
        Led.spread / 2
      );
    else {
      gradient = this.ctx.createRadialGradient(
        -Led.width / 2,
        this.offset,
        Led.width / 2,
        0,
        this.offset,
        Led.spread / 2
      );
    }
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, "transparent");

    return gradient;
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.3;
    // ctx.filter = `blur(${Pixel.spread/2}px)`;
    ctx.fillStyle = this.gradient;
    ctx.beginPath();
    if (this.orientation === StripOrientation.HORIZONTAL) {
      ctx.scale(1, Led.projection);
      ctx.arc(this.offset, 0, Led.width, 0, Math.PI * 2, false);
    } else {
      ctx.scale(Led.projection, 1);
      ctx.arc(0, this.offset, Led.width, 0, Math.PI * 2, false);
    }
    ctx.fill();
    ctx.restore();
  }

  render(color: string) {
    this.color = color;
    this.updatePosition();
    this.updateParams();
    this.draw();
  }
}
