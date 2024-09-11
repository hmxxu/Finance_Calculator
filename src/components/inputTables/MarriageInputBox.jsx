import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InputHeader from "./inputTableComponenets/InputHeader";
import Input from "./inputTableComponenets/Input";
import InputError from "./inputTableComponenets/InputError";
import IncludeExcludeButtons from "./inputTableComponenets/IncludeExcludeButtons";
import InputCounter from "./inputTableComponenets/InputCounter";
import InputRadioButton from "./inputTableComponenets/InputRadioButtons";

const MarriageInputBox = ({ setMarriageData, currentAge, lifeExpetency }) => {
  const [inputValues, setInputValues] = useState({
    marriageAge: 30,
    savings: 120000,
    checking: 35000,
    income: 60000,
    childCostPerYear: 25000,
    childAges: [],
    yearsOff: 5,
    divorceAge: null,
    included: true,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isDivorced, setIsDivorced] = useState("false");

  useEffect(() => {
    const {
      marriageAge,
      savings,
      checking,
      income,
      childCostPerYear,
      childAges,
      divorceAge,
    } = inputValues;

    const inputs = [marriageAge, savings, checking, income, childCostPerYear];
    if (
      inputs.some((input) => isNaN(input) || input === null) ||
      childAges.some((input) => isNaN(input) || input === null) ||
      (divorceAge !== null && isNaN(divorceAge))
    ) {
      setErrorMessage("Invalid Input");
    } else if (marriageAge > lifeExpetency) {
      setErrorMessage(
        "Life expectancy must be less than or equal to marriage age"
      );
    } else if (marriageAge < currentAge) {
      setErrorMessage("Current age must be greater than marriage age");
    } else if (childAges.some((input) => input < currentAge)) {
      setErrorMessage("Current age must be greater than age you have child");
    } else if (childAges.some((input) => input > lifeExpetency)) {
      setErrorMessage("Age you have child must be less than life expetency");
    } else if (divorceAge !== null && divorceAge <= marriageAge) {
      setErrorMessage("Divorce Age must be greater than marriage age");
    } else if (divorceAge !== null && divorceAge > lifeExpetency) {
      setErrorMessage("Divorce Age must be less than life expetency");
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

  const handleChildCountChange = (val) => {
    setInputValues((prevValues) => {
      const newChildAges = [...prevValues.childAges];

      if (val > newChildAges.length) {
        newChildAges.push(30);
      } else {
        newChildAges.splice(val);
      }

      return {
        ...prevValues,
        childAges: newChildAges,
      };
    });
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
          name="checking"
          leftText="Checking Contribution"
          infoText="The checking contribution at marriage"
          defaultInput={inputValues.checking}
          leftlabelText="$"
          onInputChange={handleInputChange}
          maxValue={1000000}
        />
        <Input
          name="income"
          leftText="Income at Marriage Age"
          infoText="We assume the partner has the same: checking and savings contribution %, monthly expenses, income increase, retirement income, retirement income needed"
          leftlabelText="$"
          defaultInput={inputValues.income}
          rightText="/year"
          onInputChange={handleInputChange}
          maxValue={1000000}
        />
        <InputCounter
          leftText="Number of children"
          defaultValue={inputValues.childAges.length}
          setCounter={handleChildCountChange}
          minCount={0}
          maxCount={6}
        />

        {inputValues.childAges.length > 0 && (
          <Input
            name="childCostPerYear"
            leftText="Cost of child per year"
            leftlabelText="$"
            defaultInput={inputValues.childCostPerYear}
            rightText="/year"
            onInputChange={handleInputChange}
            maxValue={10000000}
          />
        )}

        {inputValues.childAges.length > 0 && (
          <InputCounter
            leftText="Career Break Length"
            defaultValue={inputValues.yearsOff}
            setCounter={(val) => handleInputChange("yearsOff", val)}
            minCount={0}
            maxCount={20}
          />
        )}

        {inputValues.childAges.map((age, index) => (
          <Input
            key={index}
            name={`child#${index + 1}`}
            leftText={`Age you have child #${index + 1}`}
            defaultInput={age}
            onInputChange={(name, val) => {
              const newChildAges = [...inputValues.childAges];
              newChildAges[index] = val; // Update the age for the specific child
              setInputValues((prevValues) => ({
                ...prevValues,
                childAges: newChildAges,
              }));
            }}
            maxValue={150}
          />
        ))}

        <InputRadioButton
          header="Got Divorced"
          options={[
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
          ]}
          selectedValue={isDivorced}
          onChange={(value) => {
            setIsDivorced(value);
            setInputValues((prevValues) => ({
              ...prevValues,
              divorceAge: value === "true" ? 35 : null,
            }));
          }}
        />

        {isDivorced === "true" && (
          <Input
            name="divorceAge"
            leftText="Age of Divorce"
            defaultInput={inputValues.divorceAge}
            onInputChange={handleInputChange}
            maxValue={10000000}
          />
        )}
        <InputError visible={errorMessage !== ""} text={errorMessage} />
        <tbody style={{ height: "20px" }} />
        <IncludeExcludeButtons
          setIncluded={(boo) => {
            setInputValues((prevValues) => ({
              ...prevValues,
              included: boo,
            }));
          }}
        />
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
