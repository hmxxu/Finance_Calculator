import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InputHeader from "./inputTableComponenets/InputHeader";
import Input from "./inputTableComponenets/Input";
import InputError from "./inputTableComponenets/InputError";
import InputButton from "./inputTableComponenets/InputButton";
import FilledInput from "./inputTableComponenets/FilledInput";
import useMediaQuery from "../../hooks/useMediaQuery";
import { calcInflatedPrice } from "../../helperFunctions";

const CarPaymentInputBox = ({
  setCarPaymentInputs,
  homePage = false,
  currentAge,
  lifeExpetency,
  index,
}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 768px)");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [inputValues, setInputValues] = useState({
    price: 45000,
    term: 60,
    interest: 6.89,
    downPayment: 20,
    salesTax: 8.52,
    fees: 2300,
    startAge: 26,
    inflation: 3.7,
  });

  useEffect(() => {
    const hash = window.location.hash;
    const queryString = hash.split("?")[1];

    if (queryString) {
      const queryParams = new URLSearchParams(queryString);
      let data;
      try {
        data = JSON.parse(decodeURIComponent(queryParams.get("cds")));
      } catch (error) {
        throw new Error("Malformed 'cds' parameter: Invalid JSON structure.");
      }
      const keys = [
        "price",
        "term",
        "interest",
        "downPayment",
        "salesTax",
        "fees",
        "startAge",
        "inflation",
      ];
      if (
        data &&
        data.length >= index + 1 &&
        typeof data[index] === "object" &&
        keys.every((key) => key in data[index]) &&
        !Object.values(data[index]).some((value) => value === null)
      ) {
        setInputValues(data[index]);
      } else {
        console.log("cds params incorrect");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const { startAge, term } = inputValues;
    if (homePage) setCarPaymentInputs(inputValues);

    const inputs = Object.values(inputValues);
    if (inputs.some((input) => isNaN(input) || input === null)) {
      setErrorMessage("Invalid Input");
      setCarPaymentInputs(null);
    } else if (homePage && startAge < currentAge) {
      setErrorMessage("Current Age must be less car loan start age");
      setCarPaymentInputs(null);
    } else if (homePage && lifeExpetency < startAge + Math.ceil(term / 12)) {
      setErrorMessage("Car loan must end before life expentency");
      setCarPaymentInputs(null);
    } else {
      setErrorMessage("");
    }
  }, [inputValues, homePage]);

  const handleInputChange = (name, value) => {
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  function calculateButton() {
    if (errorMessage !== "") return;
    setCarPaymentInputs(inputValues);
  }

  if (loading) return null;

  return (
    <table className="input-table">
      <InputHeader
        header={homePage ? "Car Payment Inputs" : "Car Payment Calculator"}
      />
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
          inputValue={Math.round(
            calcInflatedPrice(
              inputValues.price,
              inputValues.inflation / 100,
              inputValues.startAge - currentAge
            )
          )}
        />
      )}
      <InputError visible={errorMessage !== ""} text={errorMessage} />
      {!homePage ? (
        <InputButton
          calcOnClick={calculateButton}
          resetOnClick={() => window.location.reload()}
        />
      ) : isAboveMediumScreens ? (
        <tbody style={{ height: "17px" }} />
      ) : null}
    </table>
  );
};

CarPaymentInputBox.propTypes = {
  setCarPaymentInputs: PropTypes.func.isRequired,
  homePage: PropTypes.bool,
  currentAge: PropTypes.number,
  lifeExpetency: PropTypes.number,
};

export default CarPaymentInputBox;
