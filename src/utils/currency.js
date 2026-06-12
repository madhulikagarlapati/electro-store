const CONVERSION_RATE_USD_TO_INR = 82.5;

export function toINR(valueUsd) {
  const inr = (Number(valueUsd) || 0) * CONVERSION_RATE_USD_TO_INR;
  return inr;
}

export function formatINR(valueUsd) {
  const inr = toINR(valueUsd);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(inr);
}

export default formatINR;
