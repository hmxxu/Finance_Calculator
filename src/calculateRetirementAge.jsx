import PropTypes from "prop-types";

// Formats balance into a money string with $ and commas
function formatToMoney(bal) {
  bal = parseFloat(bal);
  return "$" + bal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function taxIncome(income) {
  if (isNaN(income)) return 0;
  const brackets = [
    { limit: 11000, rate: 0.9 },
    { limit: 44725, rate: 0.88 },
    { limit: 95375, rate: 0.78 },
    { limit: 182100, rate: 0.76 },
    { limit: 231250, rate: 0.68 },
    { limit: 578125, rate: 0.65 },
    { limit: Infinity, rate: 0.63 },
  ];

  const bracket = brackets.find((b) => income <= b.limit);
  return income * bracket.rate;
}

function calculateResults(
  currentAge,
  retirementAge,
  lifeExpectancy,
  income,
  incomeIncrease,
  retirementIncomeNeeded,
  investReturnRate,
  savings,
  yearlyContribution,
  retirementIncome
) {
  const propTypes = {
    currentAge: PropTypes.number.isRequired,
    retirementAge: PropTypes.number.isRequired,
    lifeExpectancy: PropTypes.number.isRequired,
    income: PropTypes.number.isRequired,
    incomeIncrease: PropTypes.number.isRequired,
    retirementIncomeNeeded: PropTypes.number.isRequired,
    investReturnRate: PropTypes.number.isRequired,
    savings: PropTypes.number.isRequired,
    yearlyContribution: PropTypes.number.isRequired,
    retirementIncome: PropTypes.number.isRequired,
  };

  PropTypes.checkPropTypes(
    propTypes,
    {
      currentAge,
      retirementAge,
      lifeExpectancy,
      income,
      incomeIncrease,
      retirementIncomeNeeded,
      investReturnRate,
      savings,
      yearlyContribution,
      retirementIncome,
    },
    "argument",
    "calculateResults"
  );
  income = taxIncome(income);
  incomeIncrease /= 100;
  investReturnRate /= 100;
  yearlyContribution /= 100;

  const startBal = savings;
  const table = [
    [
      "Age",
      "Contribution",
      "Distribution",
      "Total Investment",
      "Total Earnings",
      "Savings",
    ],
  ];

  // Simulate working/investing years
  for (let age = currentAge; age < retirementAge; age++) {
    savings += savings * investReturnRate;
    savings += income * yearlyContribution;
    const preInvested =
      table.length === 1 ? startBal : parseInt(table[table.length - 1][3]);

    const contribution = income * yearlyContribution;

    savings = Math.round(savings * 100) / 100;

    const totalInvestment = preInvested + contribution;

    const totalEarnings = savings - totalInvestment;
    table.push([age, contribution, 0, totalInvestment, totalEarnings, savings]);

    income += income * incomeIncrease;
  }

  // Simulate retirement years
  for (let age = retirementAge; age <= lifeExpectancy; age++) {
    savings -= retirementIncomeNeeded + retirementIncome;
    savings += savings * investReturnRate; // If rest of money stays in invested
    savings = Math.round(savings * 100) / 100;
    const totalInvestment = table[table.length - 1][3];
    const totalEarnings = table[table.length - 1][4];
    table.push([
      age,
      0,
      retirementIncomeNeeded,
      totalInvestment,
      totalEarnings,
      savings,
    ]);
  }

  var results;

  if (table[lifeExpectancy - currentAge + 1][5] >= 0) {
    // If person has funds to retire
    // Calculate earliest possible retirement age
    var earliest = -999;
    for (let i = 0; i < table.length; i++) {
      if (
        table[i][5] >=
        retirementIncomeNeeded * (lifeExpectancy - table[i][0])
      ) {
        earliest = table[i][0];
        break;
      }
    }
    results = [
      [
        "Saving at retirement age (" + retirementAge + ")",
        table[retirementAge - currentAge][5],
      ],
      [
        "Saving at life expectancy (" + lifeExpectancy + ")",
        table[lifeExpectancy - currentAge + 1][5],
      ],
      ["Total money Invested", table[retirementAge - currentAge][3]],
      [
        "Total money earned from interest at retirement age (" +
          retirementAge +
          ")",
        table[retirementAge - currentAge][4],
      ],
      [
        "Earliest retirement age spending " +
          formatToMoney(retirementIncomeNeeded) +
          "/year in retirement",
        earliest.toString(),
      ],
    ];
  } else {
    // If person DOESN'T have funds to retire
    results = [
      [
        "In order to retire at " + retirementAge + " you need",
        table[table.length - 1][5] * -1,
      ],
    ];
  }

  return [table, results];
}

export { calculateResults };
