import React from "react";
import PropTypes from "prop-types";
import icon from "../../../svgs/question-circle.svg";

const InputRadioButton = ({
  header,
  infoText,
  options,
  selectedValue,
  onChange,
}) => {
  return (
    <tbody>
      <tr className="input-row">
        <td
          style={{
            paddingRight: infoText ? "20px" : "0px",
            position: "relative",
          }}
          className="input-left"
        >
          {header}
          {infoText && (
            <img src={icon} alt="Info" width="15px" className="info-icon" />
          )}
          <span className="info-text-box">{infoText}</span>
        </td>
        <td colSpan="5">
          <div style={{ display: "flex" }}>
            <div
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                fontSize: "14px",
                display: "flex",
              }}
            >
              {options.map((option, index) => (
                <div key={index} style={{ display: "flex" }}>
                  <label
                    style={{
                      marginTop: "auto",
                    }}
                  >
                    <input
                      name={header}
                      type="radio"
                      style={{ marginTop: "0px" }}
                      value={option.value}
                      checked={selectedValue === option.value}
                      onChange={(e) => onChange(e.target.value)}
                    />
                  </label>
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        </td>
      </tr>
      {/* <tr /> */}
    </tbody>
  );
};

InputRadioButton.propTypes = {
  header: PropTypes.string,
  infoText: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
};

export default InputRadioButton;
