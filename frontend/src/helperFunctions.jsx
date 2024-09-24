// Calculates income after tax given an income
function taxedIncome(income) {
  if (isNaN(income)) return 0;

  const brackets = [
    { limit: 11000, rate: 0.1 },
    { limit: 44725, rate: 0.12 },
    { limit: 95375, rate: 0.22 },
    { limit: 182100, rate: 0.24 },
    { limit: 231250, rate: 0.32 },
    { limit: 578125, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ];

  let tax = 0;
  let previousLimit = 0;

  for (const bracket of brackets) {
    if (income > bracket.limit) {
      // Calculate tax for the portion up to the current limit
      tax += (bracket.limit - previousLimit) * bracket.rate;
      previousLimit = bracket.limit;
    } else {
      // Calculate tax for the remaining portion of income
      tax += (income - previousLimit) * bracket.rate;
      break;
    }
  }

  return Math.round(income - tax);
}

// Formats number to dollar string
function formatToMoney(bal) {
  bal = parseFloat(bal);
  return "$" + bal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Calculates inflated price in 'years' years given:
// - value: Initial price
// - inflationRate: Inflation rate per year (as a decimal)
// - years: number of years
function calcInflatedPrice(value, inflationRate, years) {
  if (isNaN(value) || isNaN(inflationRate) || isNaN(years)) return 0;
  return value * (1 + inflationRate) ** years;
}

// Calculates monthly payment for a loan given:
// - P: Principal loan amount
// - R: Monthly interest rate
// - N: Total number of payments
function calcMonthly(P, R, N) {
  return (P * (R * Math.pow(1 + R, N))) / (Math.pow(1 + R, N) - 1);
}

// Returns the sum of an array or 0 if any elements are NaN or null
function sumArr(arr) {
  const inputs = Object.values(arr);
  if (inputs.some((input) => isNaN(input) || input === null)) return 0;
  return inputs.reduce((acc, curr) => acc + Number(curr), 0);
}

module.exports = {
  taxedIncome,
  formatToMoney,
  calcInflatedPrice,
  calcMonthly,
  sumArr,
};
