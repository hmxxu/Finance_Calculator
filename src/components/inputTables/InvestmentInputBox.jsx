import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InputHeader from "./inputTableComponenets/InputHeader";
import Input from "./inputTableComponenets/Input";
import InputButton from "./inputTableComponenets/InputButton";
import InputError from "./inputTableComponenets/InputError";

const InvestmentInputBox = ({ setInvestmentData }) => {
  const [inputValues, setInputValues] = useState({
    startAmount: 1000,
    years: 25,
    contribution: 50,
    contributionPeriod: "per month",
    returnRate: 7.39,
    compoundPeriod: "compounded monthly",
  });

  const [inputsValid, setInputsValid] = useState(true);

  useEffect(() => {
    const { startAmount, years, contribution, returnRate } = inputValues;

    if (
      isNaN(startAmount) ||
      isNaN(years) ||
      isNaN(contribution) ||
      isNaN(returnRate) ||
      Object.values(inputValues).some((value) => value === null)
    ) {
      setInputsValid(false);
    } else {
      setInputsValid(true);
    }
  }, [inputValues]);

  const handleInputChange = (name, value) => {
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  const setContributionPeriod = (newContributionPeriod) => {
    setInputValues({
      ...inputValues,
      contributionPeriod: newContributionPeriod,
    });
  };

  const setCompoundPeriod = (newCompoundPeriod) => {
    setInputValues({
      ...inputValues,
      compoundPeriod: newCompoundPeriod,
    });
  };

  function calculateButton() {
    if (!inputsValid) return;
    setInvestmentData(inputValues);
  }

  return (
    <table className="input-table">
      <InputHeader header="Investment Calculator" />
      <Input
        name="startAmount"
        leftText="Starting Amount"
        leftlabelText="$"
        defaultInput={inputValues.startAmount}
        onInputChange={handleInputChange}
        maxValue={1000000}
        allowDecimal={true}
      />
      <Input
        name="years"
        leftText="Years to Invest"
        defaultInput={inputValues.years}
        onInputChange={handleInputChange}
        maxValue={60}
        allowDecimal={false}
      />
      <Input
        name="contribution"
        leftText="Additional Contributions"
        leftlabelText="$"
        defaultInput={inputValues.contribution}
        selectValues={["per day", "per month", "per quarter", "per year"]}
        defaultSelectedValue={inputValues.contributionPeriod}
        onInputChange={handleInputChange}
        onSelectChange={setContributionPeriod}
        maxValue={1000000}
        allowDecimal={true}
      />
      <Input
        name="returnRate"
        leftText="Estimated Annual Rate of Return"
        defaultInput={inputValues.returnRate}
        rightlabelText="%"
        selectValues={[
          "compounded annually",
          "compounded quarterly",
          "compounded monthly",
          "compounded daily",
        ]}
        defaultSelectedValue={inputValues.compoundPeriod}
        onInputChange={handleInputChange}
        onSelectChange={setCompoundPeriod}
        maxValue={15}
        allowDecimal={true}
      />
      <InputError visible={inputsValid} text="Invalid Input" />
      <InputButton
        calcOnClick={calculateButton}
        resetOnClick={() => window.location.reload()}
      />
    </table>
  );
};

InvestmentInputBox.propTypes = {
  setInvestmentData: PropTypes.func.isRequired,
};

export default InvestmentInputBox;
