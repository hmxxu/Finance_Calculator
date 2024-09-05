import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import InputHeader from "./inputTables/inputTableComponenets/InputHeader";
import InputRadioButton from "./inputTables/inputTableComponenets/InputRadioButtons";
import InputCounter from "./inputTables/inputTableComponenets/InputCounter";
import Input from "./inputTables/inputTableComponenets/Input";
import InputError from "./inputTables/inputTableComponenets/InputError";

const AdditionCarLoans = ({
  setCarLoanType,
  setCarLoanCount,
  setCDInterval,
}) => {
  const [inputType, setInputType] = useState("normal");
  const [inputsValid, setInputsValid] = useState(true);

  const [inputValues, setInputValues] = useState({
    xYears: 10,
    startPrice: 34000,
    priceIncrease: 5000,
  });

  useEffect(() => {
    const inputs = Object.values(inputValues);
    if (inputs.some((input) => isNaN(input) || input === null)) {
      setInputsValid(false);
    } else {
      setCDInterval(inputValues);
      setInputsValid(true);
    }
  }, [inputValues]);

  function changeInputType(inputType) {
    setInputType(inputType);
    setCarLoanType(inputType);
    setCDInterval(inputValues);
  }

  const handleInputChange = (name, value) => {
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  return (
    <table className="input-table">
      <InputHeader header="Addition Assets" />
      <InputRadioButton
        header="Amount of Cars"
        name="exampleRadio"
        infoText="Normal: Decide number of car loans Interval: Adds a car loan every X years"
        options={[
          { label: "Normal", value: "normal" },
          { label: "Interval", value: "interval" },
        ]}
        selectedValue={inputType}
        onChange={changeInputType}
      />

      {inputType === "normal" ? (
        <InputCounter
          leftText="Number of Car Loans"
          setCounter={setCarLoanCount}
          minCount={0}
          maxCount={12}
        />
      ) : (
        <React.Fragment>
          <InputCounter
            leftText="New Car Every X Years"
            infoText="The number of year when the next car will be bought"
            setCounter={(value) => handleInputChange("xYears", value)}
            minCount={5}
            maxCount={25}
            defaultValue={inputValues.xYears}
          />
          <Input
            name="startPrice"
            leftText="First Car Price"
            leftlabelText="$"
            defaultInput={inputValues.startPrice}
            onInputChange={handleInputChange}
            maxValue={1000000}
            allowDecimal={false}
          />
          <Input
            name="priceIncrease"
            leftText="Price Increase"
            leftlabelText="$"
            defaultInput={inputValues.priceIncrease}
            onInputChange={handleInputChange}
            maxValue={1000000}
            allowDecimal={false}
          />
        </React.Fragment>
      )}
      <InputError
        visible={!inputsValid && inputType === "interval"}
        text="Invalid Input"
      />
    </table>
  );
};

AdditionCarLoans.propTypes = {
  setCarLoanType: PropTypes.func.isRequired,
  setCarLoanCount: PropTypes.func.isRequired,
  setCDInterval: PropTypes.func.isRequired,
};

export default AdditionCarLoans;
