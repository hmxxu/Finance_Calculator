import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InputHeader from "./inputTableComponenets/InputHeader";
import Input from "./inputTableComponenets/Input";
import InputError from "./inputTableComponenets/InputError";
import FilledInput from "./inputTableComponenets/FilledInput";
import { sumArr } from "../../helperFunctions";

const MontlhyExpensesInputBox = ({ setMonthlyExpensesData }) => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [inputValues, setInputValues] = useState({
    groceryFood: 200,
    healthInsurance: 500,
    carInsurance: 110,
    cellPhonePlan: 50,
    utilities: 150,
    subscriptions: 60,
    transportation: 150,
    pet: 120,
    others: 200,
  });

  useEffect(() => {
    const hash = window.location.hash;
    const queryString = hash.split("?")[1];

    if (queryString) {
      const queryParams = new URLSearchParams(queryString);
      let data;
      try {
        data = JSON.parse(decodeURIComponent(queryParams.get("med")));
      } catch (error) {
        throw new Error("Malformed 'med' parameter: Invalid JSON structure.");
      }
      const keys = [
        "groceryFood",
        "healthInsurance",
        "carInsurance",
        "cellPhonePlan",
        "utilities",
        "subscriptions",
        "transportation",
        "pet",
        "others",
      ];
      if (
        data &&
        typeof data === "object" &&
        keys.every((key) => key in data) &&
        !Object.values(data).some((value) => value === null)
      ) {
        setInputValues(data);
      } else {
        console.log("med params incorrect");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const inputs = Object.values(inputValues);
    if (inputs.some((input) => isNaN(input) || input === null)) {
      setErrorMessage("Invalid Input");
      setMonthlyExpensesData(null);
    } else {
      setErrorMessage("");
      setMonthlyExpensesData(inputValues);
    }
  }, [inputValues, setMonthlyExpensesData]);

  const handleInputChange = (name, value) => {
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  if (loading) return null;

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
        name="pet"
        leftText="Pet Expenses"
        leftlabelText="$"
        defaultInput={inputValues.pet}
        onInputChange={handleInputChange}
        maxValue={100000}
      />
      <Input
        name="others"
        leftText="Others"
        leftlabelText="$"
        infoText="Other expenses to consider: student debt payments, internet, daycare, etc"
        defaultInput={inputValues.others}
        onInputChange={handleInputChange}
        maxValue={100000}
      />
      <FilledInput
        leftText="Total"
        leftlabelText="$"
        inputValue={sumArr(inputValues)}
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

MontlhyExpensesInputBox.propTypes = {
  setMonthlyExpensesData: PropTypes.func.isRequired,
};

export default MontlhyExpensesInputBox;
