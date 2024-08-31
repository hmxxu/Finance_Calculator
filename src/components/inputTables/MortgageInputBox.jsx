import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InputHeader from "./inputTableComponenets/InputHeader";
import Input from "./inputTableComponenets/Input";
import InputButton from "./inputTableComponenets/InputButton";
import InputRadioButton from "./inputTableComponenets/InputRadioButtons";
import FilledInput from "./inputTableComponenets/FilledInput";

const MortgageInputBox = ({
  setMortgageData,
  homePage = false,
  currentAge,
}) => {
  const [inputValues, setInputValues] = useState({
    price: 600000,
    downPayment: 17,
    term: 30,
    interest: 5.88,
    startAge: 37,
    priceType: "normal",
    inflation: 3.67,
    included: true,
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const {
      price,
      downPayment,
      term,
      interest,
      startAge,
      priceType,
      inflation,
    } = inputValues;

    let inputs;
    // Ignore price if priceType is MAX
    if (homePage && priceType === "normal") {
      inputs = [price, downPayment, term, interest, startAge, inflation];
    } else if (homePage) {
      inputs = [downPayment, term, interest, startAge, inflation];
    } else {
      inputs = [price, downPayment, term, interest];
    }

    if (inputs.some((input) => isNaN(input) || input === null)) {
      setErrorMessage("Invalid Input");
    } else if (currentAge > startAge) {
      setErrorMessage("Current Age must be less start age");
    } else {
      if (homePage) {
        setMortgageData(inputValues);
      }
      setErrorMessage("");
    }
  }, [inputValues, currentAge, homePage, setMortgageData]);

  const handleInputChange = (name, value) => {
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  function calculateButton() {
    if (errorMessage !== "") return;
    setMortgageData(inputValues);
  }

  const handleRadioChange = (value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      price: isNaN(inputValues.price) ? 0 : inputValues.price,
      priceType: value,
    }));
  };

  const setIncluded = (boo) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      included: boo,
    }));
  };

  function getInflatedPrice() {
    if (
      isNaN(inputValues.price) ||
      isNaN(inputValues.startAge) ||
      isNaN(inputValues.inflation)
    )
      return 0;
    if (inputValues.priceType === "normal") {
      return Math.round(
        inputValues.price *
          (1 + inputValues.inflation / 100) **
            (inputValues.startAge - currentAge)
      );
    }
    return "";
  }

  return (
    <div style={{ position: "relative" }}>
      <table className="input-table">
        <InputHeader header="Mortgage Calculator" />
        {inputValues.priceType === "normal" || !homePage ? (
          <Input
            name="price"
            leftText="Home Price"
            leftlabelText="$"
            defaultInput={inputValues.price}
            onInputChange={handleInputChange}
            maxValue={100000000}
            allowDecimal={false}
          />
        ) : (
          <FilledInput
            leftText="Home Price"
            leftlabelText="$"
            inputValue={"Max Price"}
          />
        )}
        <Input
          name="downPayment"
          leftText="Down Payment"
          rightlabelText="%"
          defaultInput={inputValues.downPayment}
          onInputChange={handleInputChange}
          maxValue={90}
          allowDecimal={true}
        />
        <Input
          name="interest"
          leftText="Interest Rate"
          defaultInput={inputValues.interest}
          rightlabelText="%"
          onInputChange={handleInputChange}
          maxValue={25}
          allowDecimal={true}
        />
        <Input
          name="term"
          leftText="Loan Term (years)"
          defaultInput={inputValues.term}
          onInputChange={handleInputChange}
          maxValue={50}
          allowDecimal={false}
        />
        {homePage && (
          <Input
            name="startAge"
            leftText="Mortgage Start Age"
            defaultInput={inputValues.startAge}
            onInputChange={handleInputChange}
            maxValue={100}
            allowDecimal={false}
          />
        )}
        {homePage && (
          <Input
            name="inflation"
            leftText="Inflation Rate"
            infoText="Percent inflation per year of home EX: $100,000 with 3% inflation will cost $103,000 in 1 year"
            defaultInput={inputValues.inflation}
            rightlabelText="%"
            onInputChange={handleInputChange}
            maxValue={100}
            allowDecimal={true}
          />
        )}
        {homePage && (
          <FilledInput
            leftText="Inflated Price"
            leftlabelText="$"
            infoText={
              inputValues.priceType === "normal"
                ? "The price of the house in " +
                  (inputValues.startAge - currentAge) +
                  " years"
                : undefined
            }
            inputValue={getInflatedPrice()}
          />
        )}
        {homePage && (
          <InputRadioButton
            header="Mortgage Price"
            name="exampleRadio"
            infoText="Max will calculate the maximum possible house price"
            options={[
              { label: "Normal", value: "normal" },
              { label: "Max", value: "max" },
            ]}
            selectedValue={inputValues.priceType}
            onChange={handleRadioChange}
          />
        )}
        {!homePage && (
          <tbody>
            <tr>
              <td style={{ paddingTop: "5px" }}></td>
            </tr>
          </tbody>
        )}
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
        {homePage && (
          <tbody>
            <tr>
              <td style={{ paddingTop: "5px" }}></td>
            </tr>
          </tbody>
        )}
        {homePage ? (
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
        ) : (
          <InputButton
            calcOnClick={calculateButton}
            resetOnClick={() => window.location.reload()}
          />
        )}
      </table>
      <div
        className="overlay"
        style={{ visibility: inputValues.included ? "hidden" : "visible" }}
      />
    </div>
  );
};

MortgageInputBox.propTypes = {
  setMortgageData: PropTypes.func.isRequired,
  homePage: PropTypes.bool,
  currentAge: PropTypes.number,
};

export default MortgageInputBox;
