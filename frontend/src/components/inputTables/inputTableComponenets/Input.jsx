import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import "../../../styles/input.css";
import icon from "../../../svgs/question-circle.svg";
import useMediaQuery from "../../../hooks/useMediaQuery";

const Input = ({
  name,
  leftText,
  leftlabelText,
  infoText,
  defaultInput,
  rightlabelText,
  rightText,
  selectValues,
  defaultSelectedValue,
  onInputChange,
  onSelectChange,
  maxValue = Infinity,
  allowDecimal = false,
}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 768px)");
  const [inputValue, setInputValue] = useState(defaultInput);
  const [invalidInput, setInvalidInput] = useState(false);

  const handleChange = (e) => {
    const re = allowDecimal ? /^[0-9,]*\.?[0-9]{0,2}$/ : /^[0-9,\b]+$/;

    let value = e.target.value;

    // Remove commas for validation and parsing
    const valueWithoutCommas = value.replace(/,/g, "");

    // Proceed if value matches the regex pattern
    if (value === "" || re.test(value)) {
      // Convert to a number (float or int) after removing commas
      const parsedValue = allowDecimal
        ? parseFloat(valueWithoutCommas)
        : parseInt(valueWithoutCommas, 10);

      // Check if parsed value is valid
      const isValueValid = valueWithoutCommas !== "" && parsedValue <= maxValue;

      setInputValue(value);
      onInputChange(name, isValueValid ? parsedValue : null);
      setInvalidInput(!isValueValid);
    }
  };

  const handleBlur = (e) => {
    // Only format if decimal points are not allowed
    if (allowDecimal) return;

    let value = e.target.value;

    // Remove any existing commas
    value = value.replace(/,/g, "");

    // Convert to a number and format with commas
    if (!isNaN(value) && value !== "") {
      const formattedValue = numberWithCommas(parseFloat(value));
      e.target.value = formattedValue; // Update the input value with commas
      setInputValue(formattedValue);
    }
  };

  const handleSelectChange = (e) => {
    onSelectChange(e.target.value);
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <tbody>
      <tr>
        <td
          style={{
            paddingRight: infoText ? "20px" : "0px",
            position: "relative",
          }}
        >
          {leftText}
          {infoText && (
            <img src={icon} alt="Info" width="15px" className="info-icon" />
          )}
          <span className="info-text-box">{infoText}</span>
        </td>
        <td
          style={{
            paddingLeft: "30px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex" }}>
            <span className="left-label-text">{leftlabelText}</span>
            <input
              name={leftText}
              type="text"
              className={invalidInput ? "input-box-invalid" : "input-box-valid"}
              value={
                typeof inputValue === "number"
                  ? numberWithCommas(inputValue)
                  : inputValue
              }
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span className="right-label-text">{rightlabelText}</span>
            {isAboveMediumScreens && (
              <span style={{ paddingLeft: "5px" }}>{rightText}</span>
            )}
          </div>
          {selectValues && !isAboveMediumScreens && (
            <div style={{ display: "flex" }}>
              <select
                onChange={handleSelectChange}
                defaultValue={defaultSelectedValue}
              >
                {selectValues.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
        </td>
        {selectValues && isAboveMediumScreens && (
          <td>
            <select
              onChange={handleSelectChange}
              defaultValue={defaultSelectedValue}
            >
              {selectValues.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </td>
        )}
      </tr>
      <tr style={{ position: "relative" }}>
        <td
          className="input-error-message"
          style={{ visibility: invalidInput ? "visible" : "hidden" }}
        >
          {"Must be between 0-" + numberWithCommas(maxValue)}
        </td>
      </tr>
    </tbody>
  );
};

Input.propTypes = {
  name: PropTypes.string,
  leftText: PropTypes.string.isRequired,
  leftlabelText: PropTypes.string,
  infoText: PropTypes.string,
  defaultInput: PropTypes.number,
  rightlabelText: PropTypes.string,
  rightText: PropTypes.string,
  selectValues: PropTypes.arrayOf(PropTypes.string),
  defaultSelectedValue: PropTypes.string,
  onInputChange: PropTypes.func.isRequired,
  onSelectChange: PropTypes.func,
  maxValue: PropTypes.number,
  allowDecimal: PropTypes.bool,
};

export default Input;
