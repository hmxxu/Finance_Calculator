import React from "react";
import PropTypes from "prop-types";
import "../styles/investmentTable.css";
import { formatToMoney } from "../helperFunctions";

const InvestmentTable = ({ data }) => {
  const headers = [
    "ID",
    "Current Age",
    "Retirement Age",
    "Life Expectancy",
    "Income",
    "Income Increase",
    "Investment Return",
    "Savings",
    "Savings Contribution",
    "Checking",
    "Checking Contribution",
    "Retirement Cost/Year",
    "Retirement Income",
    "Marriage Age",
    "Partner's Savings",
    "Partner's Checking",
    "Partner's Income",
    "Child Cost/Year",
    "Years Off",
    "Divorce Age",
    "Include Marriage",
    "Mortgage Price",
    "Mortgage DownPayment",
    "Mortgage Term",
    "Mortgage Interest",
    "Mortgage Age",
    "Mortgage Type",
    "Mortgage Inflation",
    "Included Mortgage",
    "Grocery/Food",
    "Health Insurance",
    "Car Insurance",
    "CellPhone Plan",
    "Utilities",
    "Subscriptions",
    "Transportation",
    "Pet",
    "Others",
  ];
  return (
    <div
      className="investment-table-wrapper"
      style={{
        paddingBottom: "10px",
      }}
    >
      {data && data.length > 0 && (
        <table className="saved-inputs-table">
          <thead>
            {/* Break each word into its own line */}
            <tr
              className="saved-inputs-table-col-header"
              style={{ textAlign: "center" }}
            >
              {headers.map((header, index) => (
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
            {data.map((input, index) => (
              <tr key={index} style={{ textAlign: "center" }}>
                {Object.values(input).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
