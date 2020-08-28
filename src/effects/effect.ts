export interface Effect {
  render(): string[];
  next(): void;
}
