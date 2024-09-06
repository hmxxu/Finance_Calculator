import React from "react";
import PropTypes from "prop-types";

const InputError = ({ visible, text }) => {
  return (
    <tbody
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <tr>
        <td
          colSpan={5}
          style={{
            position: "relative",
            textAlign: "center",
          }}
        >
          <div
            className="inputs-error-message"
            style={{ visibility: visible ? "visible" : "hidden" }}
          >
            {text}
          </div>
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
