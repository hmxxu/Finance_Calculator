import React from "react";
import PropTypes from "prop-types";
import InputHeader from "./inputTables/inputTableComponenets/InputHeader";
import { formatToMoney } from "../utils/helperFunctions";

const ResultsTable = ({ header, results, resetOnClick }) => {
  return (
    <table className="input-table">
      <InputHeader header={header} />
      <tbody>
        {results.map(([label, value], index) =>
          value ? (
            <tr key={index}>
              <td
                style={{
                  paddingRight: "20px",
                  borderBottom: "2px solid #d6d6d6",
                }}
              >
                {label}:
              </td>
              <td
                style={{
                  paddingRight: "10px",
                  borderBottom: "2px solid #d6d6d6",
                }}
              >
                {typeof value === "number" ? formatToMoney(value) : value}
              </td>
            </tr>
          ) : (
            <tr key={index}>
              <td
                colSpan="5"
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "20px",
                  borderBottom: "2px solid #ababab",
                }}
              >
                {label}
              </td>
            </tr>
          )
        )}
        <tr>
          <td colSpan="5">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <button className="reset-button" onClick={resetOnClick}>
                Reset
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

ResultsTable.propTypes = {
  header: PropTypes.string,
  results: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  ),
  resetOnClick: PropTypes.func,
};

export default ResultsTable;
