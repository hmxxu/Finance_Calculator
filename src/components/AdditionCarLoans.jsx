import React from "react";
import InputHeader from "./inputTables/inputTableComponenets/InputHeader";
import InputRadioButton from "./inputTables/inputTableComponenets/InputRadioButtons";
import InputCounter from "./inputTables/inputTableComponenets/InputCounter";
import Input from "./inputTables/inputTableComponenets/Input";
import { useState } from "react";

const AdditionCarLoans = (setCDs) => {
  const [inputType, setInputType] = useState("normal");
  return (
    <table
      className="input-table"
      style={{
        width: "100%",
      }}
    >
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
        onChange={setInputType}
      />

      {inputType === "normal" ? (
        <InputCounter
          leftText="Number of Car Loans"
          setCounter={() => console.log(123)}
          minCount={0}
          maxCount={10}
        />
      ) : (
        <React.Fragment>
          <InputCounter
            leftText="New Car Every X Years"
            infoText="The number of year when the next car will be bought"
            setCounter={() => console.log(123)}
            minCount={1}
            maxCount={20}
            defaultValue={10}
          />
          <Input
            name="price"
            leftText="Price Increase"
            leftlabelText="$"
            defaultInput={5000}
            onInputChange={() => console.log(123)}
            maxValue={100000000}
            allowDecimal={false}
          />
        </React.Fragment>
      )}
    </table>
  );
};

export default AdditionCarLoans;
