export function roundNumber() {
  return (num: number) => {
    let multiplier = Math.pow(10, 2);
    return Math.round(num * multiplier) / multiplier;
  };
}
