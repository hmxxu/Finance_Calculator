import React from "react";
import PropTypes from "prop-types";

const InputCalcButton = ({ calcOnClick, resetOnClick }) => {
  return (
    <tbody>
      <tr>
        <td colSpan="5">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
              gap: "1rem",
            }}
          >
            <button className="calculate-button" onClick={calcOnClick}>
              Calculate
            </button>
            <button className="reset-button" onClick={resetOnClick}>
              Reset
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  );
};

InputCalcButton.propTypes = {
  calcOnClick: PropTypes.func.isRequired,
  resetOnClick: PropTypes.func.isRequired,
};

export default InputCalcButton;
