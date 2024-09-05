import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InputHeader from "./inputTableComponenets/InputHeader";
import Input from "./inputTableComponenets/Input";
import InputButton from "./inputTableComponenets/InputButton";
import FilledInput from "./inputTableComponenets/FilledInput";

const RetirementInputBox = ({ setRetirementData, homePage }) => {
  const [inputValues, setInputValues] = useState({
    currentAge: 22,
    retirementAge: 67,
    lifeExpectancy: 80,
    income: 60000,
    incomeIncrease: 3.58,
    retirementIncomeNeeded: 80000,
    investReturnRate: 10.16,
    savings: 10000,
    yearlyContribution: 40,
    retirementIncome: 25000,
  });

  const [errorMessage, setErrorMessage] = useState("Invalid Input");

  useEffect(() => {
    const { currentAge, retirementAge, lifeExpectancy } = inputValues;
    const inputs = Object.values(inputValues);

    if (inputs.some((input) => isNaN(input) || input === null)) {
      setErrorMessage("Invalid Input");
    } else if (retirementAge >= lifeExpectancy) {
      setErrorMessage(
        "Retirement age can't be greater or equal to life expectancy"
      );
    } else if (currentAge >= retirementAge) {
      setErrorMessage(
        "Current age can't be greater or equal to retirement age"
      );
    } else {
      if (homePage) {
        setRetirementData(inputValues);
      }
      setErrorMessage("");
    }
  }, [inputValues, homePage, setRetirementData]);

  const handleInputChange = (name, value) => {
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  function calculateButton() {
    if (errorMessage !== "") return;
    setRetirementData(inputValues);
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
    return Math.round(income * bracket.rate);
  }

  return (
    <table
      className="input-table"
      style={{ paddingBottom: homePage ? "10px" : "0px" }}
    >
      <InputHeader
        header={homePage ? "Retirement Inputs" : "Retirement Calculator"}
      />
      <Input
        name="currentAge"
        leftText="Current Age"
        defaultInput={inputValues.currentAge}
        onInputChange={handleInputChange}
        maxValue={120}
        allowDecimal={false}
      />
      <Input
        name="retirementAge"
        leftText="Planned Retirement Age"
        defaultInput={inputValues.retirementAge}
        onInputChange={handleInputChange}
        maxValue={120}
        allowDecimal={false}
      />
      <Input
        name="lifeExpectancy"
        leftText="Life expectancy"
        defaultInput={inputValues.lifeExpectancy}
        onInputChange={handleInputChange}
        maxValue={150}
        allowDecimal={false}
      />
      <Input
        name="income"
        leftText="Current Income"
        leftlabelText="$"
        defaultInput={inputValues.income}
        rightText="/year"
        onInputChange={handleInputChange}
        maxValue={1000000}
        allowDecimal={false}
      />
      <FilledInput
        leftText="Taxed Income"
        infoText="Income after federal income tax based on income bracket"
        leftlabelText="$"
        inputValue={taxIncome(inputValues.income)}
        rightText="/year"
      />
      <tbody>
        <tr>
          <td style={{ paddingTop: "10px" }}></td>
        </tr>
      </tbody>
      <InputHeader header="Assumptions" />
      <Input
        name="incomeIncrease"
        leftText="Current Income Increase"
        defaultInput={inputValues.incomeIncrease}
        infoText="Your salary increase per year"
        rightlabelText="%"
        rightText="/year"
        onInputChange={handleInputChange}
        maxValue={10}
        allowDecimal={true}
      />
      <Input
        name="retirementIncomeNeeded"
        leftText="Income Needed After Retirement"
        leftlabelText="$"
        defaultInput={inputValues.retirementIncomeNeeded}
        infoText="In order to maintain the same lifestyle you will need 80% of your preretirement income"
        rightText="/year"
        onInputChange={handleInputChange}
        maxValue={10000000}
        allowDecimal={false}
      />
      <Input
        name="investReturnRate"
        leftText="Average Investment Return"
        defaultInput={inputValues.investReturnRate}
        rightlabelText="%"
        rightText="/year"
        onInputChange={handleInputChange}
        maxValue={100}
        allowDecimal={true}
      />
      <tbody>
        <tr>
          <td style={{ paddingTop: "10px" }}></td>
        </tr>
      </tbody>
      <InputHeader header="Payments" />
      <Input
        name="savings"
        leftText="Current Retirement Savings"
        leftlabelText="$"
        defaultInput={inputValues.savings}
        onInputChange={handleInputChange}
        maxValue={1000000}
        allowDecimal={false}
      />
      <Input
        name="yearlyContribution"
        leftText="Yearly Retirement Contribution"
        defaultInput={inputValues.yearlyContribution}
        rightlabelText="%"
        rightText="/year"
        onInputChange={handleInputChange}
        maxValue={100}
        allowDecimal={true}
      />
      <Input
        name="retirementIncome"
        leftText="Retirement Income"
        leftlabelText="$"
        defaultInput={inputValues.retirementIncome}
        rightText="/year"
        onInputChange={handleInputChange}
        infoText="This is any other income durning retire (social security, pension, etc)"
        maxValue={1000000}
        allowDecimal={false}
      />
      <tbody>
        <tr>
          <td
            colSpan="5"
            style={{
              textAlign: "center",
              visibility: errorMessage !== "" ? "visible" : "hidden",
              width: "100%",
            }}
          >
            <div className="inputs-error-message">{errorMessage}</div>
          </td>
        </tr>
      </tbody>

      {!homePage && (
        <InputButton
          calcOnClick={calculateButton}
          resetOnClick={() => window.location.reload()}
        />
      )}
    </table>
  );
};

RetirementInputBox.propTypes = {
  setRetirementData: PropTypes.func.isRequired,
  homePage: PropTypes.bool,
};

export default RetirementInputBox;
