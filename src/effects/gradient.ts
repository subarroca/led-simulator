import { Effect } from "./effect";
import { piecewise, interpolateHsl } from "d3-interpolate";
import { scaleLinear } from "d3-scale";

export class GradientEffect implements Effect {
  private size: number;
  private rangeWindow: number;
  private rangeOffset: number;
  private rangeIncrement: number;
  private colorMap: (t: number) => any;

  constructor(
    size: number,
    options: {
      rangeWindow?: number;
      rangeIncrement?: number;
      rangeOffset?: number;
      colors: string[];
    } = {
      colors: ["black", "white"]
    }
  ) {
    this.size = size;
    this.rangeWindow = options.rangeWindow || 1;
    this.rangeIncrement = options.rangeIncrement || 0;
    this.rangeOffset = options.rangeOffset || 0;
    this.colorMap = piecewise(interpolateHsl, options.colors);
  }

  render() {
    const scale = scaleLinear()
      .domain([0, 1])
      .range([this.rangeOffset, this.rangeOffset + this.rangeWindow]);

    return Array.from(new Array<string>(this.size)).map((val, key) =>
      this.colorMap(scale(key / this.size) % 1)
    );
  }

  next() {
    this.rangeOffset = (this.rangeOffset + this.rangeIncrement) % 1;
  }
}
