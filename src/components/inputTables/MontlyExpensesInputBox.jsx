import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InputHeader from "./inputTableComponenets/InputHeader";
import Input from "./inputTableComponenets/Input";
import InputError from "./inputTableComponenets/InputError";
import FilledInput from "./inputTableComponenets/FilledInput";

const MontlyExpensesInputBox = ({ setMonthlyExpensesData }) => {
  const [inputValues, setInputValues] = useState({
    groceryFood: 200,
    healthInsurance: 500,
    carInsurance: 110,
    cellPhonePlan: 50,
    utilities: 150,
    subscriptions: 60,
    transportation: 150,
    others: 200,
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const inputs = Object.values(inputValues);
    if (inputs.some((input) => isNaN(input) || input === null)) {
      setErrorMessage("Invalid Input");
    } else {
      setErrorMessage("");
      setMonthlyExpensesData(calcTotal());
    }
  }, [inputValues, setMonthlyExpensesData]);

  const handleInputChange = (name, value) => {
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  function calcTotal() {
    const inputs = Object.values(inputValues);
    if (inputs.some((input) => isNaN(input) || input === null)) return 0;
    const total = inputs.reduce((acc, curr) => acc + Number(curr), 0);

    return total;
  }

  return (
    <table className="input-table">
      <InputHeader header="Monthly Expenses Inputs" />
      <Input
        name="groceryFood"
        leftText="Grocery and Dining"
        leftlabelText="$"
        defaultInput={inputValues.groceryFood}
        onInputChange={handleInputChange}
        maxValue={100000}
      />
      <Input
        name="healthInsurance"
        leftText="Health Insurance"
        leftlabelText="$"
        defaultInput={inputValues.healthInsurance}
        onInputChange={handleInputChange}
        maxValue={100000}
      />
      <Input
        name="carInsurance"
        leftText="Car Insurance"
        leftlabelText="$"
        defaultInput={inputValues.carInsurance}
        onInputChange={handleInputChange}
        maxValue={100000}
      />
      <Input
        name="cellPhonePlan"
        leftText="Cell Phone Plan"
        leftlabelText="$"
        defaultInput={inputValues.cellPhonePlan}
        onInputChange={handleInputChange}
        maxValue={100000}
      />
      <Input
        name="utilities"
        leftText="Utilities"
        leftlabelText="$"
        defaultInput={inputValues.utilities}
        onInputChange={handleInputChange}
        maxValue={100000}
      />
      <Input
        name="subscriptions"
        leftText="Subscriptions"
        leftlabelText="$"
        defaultInput={inputValues.subscriptions}
        onInputChange={handleInputChange}
        maxValue={100000}
      />
      <Input
        name="transportation"
        leftText="Transportation"
        leftlabelText="$"
        infoText="Cost of gas or public transportation"
        defaultInput={inputValues.transportation}
        onInputChange={handleInputChange}
        maxValue={100000}
      />
      <Input
        name="others"
        leftText="Others"
        leftlabelText="$"
        infoText="Other expenses to consider: student debt payments, internet, daycare, dog food, etc"
        defaultInput={inputValues.others}
        onInputChange={handleInputChange}
        maxValue={100000}
      />
      <FilledInput
        leftText="Total"
        leftlabelText="$"
        inputValue={calcTotal()}
      />

      <InputError visible={errorMessage !== ""} text={errorMessage} />

      <tbody>
        <tr>
          <td style={{ paddingTop: "5px" }}></td>
        </tr>
      </tbody>
    </table>
  );
};

MontlyExpensesInputBox.propTypes = {
  setMonthlyExpensesData: PropTypes.func.isRequired,
};

export default MontlyExpensesInputBox;
