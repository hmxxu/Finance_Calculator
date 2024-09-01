import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import icon from "../../../svgs/question-circle.svg";

const InputCounter = ({
  leftText,
  infoText,
  setCounter,
  minCount = 0,
  maxCount = 999,
  defaultValue = 0,
}) => {
  const [count, setCount] = useState(defaultValue);
  const [errorMessage, setErrorMessage] = useState("");

  const increment = () => {
    if (count < maxCount) {
      setCount((prevCount) => prevCount + 1);
      if (setCounter) setCounter((prevCount) => prevCount + 1);
      setErrorMessage("");
    } else {
      setErrorMessage("max values is " + maxCount);
    }
  };

  const decrement = () => {
    if (count > minCount) {
      setCount((prevCount) => prevCount - 1);
      if (setCounter) setCounter((prevCount) => prevCount - 1);
      setErrorMessage("");
    } else {
      setErrorMessage("min values is " + minCount);
    }
  };
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
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <button onClick={decrement}>-</button>
          <span
            style={{
              marginLeft: "10px",
              marginRight: "10px",
              display: "inline-block",
              width: "15px",
              textAlign: "center",
            }}
          >
            {count}
          </span>
          <button onClick={increment}>+</button>
        </td>
      </tr>
      <tr>
        <td
          className="input-error-message"
          style={{ visibility: errorMessage ? "visible" : "hidden" }}
        >
          {errorMessage}
        </td>
      </tr>
    </tbody>
  );
};

InputCounter.propTypes = {
  leftText: PropTypes.string.isRequired,
  setCounter: PropTypes.func.isRequired,
  maxCount: PropTypes.number,
  infoText: PropTypes.string,
};

export default InputCounter;
