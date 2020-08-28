/*
 * Creation Aug 22, 2020
 * @author Salvador Subarroca
 * Twitter https://twitter.com/subarroca
 */
import "./style.scss";
import { LedStrip } from "./led-strip";
import { StripOrientation } from "./util";
import { Menu } from "./menu";

const strip = new LedStrip("#led-strip", StripOrientation.VERTICAL);
const config = new Menu();
config.orientationChange.subscribe((orientation) =>
  strip.setOrientation(orientation)
);
config.modeChange.subscribe((mode) => strip.setMode(mode));

// TODO: check why it's not working
window.addEventListener("resize", () => strip.onResize());
