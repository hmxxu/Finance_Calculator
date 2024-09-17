import PropTypes from "prop-types";
import { calcMonthly } from "./helperFunctions";

function calculateResults(price, downPayment, term, interest) {
  const propTypes = {
    price: PropTypes.number.isRequired,
    downPayment: PropTypes.number.isRequired,
    term: PropTypes.number.isRequired,
    interest: PropTypes.number.isRequired,
  };

  PropTypes.checkPropTypes(
    propTypes,
    {
      price,
      downPayment,
      term,
      interest,
    },
    "argument",
    "calculateResults"
  );

  const downPaymentNum = (price * downPayment) / 100;
  const P = price - downPaymentNum; // Principal loan amount
  const R = interest / 12 / 100; // Monthly interest rate (annual rate divided by 12 and converted to a decimal)
  const N = term * 12; // Total number of payments (loan term in months)

  // Monthly payment calculation using the formula
  const monthlyPayment = calcMonthly(P, R, N);

  // Total amount paid over the loan term
  const totalAmountPaid = monthlyPayment * N;

  // Total interest paid over the loan term
  const totalInterestPaid = totalAmountPaid - P;

  const results = [
    ["Monthly Payments", monthlyPayment],
    ["Loan Amount", P],
    ["Total Loan Interest", totalInterestPaid],
    ["Final Cost", totalAmountPaid + downPaymentNum],
  ];

  const table = [
    ["Year", "Interest", "Total Paid", "Remaining"],
    [0, 0, downPaymentNum, P],
  ];
  let balance = P;
  for (let year = 1; year <= term; year++) {
    let yearlyInterest = 0;
    for (let month = 1; month <= 12; month++) {
      const interestForMonth = balance * R;
      yearlyInterest += interestForMonth;
      const principalPayment = monthlyPayment - interestForMonth;
      balance -= principalPayment;
    }
    table.push([
      year,
      parseInt(yearlyInterest.toFixed(2)),
      parseInt((monthlyPayment * 12 * year + downPaymentNum).toFixed(2)),
      parseInt(balance.toFixed(2)),
    ]);
  }

  return [table, results];
}

export { calculateResults };
