import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InputHeader from "./inputTableComponenets/InputHeader";
import Input from "./inputTableComponenets/Input";

const MarriageInputBox = ({ setMarriageData, currentAge, lifeExpetency }) => {
  const [inputValues, setInputValues] = useState({
    marriageAge: 30,
    savings: 100000,
    yearlyContribution: 60000,
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
        <tbody>
          <tr>
            <td>
              <div
                className="input-error-message"
                style={{
                  visibility: errorMessage ? "visible" : "hidden",
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  marginTop: "5px",
                }}
              >
                <div>{errorMessage}</div>
              </div>
            </td>
          </tr>
        </tbody>

        <tbody>
          <tr>
            <td style={{ paddingTop: "5px" }}></td>
          </tr>
        </tbody>

        <tbody style={{ position: "relative", zIndex: 2 }}>
          <tr>
            <td colSpan="5">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                  marginTop: "5px",
                }}
              >
                <button
                  className="calculate-button"
                  onClick={() => setIncluded(true)}
                >
                  Include
                </button>
                <button
                  className="reset-button"
                  onClick={() => setIncluded(false)}
                >
                  Exclude
                </button>
              </div>
            </td>
          </tr>
        </tbody>
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
