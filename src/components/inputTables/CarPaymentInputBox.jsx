import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InputHeader from "./inputTableComponenets/InputHeader";
import Input from "./inputTableComponenets/Input";
import InputError from "./inputTableComponenets/InputError";
import InputButton from "./inputTableComponenets/InputButton";
import FilledInput from "./inputTableComponenets/FilledInput";

const CarPaymentInputBox = ({
  setCarPaymentInputs,
  homePage = false,
  currentAge,
}) => {
  const [inputValues, setInputValues] = useState({
    price: 45000,
    term: 60,
    interest: 6.89,
    downPayment: 20,
    salesTax: 8.52,
    fees: 2300,
    startAge: 23,
    inflation: 3.7,
  });

  const [inputsValid, setInputsValid] = useState(true);

  useEffect(() => {
    const inputs = Object.values(inputValues);
    if (inputs.some((input) => isNaN(input) || input === null)) {
      setInputsValid(false);
    } else {
      if (homePage) {
        setCarPaymentInputs(inputValues);
      }
      setInputsValid(true);
    }
  }, [inputValues, homePage, setCarPaymentInputs]);

  const handleInputChange = (name, value) => {
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  function calculateButton() {
    if (!inputsValid) return;
    setCarPaymentInputs(inputValues);
  }

  function getInflatedPrice() {
    if (
      isNaN(inputValues.price) ||
      isNaN(inputValues.startAge) ||
      isNaN(inputValues.inflation)
    )
      return 0;

    return Math.round(
      inputValues.price *
        (1 + inputValues.inflation / 100) ** (inputValues.startAge - currentAge)
    );
  }

  return (
    <table className="input-table">
      <InputHeader header="Car Payment Calculator" />
      <Input
        name="price"
        leftText="Car Price"
        leftlabelText="$"
        defaultInput={inputValues.price}
        onInputChange={handleInputChange}
        maxValue={1000000}
        allowDecimal={true}
      />
      <Input
        name="term"
        leftText="Loan Term (months)"
        defaultInput={inputValues.term}
        onInputChange={handleInputChange}
        maxValue={96}
        allowDecimal={false}
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
        name="downPayment"
        leftText="Down Payment"
        rightlabelText="%"
        defaultInput={inputValues.downPayment}
        onInputChange={handleInputChange}
        maxValue={90}
        allowDecimal={true}
      />
      <Input
        name="salesTax"
        leftText="Sales Tax"
        defaultInput={inputValues.salesTax}
        infoText="This determined by the state and whether the car is used or new"
        rightlabelText="%"
        onInputChange={handleInputChange}
        maxValue={15}
        allowDecimal={true}
      />
      <Input
        name="fees"
        leftText="Other Fees"
        leftlabelText="$"
        defaultInput={inputValues.fees}
        infoText="Other fees could be: Vehicle registration plate, Dealer fees, Documentation Fee, etc."
        onInputChange={handleInputChange}
        maxValue={10000}
        allowDecimal={true}
      />
      {homePage && (
        <Input
          name="startAge"
          leftText="Car Loan Start Age"
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
            "The price of the car in " +
            (inputValues.startAge - currentAge) +
            " years"
          }
          inputValue={getInflatedPrice()}
        />
      )}
      <InputError visible={inputsValid} text="Invalid Input" />
      {!homePage && (
        <InputButton
          calcOnClick={calculateButton}
          resetOnClick={() => window.location.reload()}
        />
      )}
    </table>
  );
};

CarPaymentInputBox.propTypes = {
  setCarPaymentInputs: PropTypes.func.isRequired,
  homePage: PropTypes.bool,
  currentAge: PropTypes.number,
};

export default CarPaymentInputBox;
