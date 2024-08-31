import React from "react";
import PropTypes from "prop-types";
import "../styles/investmentTable.css";

const InvestmentTable = ({ data }) => {
  // Formats balance into a money string with $ and commas
  function formatToMoney(bal) {
    return "$" + bal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return (
    <div
      className="investment-table-wrapper"
      style={{
        paddingBottom: "10px",
      }}
    >
      <table className="investment-table">
        <thead>
          <tr className="investment-table-col-header">
            {data[0].map((header, index) => (
              <td key={index}>{header}</td>
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
