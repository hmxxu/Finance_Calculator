function calcMonthly(P, R, N) {
  return (P * (R * Math.pow(1 + R, N))) / (Math.pow(1 + R, N) - 1);
}

function taxedIncome(income) {
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

function calcInflatedPrice(value, inflationRate, years) {
  return value * (1 + inflationRate) ** years;
}

function calculateResults(rd, md, cds, mad, med) {
  // How much $ in mortgage and car payments at each year
  const agePayment = new Map();
  // How much $ in mortgage and car down payments at each year
  const ageDownPayment = new Map();
  for (let age = 0; age < 150; age++) {
    agePayment.set(age, 0);
    ageDownPayment.set(age, 0);
  }

  function addPayment(map, age, value) {
    map.set(age, agePayment.get(age) + value);
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

        const res = calculateResults(rd, md2, cds, mad, med)[0];

        if (res && (res[res.length - 1][4] < 0 || res[res.length - 1][5] < 0)) {
          high = mid - 1;
        } else {
          housePrice = mid;
          low = mid + 1;
        }
      }
    }

    const inflatedPrice = calcInflatedPrice(
      housePrice,
      md.inflation / 100,
      md.startAge - rd.currentAge
    );
    const downPaymentValue = (md.downPayment / 100) * inflatedPrice;
    addPayment(ageDownPayment, md.startAge, downPaymentValue);

    mortgageMonthlyPayment = calcMonthly(
      inflatedPrice - downPaymentValue,
      md.interest / 12 / 100,
      md.term * 12
    );

    const startAge = md.startAge;
    const endAge = startAge + md.term;

    for (let age = startAge; age <= endAge; age++) {
      addPayment(agePayment, age, mortgageMonthlyPayment * 12);
    }
  }

  let totalCarPayments = 0;
  // For each car loan add car payments to each year
  cds.forEach((cd) => {
    const inflatedPrice = calcInflatedPrice(
      cd.price,
      cd.inflation / 100,
      cd.startAge - rd.currentAge
    );
    const downPaymentValue = (cd.downPayment / 100) * inflatedPrice;
    const upFrontCost =
      downPaymentValue + cd.fees + (cd.salesTax / 100) * inflatedPrice;
    totalCarPayments += upFrontCost;

    addPayment(ageDownPayment, cd.startAge, upFrontCost);

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
      addPayment(agePayment, age, payment);
    }
  });

  let income = taxedIncome(rd.income);
  let partnerIncome = taxedIncome(mad.income);
  const table = [
    [
      "Age",
      "Income",
      "Mortgage/Car Payment",
      "Total Investmented",
      "Checking",
      "Savings",
    ],
  ];

  const incomeIncrease = rd.incomeIncrease / 100;
  const investReturnRate = rd.investReturnRate / 100;
  const savingContribution = rd.savingsContribution / 100;
  const checkingContribution = rd.checkingContribution / 100;

  let savings = rd.savings;
  let checking = rd.checking;
  let totalInvested = savings;
  let canAfford = true;
  const averageInflationRate = 0.03;

  for (let age = rd.currentAge; age <= rd.lifeExpectancy; age++) {
    // Simulate working/investing years
    if (age < rd.retirementAge) {
      // If married
      if (mad.included && age >= mad.marriageAge) {
        // combine checking and savings account with partner
        if (mad.marriageAge === age) {
          checking += mad.checking;
          savings += mad.savings;
        }
        const adjustedPartnerIncome = calcInflatedPrice(
          partnerIncome,
          incomeIncrease,
          age - rd.currentAge
        );
        checking += adjustedPartnerIncome * checkingContribution;
        checking -=
          calcInflatedPrice(med, averageInflationRate, age - rd.currentAge) *
          12;
        savings += adjustedPartnerIncome * savingContribution;
      }

      checking += income * checkingContribution;
      checking -=
        calcInflatedPrice(med, averageInflationRate, age - rd.currentAge) * 12;
      savings += income * savingContribution;

      checking -= agePayment.get(age);
      savings += savings * investReturnRate;
    } else {
      // Move all balance from checking to savings when retired
      if (age === rd.retirementAge) {
        savings += checking;
        checking = 0;
        income = 0;
      }
      savings -=
        calcInflatedPrice(
          rd.retirementIncomeNeeded,
          averageInflationRate,
          age - rd.currentAge
        ) + rd.retirementIncome;
      // Assuming that partner needs the same retirement income and retirement income needed
      if (mad.included && age >= mad.marriageAge) {
        savings -=
          calcInflatedPrice(
            rd.retirementIncomeNeeded,
            averageInflationRate,
            age - rd.currentAge
          ) + rd.retirementIncome;
      }
      savings -= agePayment.get(age);
      savings += savings * investReturnRate; // If invested money keep compouding durning retirement
    }

    savings -= ageDownPayment.get(age);

    table.push([
      age,
      income,
      agePayment.get(age) + ageDownPayment.get(age),
      totalInvested,
      checking,
      savings,
    ]);

    income += income * incomeIncrease; // Year income increase
    if (savings < 0 || checking < 0) {
      canAfford = false;
      break;
    }
  }

  let results = [];

  if (!canAfford) {
    results.push([
      "Cannot Afford Payments at age " + table[table.length - 1][0],
    ]);
    return [table, results];
  }

  results.push(
    [
      "Saving At Retirement Age (" + rd.retirementAge + ")",
      table[rd.retirementAge - rd.currentAge + 1][
        table[rd.retirementAge - rd.currentAge + 1].length - 1
      ],
    ],
    [
      "Saving At Life Expectancy (" + rd.lifeExpectancy + ")",
      table[rd.lifeExpectancy - rd.currentAge + 1][
        table[rd.lifeExpectancy - rd.currentAge + 1].length - 1
      ],
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
