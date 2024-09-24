import React from "react";
import PropTypes from "prop-types";

const InputHeader = ({ header }) => {
  return (
    <thead>
      <tr>
        <td colSpan={6} className="input-header">
          {header}
        </td>
      </tr>
    </thead>
  );
};

InputHeader.propTypes = {
  header: PropTypes.string.isRequired,
};

export default InputHeader;
