import React from "react";
import PropTypes from "prop-types";

const InputError = ({ visible, text }) => {
  return (
    <tbody
      style={{
        display: "table",
        visibility: visible ? "visible" : "hidden",
        position: "absolute",
        transform: "translateY(-20%)",
        width: "100%", // Ensure the tbody takes up the full width
      }}
    >
      <tr>
        <td
          style={{
            textAlign: "center", // Center horizontally
            width: "100%", // Ensure the cell takes the full width
          }}
        >
          <div className="inputs-error-message">{text}</div>
        </td>
      </tr>
    </tbody>
  );
};

InputError.propTypes = {
  visible: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
};

export default InputError;
