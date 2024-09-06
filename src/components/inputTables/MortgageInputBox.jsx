import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InputHeader from "./inputTableComponenets/InputHeader";
import Input from "./inputTableComponenets/Input";
import InputButton from "./inputTableComponenets/InputButton";
import InputRadioButton from "./inputTableComponenets/InputRadioButtons";
import FilledInput from "./inputTableComponenets/FilledInput";
import InputError from "./inputTableComponenets/InputError";
import IncludeExcludeButtons from "./inputTableComponenets/IncludeExcludeButtons";

const MortgageInputBox = ({
  setMortgageData,
  homePage = false,
  currentAge,
  lifeExpetency,
}) => {
  const [inputValues, setInputValues] = useState({
    price: 250000,
    downPayment: 20,
    term: 30,
    interest: 6.44,
    startAge: 35,
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
      setErrorMessage("Current Age must be less mortgage start age");
    } else if (homePage && startAge + term > lifeExpetency) {
      setErrorMessage("Mortgage must end before life expentency");
    } else {
      if (homePage) {
        setMortgageData(inputValues);
      }
      setErrorMessage("");
    }
  }, [inputValues, currentAge, lifeExpetency, homePage, setMortgageData]);

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
        <InputHeader
          header={homePage ? "Mortgage Inputs" : "Mortgage Calculator"}
        />
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
        <InputError visible={errorMessage !== ""} text={errorMessage} />
        {homePage && (
          <tbody>
            <tr>
              <td style={{ paddingTop: "5px" }}></td>
            </tr>
          </tbody>
        )}

        {homePage ? (
          <React.Fragment>
            <tbody style={{ height: "15px" }} />
            <IncludeExcludeButtons setIncluded={setIncluded} />
          </React.Fragment>
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
  lifeExpetency: PropTypes.number,
};

export default MortgageInputBox;
