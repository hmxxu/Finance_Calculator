import React from "react";
import PropTypes from "prop-types";
import "../styles/investmentTable.css";
import { formatToMoney } from "../utils/helperFunctions";

const InvestmentTable = ({ data }) => {
  return (
    <div
      className="investment-table-wrapper"
      style={{
        paddingBottom: "10px",
      }}
    >
      <table className="investment-table">
        <thead>
          {/* Break each word into its own line */}
          <tr className="investment-table-col-header">
            {data[0].map((header, index) => (
              <td key={index}>
                {header.split(" ").map((word, i) => (
                  <span key={i}>
                    {word}
                    <br />
                  </span>
                ))}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex} style={{ borderBottom: "1px solid #E5E5E5" }}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  {cellIndex === 0 ? cell : formatToMoney(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

InvestmentTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
      .isRequired
  ),
};

export default InvestmentTable;
