const PALETTE = ['#5e6ad2', '#e5484d', '#f2703d', '#f2c94c', '#4cb782', '#26b5ce', '#9b6bde'];

export function randomUserColor(): string {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}
