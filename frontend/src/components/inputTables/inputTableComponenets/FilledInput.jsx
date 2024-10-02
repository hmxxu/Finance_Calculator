import React from "react";
import PropTypes from "prop-types";
import "../../../styles/input.css";
import icon from "../../../svgs/question-circle.svg";
import useMediaQuery from "../../../hooks/useMediaQuery";

const FilledInput = ({
  leftText,
  leftlabelText,
  infoText,
  inputValue,
  rightlabelText,
  rightText,
}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 768px)");

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <tbody>
      <tr style={{ marginTop: "100px" }}>
        <td
          style={{
            paddingRight: infoText ? "20px" : "0px",
            position: "relative",
          }}
          className="input-left"
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
          }}
        >
          <span className="left-label-text">{leftlabelText}</span>
          <input
            name={leftText}
            type="text"
            className="input-box-valid"
            style={{ pointerEvents: "none", backgroundColor: "#d3d3d3 " }}
            value={
              typeof inputValue === "number"
                ? numberWithCommas(inputValue)
                : inputValue
            }
            readOnly
          />
          <span className="right-label-text">{rightlabelText}</span>
          {isAboveMediumScreens && (
            <span style={{ paddingLeft: "5px" }}>{rightText}</span>
          )}
        </td>
        {/* {isAboveMediumScreens && (
          <td style={{ paddingRight: "5px" }}>{rightText}</td>
        )} */}
      </tr>
      <tr>
        <td className="input-error-message" style={{ visibility: "hidden" }} />
      </tr>
    </tbody>
  );
};

FilledInput.propTypes = {
  leftText: PropTypes.string.isRequired,
  leftlabelText: PropTypes.string,
  infoText: PropTypes.string,
  inputValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rightlabelText: PropTypes.string,
  rightText: PropTypes.string,
};

export default FilledInput;
