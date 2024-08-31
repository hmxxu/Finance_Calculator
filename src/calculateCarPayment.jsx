import PropTypes from "prop-types";

function calculateResults(price, term, interest, downPayment, salesTax, fees) {
  const propTypes = {
    price: PropTypes.number.isRequired,
    term: PropTypes.number.isRequired,
    interest: PropTypes.number.isRequired,
    downPayment: PropTypes.number.isRequired,
    salesTax: PropTypes.number.isRequired,
    fees: PropTypes.number.isRequired,
  };

  PropTypes.checkPropTypes(
    propTypes,
    { price, term, interest, downPayment, salesTax, fees },
    "argument",
    "calculateResults"
  );
  const downPaymentValue = price * (downPayment / 100);

  const P = price - downPaymentValue; // Principal loan amount
  const R = interest / 12 / 100; // Monthly interest rate (annual rate divided by 12 and converted to a decimal)
  const N = term; // Total number of payments (loan term in months)

  // Monthly payment calculation using the formula
  const monthlyPayment =
    (P * (R * Math.pow(1 + R, N))) / (Math.pow(1 + R, N) - 1);

  // Total amount paid over the loan term
  const totalAmountPaid = monthlyPayment * N;

  // Total interest paid over the loan term
  const totalInterestPaid = totalAmountPaid - P;

  // Total Sales Tax
  const totalSalesTax = (price * salesTax) / 100;

  // Total Upfront Payment
  const upfrontPayment = downPaymentValue + fees + totalSalesTax;

  return [
    ["Monthly Payments", monthlyPayment],
    ["Loan Amount", P],
    ["Sales Tax", totalSalesTax],
    ["Upfront Payment", upfrontPayment],
    ["Total Loan Interest", totalInterestPaid],
    ["Final Cost", totalAmountPaid + upfrontPayment],
  ];
}

export { calculateResults };
