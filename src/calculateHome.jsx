function calcMonthly(P, R, N) {
  return (P * (R * Math.pow(1 + R, N))) / (Math.pow(1 + R, N) - 1);
}

function taxIncome(income) {
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

function calculateResults(rd, md, cds) {
  // How much $ you have to pay at every year
  const agePayment = new Map();
  for (let age = 0; age < 150; age++) {
    agePayment.set(age, 0);
  }

  function addPayment(age, value) {
    agePayment.set(age, agePayment.get(age) + value);
  }

  let housePrice = md.price;
  let mortgageMonthlyPayment;

  // Add mortgage payment is included
  if (md.included) {
    if (md.priceType === "max") {
      // Use 2 pointer algorithm to find max house price
      let low = 0;
      let high = 100000000;
      housePrice = low;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const md2 = { ...md };
        md2.priceType = "normal";
        md2.price = mid;

        const res = calculateResults(rd, md2, cds)[0];

        if (res[res.length - 1][5] < 0) {
          high = mid - 100;
        } else {
          housePrice = mid;
          low = mid + 100;
        }
      }
    }

    const inflatedPrice =
      housePrice * (1 + md.inflation / 100) ** (md.startAge - rd.currentAge);
    const downPaymentValue = (md.downPayment / 100) * inflatedPrice;
    addPayment(md.startAge, downPaymentValue);

    mortgageMonthlyPayment = calcMonthly(
      inflatedPrice - downPaymentValue,
      md.interest / 12 / 100,
      md.term * 12
    );

    const startAge = md.startAge;
    const endAge = startAge + md.term;

    for (let age = startAge; age <= endAge; age++) {
      addPayment(age, mortgageMonthlyPayment * 12);
    }
  }

  let totalCarPayments = 0;
  // For each car loan add car payments to each year
  cds.forEach((cd) => {
    const inflatedPrice =
      cd.price * (1 + cd.inflation / 100) ** (cd.startAge - rd.currentAge);
    const downPaymentValue = (cd.downPayment / 100) * inflatedPrice;
    const upFrontCost =
      downPaymentValue + cd.fees + (cd.salesTax / 100) * inflatedPrice;
    totalCarPayments += upFrontCost;

    addPayment(cd.startAge, upFrontCost);

    const carLoanMonthlyPayment = calcMonthly(
      inflatedPrice - downPaymentValue,
      cd.interest / 12 / 100,
      cd.term
    );

    totalCarPayments += carLoanMonthlyPayment * cd.term;

    const startAge = cd.startAge;
    const endAge = cd.startAge + Math.ceil(cd.term / 12);

    for (let age = startAge; age <= endAge; age++) {
      let payment = 0;
      if (cd.startAge + Math.ceil(cd.term / 12) === age) {
        // Last year of loan
        payment = carLoanMonthlyPayment * (cd.term % 12);
      } else {
        payment = carLoanMonthlyPayment * 12;
      }
      addPayment(age, payment);
    }
  });

  const table = [
    [
      "Age",
      "Contribution",
      "Distribution",
      "Mortgage/Car Payment",
      "Total Investmented",
      "Balance",
    ],
    [rd.currentAge, 0, 0, 0, rd.savings, rd.savings],
  ];

  const incomeIncrease = rd.incomeIncrease / 100;
  const investReturnRate = rd.investReturnRate / 100;
  const yearlyContribution = rd.yearlyContribution / 100;
  let income = taxIncome(rd.income); // Change to taxed income
  let savings = rd.savings;
  let totalInvested = savings;

  for (let age = rd.currentAge + 1; age <= rd.lifeExpectancy; age++) {
    var contribution = 0;
    var distribution = age < rd.retirementAge ? 0 : rd.retirementIncomeNeeded;

    // Simulate working/investing years
    if (age < rd.retirementAge) {
      savings += savings * investReturnRate; // Yearly invesetment return
      contribution = income * yearlyContribution;
      savings += contribution; // Yearly contribution
      income += income * incomeIncrease; // Year income increase

      totalInvested += contribution;
    } else {
      contribution = rd.retirementIncome;
      savings -= rd.retirementIncomeNeeded + rd.retirementIncome;
      savings += savings * investReturnRate; // If invested money keep compouding durning retirement
    }
    savings -= agePayment.get(age);

    table.push([
      age,
      contribution,
      distribution,
      agePayment.get(age),
      totalInvested,
      savings,
    ]);
    if (savings < 0) break;
  }

  var results = [];

  if (table[table.length - 1][5] < 0) {
    results.push([
      "Cannot Afford Payments at age " + table[table.length - 1][0],
    ]);
    return [table, results];
  }

  results.push(
    [
      "Saving At Retirement Age (" + rd.retirementAge + ")",
      table[rd.retirementAge - rd.currentAge + 1][5],
    ],
    [
      "Saving At Life Expectancy (" + rd.lifeExpectancy + ")",
      table[rd.lifeExpectancy - rd.currentAge + 1][5],
    ]
  );

  if (md.included) {
    results.push(["Mortgage Monthly Payments", mortgageMonthlyPayment]);
    if (md.priceType === "max")
      results.push(["Maximum house price", housePrice]);
    results.push([
      "Total Paid for House",
      mortgageMonthlyPayment * md.term * 12 +
        (md.downPayment * housePrice) / 100,
    ]);
  }

  if (cds.length > 0) results.push(["Total in Car Payments", totalCarPayments]);

  return [table, results];
}

export { calculateResults };
