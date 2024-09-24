import React from "react";
import PropTypes from "prop-types";

const IncludeExcludeButtons = ({ setIncluded }) => {
  return (
    <tbody
      style={{
        position: "relative",
        zIndex: 2,
        opacity: "100% !important",
        pointerEvents: "all",
      }}
    >
      <tr>
        <td colSpan="5">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "5px",
            }}
          >
            <button
              className="calculate-button"
              onClick={() => setIncluded(true)}
            >
              Include
            </button>
            <button className="reset-button" onClick={() => setIncluded(false)}>
              Exclude
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  );
};

IncludeExcludeButtons.propTypes = {
  setIncluded: PropTypes.func.isRequired,
};

export default IncludeExcludeButtons;
