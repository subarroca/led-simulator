export const rand = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export enum StripOrientation {
  HORIZONTAL = "h",
  VERTICAL = "v"
}
