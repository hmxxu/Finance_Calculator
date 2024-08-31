import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";

const InputCounter = ({ leftText, setCounter, maxCount = 999 }) => {
  const [count, setCount] = useState(0);
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
    if (count > 0) {
      setCount((prevCount) => prevCount - 1);
      if (setCounter) setCounter((prevCount) => prevCount - 1);
      setErrorMessage("");
    } else {
      setErrorMessage("min values is 0");
    }
  };
  return (
    <tbody>
      <tr>
        <td>
          <div>{leftText}</div>
        </td>

        <td style={{ display: "flex", flexDirection: "row" }}>
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
};

export default InputCounter;
