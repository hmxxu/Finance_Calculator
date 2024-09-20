import React from "react";
import PropTypes from "prop-types";

const InputCheckBox = ({ text, onChange }) => {
  return (
    <tbody>
      <tr className="input-row">
        <td colSpan="5">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <label
              className="input-checkbox-text"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              {text}
              <input type="checkbox" onChange={onChange} />
              <span className="checkmark"></span>
            </label>
          </div>
        </td>
      </tr>
    </tbody>
  );
};

InputCheckBox.propTypes = {
  text: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default InputCheckBox;
