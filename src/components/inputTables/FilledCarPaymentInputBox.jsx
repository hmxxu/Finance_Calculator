import React from "react";
import PropTypes from "prop-types";
import InputHeader from "./inputTableComponenets/InputHeader";
import FilledInput from "./inputTableComponenets/FilledInput";

const FilledCarPaymentInputBox = ({
  header = "Car Payment Inputs",
  price,
  startAge,
  currentAge,
}) => {
  const inputValues = {
    term: 60,
    interest: 6.89,
    downPayment: 20,
    salesTax: 8.52,
    fees: 2300,
    inflation: 3.7,
  };

  function getInflatedPrice() {
    if (isNaN(price) || isNaN(startAge) || isNaN(inputValues.inflation))
      return 0;

    return Math.round(
      price * (1 + inputValues.inflation / 100) ** (startAge - currentAge)
    );
  }

  return (
    <table className="input-table">
      <InputHeader header={header} />
      <FilledInput leftText="Car Price" leftlabelText="$" inputValue={price} />
      <FilledInput
        name="term"
        leftText="Loan Term (months)"
        inputValue={inputValues.term}
      />
      <FilledInput
        name="interest"
        leftText="Interest Rate"
        inputValue={inputValues.interest}
        rightlabelText="%"
      />
      <FilledInput
        name="downPayment"
        leftText="Down Payment"
        rightlabelText="%"
        inputValue={inputValues.downPayment}
      />
      <FilledInput
        name="salesTax"
        leftText="Sales Tax"
        inputValue={inputValues.salesTax}
        infoText="This determined by the state and whether the car is used or new"
        rightlabelText="%"
      />
      <FilledInput
        name="fees"
        leftText="Other Fees"
        leftlabelText="$"
        inputValue={inputValues.fees}
        infoText="Other fees could be: Vehicle registration plate, Dealer fees, Documentation Fee, etc."
      />

      <FilledInput
        name="startAge"
        leftText="Car Loan Start Age"
        inputValue={startAge}
      />

      <FilledInput
        name="inflation"
        leftText="Inflation Rate"
        infoText="Percent inflation per year of home EX: $100,000 with 3% inflation will cost $103,000 in 1 year"
        inputValue={inputValues.inflation}
        rightlabelText="%"
      />

      <FilledInput
        leftText="Inflated Price"
        leftlabelText="$"
        infoText={
          "The price of the car in " + (startAge - currentAge) + " years"
        }
        inputValue={getInflatedPrice()}
      />
    </table>
  );
};

FilledCarPaymentInputBox.propTypes = {
  price: PropTypes.number.isRequired,
  startAge: PropTypes.number.isRequired,
  currentAge: PropTypes.number.isRequired,
};

export default FilledCarPaymentInputBox;
