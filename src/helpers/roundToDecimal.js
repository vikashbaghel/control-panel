export function formRoundToDecimalPlaces(number) {
  if (!number) return "";
  const num = parseFloat(number);
  let factor = Math.pow(10, 2);
  return Math.round(num * factor) / factor;
}

export function roundToDecimalPlaces(value, decimalPlaces = 2) {
  if (!value) return 0;
  const dp = Math.pow(10, decimalPlaces);

  const num = parseFloat(value);
  return Math.round(num * dp) / dp;
}
