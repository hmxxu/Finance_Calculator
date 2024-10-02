import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import InputHeader from "./inputTableComponenets/InputHeader";
import InputRadioButton from "./inputTableComponenets/InputRadioButtons";
import InputCounter from "./inputTableComponenets/InputCounter";
import Input from "./inputTableComponenets/Input";
import InputError from "./inputTableComponenets/InputError";

const AdditionCarLoans = ({
  setCarLoanType,
  setCarLoanCount,
  setCDInterval,
  currentAge,
  lifeExpetency,
}) => {
  const [loading, setLoading] = useState(true);
  const [inputType, setInputType] = useState("normal");
  const [errorMessage, setErrorMessage] = useState("");
  const [carCount, setCarCount] = useState(0);

  const [inputValues, setInputValues] = useState({
    xYears: 10,
    startAge: 25,
    startPrice: 40000,
    priceIncrease: 5000,
  });

  useEffect(() => {
    const hash = window.location.hash;
    const queryString = hash.split("?")[1];

    if (queryString) {
      const queryParams = new URLSearchParams(queryString);
      const data = JSON.parse(decodeURIComponent(queryParams.get("cds")));
      setCarCount(data.length);
      setCarLoanCount(data.length);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!currentAge) {
      setErrorMessage("Current Age is invalid");
      setCDInterval(null);
      return;
    }
    const { startAge } = inputValues;
    const inputs = Object.values(inputValues);
    if (inputs.some((input) => isNaN(input) || input === null)) {
      setErrorMessage("Invalid Input");
      setCDInterval(null);
    } else if (currentAge > startAge) {
      setErrorMessage(
        "Current Age must be less than age of first car purchase"
      );
      setCDInterval(null);
    } else if (startAge > lifeExpetency) {
      setErrorMessage("Age of first car purchase be before life expentency");
      setCDInterval(null);
    } else {
      setCDInterval(inputValues);
      setErrorMessage("");
    }
  }, [inputValues, currentAge, lifeExpetency]);

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

  if (loading) return null;

  return (
    <table className="input-table">
      <InputHeader header="Addition Assets" />
      <InputRadioButton
        header="Amount of Cars"
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
          defaultValue={carCount}
          setCounter={(val) => {
            setCarLoanCount(val);
            setCarCount(val);
          }}
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
            name="startAge"
            leftText="Age of First Car Purchase"
            defaultInput={inputValues.startAge}
            onInputChange={handleInputChange}
            maxValue={150}
          />
          <Input
            name="startPrice"
            leftText="First Car Price"
            leftlabelText="$"
            defaultInput={inputValues.startPrice}
            onInputChange={handleInputChange}
            maxValue={1000000}
          />
          <Input
            name="priceIncrease"
            leftText="Price Increase"
            leftlabelText="$"
            defaultInput={inputValues.priceIncrease}
            onInputChange={handleInputChange}
            maxValue={1000000}
          />
          <InputError
            visible={errorMessage !== "" && inputType === "interval"}
            text={errorMessage}
          />
        </React.Fragment>
      )}

      {inputType === "interval" && <tbody style={{ height: "17px" }} />}
    </table>
  );
};

AdditionCarLoans.propTypes = {
  setCarLoanType: PropTypes.func.isRequired,
  setCarLoanCount: PropTypes.func.isRequired,
  setCDInterval: PropTypes.func.isRequired,
  currentAge: PropTypes.number.isRequired,
  lifeExpetency: PropTypes.number.isRequired,
};

export default AdditionCarLoans;
