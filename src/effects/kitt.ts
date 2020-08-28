import { Effect } from "./effect";
import { hsl } from "d3-color";

export class KittEffect implements Effect {
  private size: number;
  private pattern: number[];
  private color = hsl(345, 1, 0.5);
  private patternFit: { numPixels: number; mod: number; ledPerPixel: number };
  private patternRangeWindow = 4;
  private patternRangeOffset = 0;
  private patternRangeDirection = 1;

  constructor(size: number, options: {} = {}) {
    this.size = size;

    // find the best fit for pixels
    this.patternFit = [8, 7, 9, 6, 10]
      .map((val) => ({
        numPixels: val,
        mod: 0.5 - Math.abs(((size / val) % 1) - 0.5),
        ledPerPixel: Math.round(size / val)
      }))
      .reduce((best, current) => (best.mod > current.mod ? current : best), {
        mod: 1,
        numPixels: 0,
        ledPerPixel: 0
      });

    this.pattern = Array.from(new Array(this.patternFit.ledPerPixel)).map(
      (val, key) => {
        if (
          key <= this.patternFit.ledPerPixel * 0.025 ||
          key >= this.patternFit.ledPerPixel * 0.975
        )
          return 0.2;
        else if (
          key <= this.patternFit.ledPerPixel * 0.3 ||
          key >= this.patternFit.ledPerPixel * 0.7
        )
          return 0.5;
        else return 1;
      }
    );
  }

  render() {
    return Array.from(new Array<string>(this.size)).map((val, key) => {
      const pixel = Math.floor(key / this.patternFit.ledPerPixel);
      if (
        pixel >= this.patternRangeOffset &&
        pixel < this.patternRangeOffset + this.patternRangeWindow
      )
        return hsl(
          this.color.h,
          this.color.s,
          this.color.l,
          this.pattern[key % this.patternFit.ledPerPixel]
        ).toString();
      else return "transparent";
    });
  }

  next() {
    this.patternRangeOffset =
      this.patternRangeOffset + this.patternRangeDirection;

    if (
      this.patternRangeOffset ===
        this.patternFit.numPixels + this.patternRangeWindow ||
      this.patternRangeOffset === -this.patternRangeWindow
    ) {
      this.patternRangeDirection *= -1;
    }
  }
}
