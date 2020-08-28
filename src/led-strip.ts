import { Led } from "./led";
import { GradientEffect, Effect, KittEffect } from "./effects";
import { StripOrientation } from "./util";
import { config } from "./config";

export class LedStrip {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null = null;
  winWidth: number = 0;
  winHeight: number = 0;
  numLeds = 60 * 3;
  leds: Led[] = [];
  orientation: StripOrientation;
  effect: Effect;
  lastRefresh: number = Date.now();
  fpsInterval: number = 1000 / 25;

  constructor(canvasSelector: string, orientation: StripOrientation) {
    this.canvas = document.querySelector(canvasSelector);
    this.orientation = orientation;
    this.effect = new GradientEffect(this.numLeds, config.rainbow);

    if (this.canvas) {
      this.ctx = this.canvas.getContext("2d") || null;

      if (this.ctx) {
        this.onResize();

        if (this.ctx !== null)
          for (let i = 0; i < this.numLeds; i++) {
            const s = new Led(this.ctx, orientation, i * Led.spacing);
            this.leds.push(s);
          }

        this.render();
      }
    }
  }

  render() {
    if (this.ctx) {
      const image = this.effect.render();

      this.ctx.clearRect(0, 0, this.winWidth, this.winHeight);
      for (let i = 0; i < this.leds.length; i++) {
        this.leds[i].render(image[i]);
      }
      this.animate();
    }
  }

  onResize() {
    if (this.canvas) {
      this.winWidth = this.canvas.width = window.innerWidth;
      this.winHeight = this.canvas.height = window.innerHeight;

      const span =
        this.orientation === StripOrientation.HORIZONTAL
          ? this.winWidth
          : this.winHeight;
      Led.spacing = span / this.numLeds;
      Led.width = span / this.numLeds;
      Led.spread = Led.width * 3;

      this.render();
    }
  }

  setOrientation(orientation: StripOrientation) {
    this.orientation = orientation;
    this.leds.forEach((led) => (led.orientation = orientation));
    this.onResize();
  }

  setMode(mode: string) {
    switch (mode) {
      case "rainbow":
        this.effect = new GradientEffect(this.numLeds, config.rainbow);
        break;

      case "kitt":
        this.effect = new KittEffect(this.numLeds);
        break;
    }
  }

  animate() {
    // request another frame
    requestAnimationFrame(() => this.animate());

    // calc elapsed time since last loop
    const now = Date.now();
    const elapsed = now - this.lastRefresh;

    // if enough time has elapsed, draw the next frame
    if (elapsed > this.fpsInterval) {
      // Get ready for next frame by setting lastRefresh=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      this.lastRefresh = now - (elapsed % this.fpsInterval);

      this.effect.next();
      this.render();
    }
  }
}
