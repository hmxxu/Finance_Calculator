import React, { useState, useEffect } from "react";
import "../styles/investmentTable.css";
import expandRight from "../svgs/expandRight.svg";

const SavedInputsTable = ({
  inputData,
  childAges,
  setId,
  deleteId,
  redirectURL,
}) => {
  // Sums and returns monthly expenses
  function getMonthlyExpenseTotal(inputs) {
    if (!inputs) return;

    const total = Object.entries(inputs)
      .filter(([key]) => key.startsWith("med_"))
      .reduce((sum, [, value]) => sum + value, 0);

    return formatM(total);
  }

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

  // Mapping for each attribute to their header and how to proccess their value
  const dataMap = new Map([
    ["calc_id", { name: "ID", process: null }],
    ["rd_currentAge", { name: "Current Age", process: null }],
    ["rd_retirementAge", { name: "Retirement Age", process: null }],
    ["rd_lifeExpectancy", { name: "Life Expectancy", process: null }],
    ["rd_income", { name: "Income", process: (x) => formatM(x) }],
    [
      "rd_incomeIncrease",
      { name: "Income Increase", process: (x) => formatP(x) },
    ],
    [
      "rd_investReturnRate",
      { name: "Investment Return", process: (x) => formatP(x) },
    ],
    ["rd_savings", { name: "Savings", process: (x) => formatM(x) }],
    [
      "rd_savingsContribution",
      {
        name: "Savings Contribution",
        process: (x) => formatP(x),
      },
    ],
    ["rd_checking", { name: "Checking", process: (x) => formatM(x) }],
    [
      "rd_checkingContribution",
      {
        name: "Checking Contribution",
        process: (x) => formatP(x),
      },
    ],
    [
      "rd_retirementIncomeNeeded",
      {
        name: "Retirement Cost/Year",
        process: (x) => formatM(x),
      },
    ],
    [
      "rd_retirementIncome",
      { name: "Retirement Income", process: (x) => formatM(x) },
    ],
    [
      "mad_marriageAge",
      {
        name: "Marriage Age",
        process: (x) => {
          if (!x) return "N/A";
          return x;
        },
      },
    ],
    ["mad_savings", { name: "Partner's Savings", process: (x) => formatM(x) }],
    [
      "mad_checking",
      {
        name: "Partner's Checking",
        process: (x) => formatM(x),
      },
    ],
    ["mad_income", { name: "Partner's Income", process: (x) => formatM(x) }],
    [
      "mad_childCostPerYear",
      { name: "Child Cost/Year", process: (x) => formatM(x) },
    ],
    [
      "mad_yearsOff",
      {
        name: "Years Off",
        process: (x) => {
          if (!x) return "N/A";
          return x;
        },
      },
    ],
    [
      "mad_divorceAge",
      {
        name: "Divorce Age",
        process: (x) => (x !== 999 ? x : "N/A"),
      },
    ],
    [
      "mad_included",
      { name: "Include Marriage", process: (x) => (x ? "Yes" : "No") },
    ],
    ["md_price", { name: "Mortgage Price", process: (x) => formatM(x) }],
    [
      "md_downPayment",
      {
        name: "Mortgage DownPayment",
        process: (x) => formatP(x),
      },
    ],
    [
      "md_term",
      {
        name: "Mortgage Term",
        process: (x) => {
          if (!x) return "N/A";
          return `${x} Years`;
        },
      },
    ],
    ["md_interest", { name: "Mortgage Interest", process: (x) => formatP(x) }],
    [
      "md_startAge",
      {
        name: "Mortgage Age",
        process: (x) => {
          if (!x) return "N/A";
          return x;
        },
      },
    ],
    [
      "md_priceType",
      {
        name: "Mortgage Type",
        process: (x) => {
          if (!x) return "N/A";
          return x.charAt(0).toUpperCase() + x.slice(1);
        },
      },
    ],

    [
      "md_inflation",
      { name: "Mortgage Inflation", process: (x) => formatP(x) },
    ],
    [
      "md_included",
      { name: "Include Mortgage", process: (x) => (x ? "Yes" : "No") },
    ],
    ["med_groceryFood", { name: "Grocery/Food", process: (x) => formatM(x) }],
    [
      "med_healthInsurance",
      { name: "Health Insurance", process: (x) => formatM(x) },
    ],
    ["med_carInsurance", { name: "Car Insurance", process: (x) => formatM(x) }],
    [
      "med_cellPhonePlan",
      { name: "CellPhone Plan", process: (x) => formatM(x) },
    ],
    ["med_utilities", { name: "Utilities", process: (x) => formatM(x) }],
    [
      "med_subscriptions",
      { name: "Subscriptions", process: (x) => formatM(x) },
    ],
    [
      "med_transportation",
      { name: "Transportation", process: (x) => formatM(x) },
    ],
    ["med_pet", { name: "Pet", process: (x) => formatM(x) }],
    ["med_others", { name: "Others", process: (x) => formatM(x) }],
  ]);

  // Columns in the non-expanded table
  const short = ["calc_id", "rd_income", "mad_included", "md_included"];

  // Columns and their order in the expanded table
  const long = [
    "calc_id",
    "rd_currentAge",
    "rd_retirementAge",
    "rd_lifeExpectancy",
    "rd_income",
    "rd_incomeIncrease",
    "rd_investReturnRate",
    "rd_savings",
    "rd_savingsContribution",
    "rd_checking",
    "rd_checkingContribution",
    "rd_retirementIncomeNeeded",
    "rd_retirementIncome",
    "mad_included",
    "mad_marriageAge",
    "mad_savings",
    "mad_checking",
    "mad_income",
    "mad_childCostPerYear",
    "mad_yearsOff",
    "mad_divorceAge",
    "md_included",
    "md_price",
    "md_downPayment",
    "md_term",
    "md_interest",
    "md_startAge",
    "md_priceType",
    "md_inflation",
    "med_groceryFood",
    "med_healthInsurance",
    "med_carInsurance",
    "med_cellPhonePlan",
    "med_utilities",
    "med_subscriptions",
    "med_transportation",
    "med_pet",
    "med_others",
  ];

  const [isExpanded, setIsExpanded] = useState(false);
  const [childAgeMap, setChildAgeMap] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(inputData);
  }, [inputData]);

  useEffect(() => {
    createChildAgesMap(childAges);
  }, [childAges]);

  // Creates a mapping from each calc_id to array of child ages
  async function createChildAgesMap(childAgesData) {
    if (!childAgesData) return;
    const map = new Map();
    childAgesData.forEach(({ calc_id, age }) => {
      if (!map.has(calc_id)) {
        map.set(calc_id, []);
      }
      map.get(calc_id).push(age);
    });
    setChildAgeMap(map);
  }

  const ShowButton = ({ id }) => (
    <td>
      <button
        className="action-show-button"
        onClick={() => {
          setId(id);
        }}
      >
        Show
      </button>
    </td>
  );

  const LoadButton = ({ id, index }) => (
    <button
      className="action-load-button"
      onClick={() => redirectURL(data[index], childAgeMap.get(id) || [])}
    >
      Load
    </button>
  );

  const ActionButtons = ({ id, index }) => (
    <td
      style={{
        display: "flex",
        gap: "0.3rem",
      }}
    >
      <LoadButton id={id} index={index} />
      <button
        className="action-remove-button"
        onClick={() => {
          deleteId(id);
          const newData = data.filter((_, i) => i !== index);
          setData(newData);
        }}
      >
        Remove
      </button>
    </td>
  );

  if (!data)
    return (
      <div
        style={{
          isplay: "flex",
          flexDirection: "column",
        }}
      >
        <div className="error-text">Failed to fetch data from database</div>
        <button
          className="reset-button"
          style={{
            width: "100%",
          }}
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    );

  if (data.length === 0)
    return <div className="error-text">No Saved Inputs</div>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
      className="investment-table-wrapper"
    >
      <div style={{ overflowX: "auto" }}>
        <table className="saved-inputs-table">
          <thead>
            {!isExpanded ? (
              // Shorten Table
              <tr className="saved-inputs-table-col-header">
                <td>Actions</td>
                {data.length > 0 &&
                  Object.entries(data[0]).map(([key, value], index) =>
                    short.includes(key) ? (
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
                    ) : null
                  )}
                <td>
                  Monthly
                  <br />
                  Expense
                </td>
                <td>Cars</td>
              </tr>
            ) : (
              // Expanded Table
              <tr className="saved-inputs-table-col-header">
                <td>Actions</td>
                {data.length > 0 &&
                  long.map((key, index) => (
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
                <td>Child Ages</td>
                <td>Cars</td>
              </tr>
            )}
          </thead>
          {!isExpanded ? (
            // Shorten Table
            <tbody>
              {data.map((input, index) => (
                <tr key={index}>
                  {index === 0 ? (
                    <td>
                      <div
                        style={{
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        <LoadButton id={input.calc_id} index={index} />
                      </div>
                    </td>
                  ) : (
                    <ActionButtons id={input.calc_id} index={index} />
                  )}
                  {Object.entries(input).map(([key, value], index) =>
                    short.includes(key) ? (
                      <td key={index}>
                        {dataMap.get(key).process
                          ? dataMap.get(key).process(value)
                          : value}
                      </td>
                    ) : null
                  )}
                  <td>{getMonthlyExpenseTotal(input)}</td>
                  <ShowButton id={input.calc_id} />
                </tr>
              ))}
            </tbody>
          ) : (
            // Expanded Table
            <tbody>
              {data.map((input, index) => (
                <tr key={index}>
                  {index === 0 ? (
                    <td>
                      <LoadButton id={input.calc_id} index={index} />
                    </td>
                  ) : (
                    <ActionButtons id={input.calc_id} index={index} />
                  )}
                  {long.map((key, index) => (
                    <td key={index}>
                      {dataMap.get(key) && dataMap.get(key).process
                        ? dataMap.get(key).process(input[key]) // Process the value if a processing function exists
                        : input[key]}
                    </td>
                  ))}
                  <td>
                    {childAgeMap.has(input.calc_id)
                      ? childAgeMap.get(input.calc_id)?.join(",")
                      : "N/A"}
                  </td>
                  <ShowButton id={input.calc_id} />
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      {/* expand button */}
      <div
        className="saved-inputs-table-expand"
        style={{
          borderLeft: isExpanded ? "solid 1px #bbbbbb" : "none",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <img
          src={expandRight}
          alt="expandRight"
          height="100%"
          width="20px"
          style={{ transform: isExpanded ? "rotate(180deg)" : "" }}
        />
      </div>
    </div>
  );
};

export default SavedInputsTable;
