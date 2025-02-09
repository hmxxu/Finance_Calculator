import {
  taxedIncome,
  calcMonthly,
  calcInflatedPrice,
  sumArr,
} from "./helperFunctions";

// Adds payment to a map given a map, age, and value to add
function addPayment(map, age, value) {
  map.set(age, map.get(age) + value);
}

// Calculates and returns the financial data based on the input parameters
// - rd: Retirement data
// - md: Mortgage data
// - cds: Car data (could be an array of car-related financial information)
// - mad: Marriage data
// - med: Monthly expense data
function calculateResults(rd, md, cds, mad, med) {
  // How much $ in mortgage and car payments at each year
  const paymentAtAge = new Map(
    Array.from({ length: 150 }, (_, age) => [age, 0])
  );
  // How much $ in mortgage and car down payments at each year
  const downPaymentAtAge = new Map(
    Array.from({ length: 150 }, (_, age) => [age, 0])
  );
  // How much $ in child payments at each year
  const childPaymentAtAge = new Map(
    Array.from({ length: 150 }, (_, age) => [age, 0])
  );
  // What years they take off to take care of child
  const careerBreakAtAge = new Map(
    Array.from({ length: 150 }, (_, age) => [age, false])
  );

  if (mad.included && mad.childAges.length > 0) {
    mad.childAges.forEach((childAge) => {
      for (let age = childAge; age < childAge + 18; age++) {
        addPayment(childPaymentAtAge, age, mad.childCostPerYear);
      }
    });
    const startAge = Math.min(...mad.childAges);
    const endAge = startAge + mad.yearsOff;

    for (let age = startAge; age <= endAge; age++) {
      careerBreakAtAge.set(age, true);
    }
  }
  let housePrice = md.price;
  let mortgageMonthlyPayment;

  // Use 2 pointer algorithm to find max house price
  if (md.included && md.priceType === "max") {
    let low = 0;
    let high = 100000000;
    housePrice = low;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const md2 = { ...md };
      md2.priceType = "normal";
      md2.price = mid;

      const [res] = calculateResults(rd, md2, cds, mad, med) || [];
      const lastRow = res?.[res.length - 1];
      const [checkingBalance, savingsBalance] = lastRow?.slice(-2) || [];

      if (checkingBalance < 0 || savingsBalance < 0) {
        high = mid - 1;
      } else {
        housePrice = mid;
        low = mid + 1;
      }
    }
  }

  if (md.included) {
    const inflatedPrice = calcInflatedPrice(
      housePrice,
      md.inflation / 100,
      md.startAge - rd.currentAge
    );
    const downPaymentValue = (md.downPayment / 100) * inflatedPrice;
    addPayment(downPaymentAtAge, md.startAge, downPaymentValue);

    mortgageMonthlyPayment = calcMonthly(
      inflatedPrice - downPaymentValue,
      md.interest / 12 / 100,
      md.term * 12
    );

    const startAge = md.startAge;
    const endAge = startAge + md.term;

    for (let age = startAge; age <= endAge; age++) {
      addPayment(paymentAtAge, age, mortgageMonthlyPayment * 12);
    }
  }

  // The total amount spend on cars
  let totalCarPaymentValues = 0;
  // For each car loan add car payments to each year
  cds.forEach((cd) => {
    const inflatedPrice = calcInflatedPrice(
      cd.price,
      cd.inflation / 100,
      cd.startAge - rd.currentAge
    );
    const downPaymentValue = (cd.downPayment / 100) * inflatedPrice;
    addPayment(downPaymentAtAge, cd.startAge, downPaymentValue);
    addPayment(
      paymentAtAge,
      cd.startAge,
      cd.fees + (cd.salesTax / 100) * inflatedPrice
    );

    totalCarPaymentValues +=
      downPaymentValue + cd.fees + (cd.salesTax / 100) * inflatedPrice;

    const carLoanMonthlyPayment = calcMonthly(
      inflatedPrice - downPaymentValue,
      cd.interest / 12 / 100,
      cd.term
    );

    totalCarPaymentValues += carLoanMonthlyPayment * cd.term;

    const startAge = cd.startAge;
    const endAge = cd.startAge + Math.ceil(cd.term / 12);

    for (let age = startAge; age < endAge; age++) {
      addPayment(paymentAtAge, age, carLoanMonthlyPayment * 12);
    }
    // If there are any left over months in the car loan
    if (cd.term % 12) {
      addPayment(paymentAtAge, endAge, carLoanMonthlyPayment * (cd.term % 12));
    }
  });

  let income = taxedIncome(rd.income);
  let partnerIncome = taxedIncome(mad.income);
  let totalChildPayments = 0;

  const table = [
    [
      "Age",
      "Income",
      "Checking Contribution",
      "Savings Contribution",
      "Mortgage/Car Payment",
      "Checking",
      "Savings",
    ],
  ];

  const incomeIncrease = rd.incomeIncrease / 100;
  const savingContribution = rd.savingsContribution / 100;
  const checkingContribution = rd.checkingContribution / 100;

  let savings = rd.savings;
  let checking = rd.checking;
  let canAfford = true;
  const averageInflationRate = 0.03;

  for (let age = rd.currentAge; age <= rd.lifeExpectancy; age++) {
    let totalCheckingContribution = 0;
    let totalSavingsContribution = 0;
    const marriageStatus =
      !mad.included || age < mad.marriageAge
        ? "single"
        : age < mad.divorceAge || mad.divorceAge == null
        ? "married"
        : "divorced";

    // Only the person with a higher income contribute durning career break
    const makeMore = income > partnerIncome;

    // Combine checking and savings account with partner
    if (mad.included && mad.marriageAge === age) {
      totalCheckingContribution += mad.checking;
      totalSavingsContribution += mad.savings;
    } else if (mad.included && mad.divorceAge === age) {
      // Cut checking and savings in half if divorced
      checking /= 2;
      savings /= 2;
    }

    // Move all balance from checking to savings when retired
    if (age === rd.retirementAge) {
      savings += checking;
      checking = 0;
      income = 0;
      partnerIncome = 0;
    }

    // Simulate working/investing years
    if (age < rd.retirementAge) {
      // Partner contributions
      if (marriageStatus === "married") {
        // If partner makes more or not on a career break can contribute
        if (!makeMore || !careerBreakAtAge.get(age)) {
          totalCheckingContribution += partnerIncome * checkingContribution;
          totalSavingsContribution += partnerIncome * savingContribution;
        }
      }

      // Personal contributions (if not on career break)
      if (
        !careerBreakAtAge.get(age) ||
        (makeMore && marriageStatus === "married")
      ) {
        totalCheckingContribution += income * checkingContribution;
        totalSavingsContribution += income * savingContribution;
      } else if (careerBreakAtAge.get(age) && marriageStatus === "divorced") {
        // If the career break is happening while divorced only get half of the income
        totalCheckingContribution += (income * checkingContribution) / 2;
        totalSavingsContribution += (income * savingContribution) / 2;
      }

      // Monthly expenses
      checking -=
        calcInflatedPrice(
          sumArr(med),
          averageInflationRate,
          age - rd.currentAge
        ) *
        12 *
        (marriageStatus === "married" ? 2 : 1);

      // Car, mortgage from checking when not retired
      checking -= paymentAtAge.get(age);

      // Child Payments
      checking -=
        childPaymentAtAge.get(age) / (marriageStatus === "divorced" ? 2 : 1);
    } else {
      // Retirement income needed taken from the savings (partner needs same amount)
      savings -=
        calcInflatedPrice(
          rd.retirementIncomeNeeded,
          averageInflationRate,
          age - rd.currentAge
        ) * (marriageStatus === "married" ? 2 : 1);

      // Retirement Income (partner has same amount)
      totalSavingsContribution +=
        rd.retirementIncome * (marriageStatus === "married" ? 2 : 1);

      // Car, mortage from savings when retired
      savings -= paymentAtAge.get(age) + childPaymentAtAge.get(age);

      // Child Payments
      savings -=
        childPaymentAtAge.get(age) / (marriageStatus === "divorced" ? 2 : 1);
    }

    totalChildPayments +=
      childPaymentAtAge.get(age) / (marriageStatus === "divorced" ? 2 : 1);

    // Down payments (always from from savings)
    savings -= downPaymentAtAge.get(age);

    savings += totalSavingsContribution;
    checking += totalCheckingContribution;

    // Investment return on savings
    savings += savings * (rd.investReturnRate / 100);

    table.push([
      age,
      income,
      totalCheckingContribution,
      totalSavingsContribution,
      paymentAtAge.get(age) + downPaymentAtAge.get(age),
      checking,
      savings,
    ]);

    // Income increase (partner has same amount)
    income += income * incomeIncrease;
    if (marriageStatus === "married")
      partnerIncome += partnerIncome * incomeIncrease;

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
      "Savings At Retirement Age (" + rd.retirementAge + ")",
      table[rd.retirementAge - rd.currentAge + 1][
        table[rd.retirementAge - rd.currentAge + 1].length - 1
      ],
    ],
    [
      "Savings At Life Expectancy (" + rd.lifeExpectancy + ")",
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
        housePrice * (md.downPayment / 100),
    ]);
  }

  if (cds.length > 0)
    results.push(["Total in Car Payments", totalCarPaymentValues]);

  if (mad.childAges.length > 0)
    results.push(["Total in Child Payments", totalChildPayments]);

  return [table, results];
}

export { calculateResults };
