import PropTypes from "prop-types";

function createRows(
  balance,
  years,
  contribution,
  contributionPeriod,
  returnRate,
  compoundPeriod
) {
  const propTypes = {
    balance: PropTypes.number.isRequired,
    years: PropTypes.number.isRequired,
    contribution: PropTypes.number.isRequired,
    contributionPeriod: PropTypes.oneOf([
      "per year",
      "per quarter",
      "per month",
      "per day",
    ]).isRequired,
    returnRate: PropTypes.number.isRequired,
    compoundPeriod: PropTypes.oneOf([
      "compounded annually",
      "compounded quarterly",
      "compounded monthly",
      "compounded daily",
    ]).isRequired,
  };

  PropTypes.checkPropTypes(
    propTypes,
    {
      balance,
      years,
      contribution,
      contributionPeriod,
      returnRate,
      compoundPeriod,
    },
    "argument",
    "createRows"
  );
  returnRate /= 100;

  const Rows = [
    [
      "Year",
      "Yearly Investment",
      "Total Investment",
      "Yearly Earnings",
      "Total Earnings",
      "Balance",
    ],
    [0, balance, balance, 0, 0, balance],
  ];
  const startBal = balance;

  const mapping1 = {
    "compounded annually": 365,
    "compounded quarterly": 91,
    "compounded monthly": 30,
    "compounded daily": 1,
    "per year": 365,
    "per quarter": 91,
    "per month": 30,
    "per day": 1,
  };

  const i = mapping1[compoundPeriod];
  const k = mapping1[contributionPeriod];

  const mapping2 = {
    "compounded annually": 1,
    "compounded quarterly": 4,
    "compounded monthly": 12,
    "compounded daily": 365,
    "per year": 1,
    "per quarter": 4,
    "per month": 12,
    "per day": 365,
  };

  const compoundPeriods = mapping2[compoundPeriod];
  const contributionPeriods = mapping2[contributionPeriod];

  for (let year = 1; year <= years; year++) {
    const oldBalance = balance;

    // Simulate everyday of the year
    for (let day = 1; day < 366; day++) {
      if (day % i === 0) balance += balance * (returnRate / compoundPeriods);
      if (day % k === 0) balance += contribution;
    }
    balance = Math.round(balance * 100) / 100;
    const investment = contribution * contributionPeriods;
    const totalInvestment =
      startBal + contribution * contributionPeriods * year;
    const earnings = balance - oldBalance - contribution * contributionPeriods;
    const totalEarnings =
      balance - (startBal + contribution * contributionPeriods * year);
    Rows.push([
      year,
      investment,
      totalInvestment,
      earnings,
      totalEarnings,
      balance,
    ]);
  }
  return Rows;
}

export { createRows };
