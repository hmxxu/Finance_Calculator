import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InputHeader from "./inputTableComponenets/InputHeader";
import Input from "./inputTableComponenets/Input";
import InputButton from "./inputTableComponenets/InputButton";
import FilledInput from "./inputTableComponenets/FilledInput";
import InputError from "./inputTableComponenets/InputError";
const { taxedIncome } = require("../../helperFunctions");

const RetirementInputBox = ({ setRetirementData, homePage }) => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("Invalid Input");

  const [inputValues, setInputValues] = useState({
    currentAge: 22,
    retirementAge: 67,
    lifeExpectancy: 80,
    income: 60000,

    incomeIncrease: 3.58,
    investReturnRate: 7.56,

    savings: 5000,
    savingsContribution: 20,
    checking: 5000,
    checkingContribution: 50,

    retirementIncomeNeeded: 80000,
    retirementIncome: 25000,
  });

  useEffect(() => {
    const hash = window.location.hash;
    const queryString = hash.split("?")[1];

    if (queryString) {
      const queryParams = new URLSearchParams(queryString);
      let data;
      try {
        data = JSON.parse(decodeURIComponent(queryParams.get("rd")));
      } catch (error) {
        throw new Error("Malformed 'rd' parameter: Invalid JSON structure.");
      }
      const keys = [
        "currentAge",
        "retirementAge",
        "lifeExpectancy",
        "income",
        "incomeIncrease",
        "investReturnRate",
        "savings",
        "savingsContribution",
        "checking",
        "checkingContribution",
        "retirementIncomeNeeded",
        "retirementIncome",
      ];
      if (
        data &&
        typeof data === "object" &&
        keys.every((key) => key in data) &&
        !Object.values(data).some((value) => value === null)
      ) {
        setInputValues(data);
      } else {
        console.log("rd params incorrect");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const {
      currentAge,
      retirementAge,
      lifeExpectancy,
      savingsContribution,
      checkingContribution,
    } = inputValues;
    const inputs = Object.values(inputValues);
    if (homePage) setRetirementData(inputValues);

    if (inputs.some((input) => isNaN(input) || input === null)) {
      setErrorMessage("Invalid Input");
      setRetirementData(null);
    } else if (retirementAge >= lifeExpectancy) {
      setErrorMessage(
        "Retirement age can't be greater or equal to life expectancy"
      );
      setRetirementData(null);
    } else if (currentAge >= retirementAge) {
      setErrorMessage(
        "Current age can't be greater or equal to retirement age"
      );
      setRetirementData(null);
    } else if (savingsContribution + checkingContribution > 100) {
      setErrorMessage(
        "Savings and checking contribution must be less than 100%"
      );
      setRetirementData(null);
    } else {
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

  if (loading) return null;

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
      />
      <Input
        name="retirementAge"
        leftText="Planned Retirement Age"
        defaultInput={inputValues.retirementAge}
        onInputChange={handleInputChange}
        maxValue={120}
      />
      <Input
        name="lifeExpectancy"
        leftText="Life expectancy"
        defaultInput={inputValues.lifeExpectancy}
        onInputChange={handleInputChange}
        maxValue={150}
      />
      <Input
        name="income"
        leftText="Current Income"
        leftlabelText="$"
        defaultInput={inputValues.income}
        rightText="/year"
        onInputChange={handleInputChange}
        maxValue={1000000}
      />
      <FilledInput
        leftText="Taxed Income"
        infoText="Income after federal income tax based on income bracket"
        leftlabelText="$"
        inputValue={taxedIncome(inputValues.income)}
        rightText="/year"
      />
      <tbody style={{ height: "5px" }} />
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
        name="investReturnRate"
        leftText="Average Investment Return"
        defaultInput={inputValues.investReturnRate}
        rightlabelText="%"
        rightText="/year"
        onInputChange={handleInputChange}
        maxValue={100}
        allowDecimal={true}
      />
      <tbody style={{ height: "5px" }} />
      <InputHeader header="Budgeting" />
      <Input
        name="savings"
        leftText="Current Savings Balance"
        infoText="This account will be drawn from for down payments and during retirement"
        leftlabelText="$"
        defaultInput={inputValues.savings}
        onInputChange={handleInputChange}
        maxValue={1000000}
      />
      <Input
        name="savingsContribution"
        leftText="Yearly Savings Contribution"
        defaultInput={inputValues.savingsContribution}
        rightlabelText="%"
        rightText="/year"
        onInputChange={handleInputChange}
        maxValue={100}
        allowDecimal={true}
      />
      {homePage && (
        <Input
          name="checking"
          leftText="Current Checking Balance"
          infoText="This account will be drawn from for monthly expenses and monthly car and mortgage payments"
          leftlabelText="$"
          defaultInput={inputValues.checking}
          onInputChange={handleInputChange}
          maxValue={1000000}
        />
      )}
      {homePage && (
        <Input
          name="checkingContribution"
          leftText="Yearly Checking Contribution"
          defaultInput={inputValues.checkingContribution}
          rightlabelText="%"
          rightText="/year"
          onInputChange={handleInputChange}
          maxValue={100}
          allowDecimal={true}
        />
      )}
      <tbody style={{ height: "5px" }} />
      <InputHeader header="Retirement Assumptions" />
      <Input
        name="retirementIncomeNeeded"
        leftText="Income Needed in Retirement"
        leftlabelText="$"
        defaultInput={inputValues.retirementIncomeNeeded}
        infoText="In order to maintain the same lifestyle you will need 80% of your preretirement income"
        rightText="/year"
        onInputChange={handleInputChange}
        maxValue={10000000}
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
      />
      <InputError visible={errorMessage !== ""} text={errorMessage} />
      {!homePage ? (
        <InputButton
          calcOnClick={calculateButton}
          resetOnClick={() => window.location.reload()}
        />
      ) : (
        <tbody style={{ height: "15px" }} />
      )}
    </table>
  );
};

RetirementInputBox.propTypes = {
  setRetirementData: PropTypes.func.isRequired,
  homePage: PropTypes.bool,
};

export default RetirementInputBox;
