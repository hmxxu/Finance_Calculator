import React from "react";
import PropTypes from "prop-types";

const InputError = ({ visible, text }) => {
  return (
    <tbody
      style={{
        visibility: visible ? "visible" : "hidden",
      }}
    >
      <tr>
        <td colSpan="5" style={{ padding: "0px" }}>
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
