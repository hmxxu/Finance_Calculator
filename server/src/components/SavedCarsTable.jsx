import React from "react";
import "../styles/investmentTable.css";

const SavedCarsTable = ({ data, id }) => {
  // Mapping for each attribute to their header and how to proccess their value
  const dataMap = new Map([
    ["price", { name: "Price", process: (x) => formatM(x) }],
    ["term", { name: "Term (Months)", process: null }],
    ["interest", { name: "Interest Rate", process: (x) => formatP(x) }],
    ["downPayment", { name: "Down Payment", process: (x) => `${x}%` }],
    ["salesTax", { name: "Sales Tax", process: (x) => formatP(x) }],
    ["fees", { name: "Fees", process: (x) => formatM(x) }],
    ["startAge", { name: "Start Age", process: null }],
    ["inflation", { name: "Inflation Rate", process: (x) => formatP(x) }],
  ]);

  // Format function for money
  function formatM(x) {
    if (!x) return "N/A";
    return "$" + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Format function for percent
  function formatP(x) {
    if (!x) return "N/A";
    return x + "%";
  }

  if (!data || !id) return null;

  if (data.length === 0)
    return (
      <div
        style={{
          color: "red",
          fontFamily: "caption",
          pointerEvents: "none",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Calculation#{id} does not have any car
      </div>
    );

  return (
    <div className="investment-table-wrapper">
      <table className="saved-inputs-table">
        <thead>
          <tr
            className="saved-inputs-table-col-header"
            style={{ fontSize: "20px" }}
          >
            <td colSpan={100}>Cars From Calculation #{id}</td>
          </tr>
        </thead>
        <thead>
          <tr className="saved-inputs-table-col-header">
            {data &&
              data.length > 0 &&
              Object.entries(data[0])
                .slice(2)
                .map(([key, value], index) => (
                  <td key={index}>
                    {dataMap
                      .get(key)
                      .name.split(" ")
                      .map((word, i) => (
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
            <tr key={index}>
              {Object.entries(input)
                .slice(2)
                .map(([key, value], index) => (
                  <td key={index}>
                    {dataMap.get(key).process
                      ? dataMap.get(key).process(value)
                      : value}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SavedCarsTable;
