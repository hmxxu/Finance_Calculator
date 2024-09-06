import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InputHeader from "./inputTableComponenets/InputHeader";
import Input from "./inputTableComponenets/Input";
import InputError from "./inputTableComponenets/InputError";
import IncludeExcludeButtons from "./inputTableComponenets/IncludeExcludeButtons";

const MarriageInputBox = ({ setMarriageData, currentAge, lifeExpetency }) => {
  const [inputValues, setInputValues] = useState({
    marriageAge: 30,
    savings: 120000,
    checking: 35000,
    income: 60000,
    included: true,
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const { marriageAge } = inputValues;

    const inputs = Object.values(inputValues);
    if (inputs.some((input) => isNaN(input) || input === null)) {
      setErrorMessage("Invalid Input");
    } else if (marriageAge > lifeExpetency) {
      setErrorMessage(
        "Life expectancy must be less than or equal to marriage age"
      );
    } else if (marriageAge < currentAge) {
      setErrorMessage("Current age must be greater than marriage age");
    } else {
      setErrorMessage("");
      setMarriageData(inputValues);
    }
  }, [inputValues, currentAge, lifeExpetency, setMarriageData]);

  const handleInputChange = (name, value) => {
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  const setIncluded = (boo) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      included: boo,
    }));
  };

  return (
    <div style={{ position: "relative" }}>
      <table className="input-table">
        <InputHeader header="Marriage Inputs" />
        <Input
          name="marriageAge"
          leftText="Marriage Age"
          infoText="The age that you get married"
          defaultInput={inputValues.marriageAge}
          onInputChange={handleInputChange}
          maxValue={150}
        />
        <Input
          name="savings"
          leftText="Savings Contribution"
          infoText="The savings contribution at marriage"
          defaultInput={inputValues.savings}
          leftlabelText="$"
          onInputChange={handleInputChange}
          maxValue={1000000}
        />
        <Input
          name="checking"
          leftText="Checking Contribution"
          infoText="The checking contribution at marriage"
          defaultInput={inputValues.checking}
          leftlabelText="$"
          onInputChange={handleInputChange}
          maxValue={1000000}
        />
        <Input
          name="income"
          leftText="Income at Marriage Age"
          infoText="We assume the partner has the same: checking and savings contribution %, monthly expenses, income increase, retirement income, retirement income needed"
          leftlabelText="$"
          defaultInput={inputValues.income}
          rightText="/year"
          onInputChange={handleInputChange}
          maxValue={1000000}
        />
        <InputError visible={errorMessage !== ""} text={errorMessage} />
        <tbody style={{ height: "20px" }} />
        <IncludeExcludeButtons setIncluded={setIncluded} />
      </table>
      <div
        className="overlay"
        style={{ visibility: inputValues.included ? "hidden" : "visible" }}
      />
    </div>
  );
};

MarriageInputBox.propTypes = {
  setMarriageData: PropTypes.func.isRequired,
  currentAge: PropTypes.number.isRequired,
  lifeExpetency: PropTypes.number.isRequired,
};

export default MarriageInputBox;
