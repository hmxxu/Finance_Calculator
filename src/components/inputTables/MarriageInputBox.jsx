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
    savings: 100000,
    yearlyContribution: 12000,
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
          name="yearlyContribution"
          leftText="Yearly Contribution"
          defaultInput={inputValues.yearlyContribution}
          leftlabelText="$"
          rightText="/year"
          onInputChange={handleInputChange}
          maxValue={1000000}
        />
        <InputError visible={errorMessage !== ""} text={errorMessage} />

        <tbody>
          <tr>
            <td style={{ paddingTop: "5px" }}></td>
          </tr>
        </tbody>

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
