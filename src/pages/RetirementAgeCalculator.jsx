import React from "react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import InvestmentGraph from "../components/InvestmentGraph";
import InvestmentTable from "../components/InvestmentTable";
import ResultsTable from "../components/ResultsTable";
import { calculateResults } from "../calculateRetirementAge";
import RetirementInputBox from "../components/inputTables/RetirementInputBox";
import useMediaQuery from "../hooks/useMediaQuery";

const RetirementAgeCalculator = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 768px)");
  const [results, setResults] = useState(null);

  const calculate = (inputs) => {
    const values = Object.values(inputs);
    const res = calculateResults(...values);
    setResults(res);
  };

  return (
    <div>
      <Navbar />
      <div
        style={{
          display: "flex",
          gap: "1rem",
          paddingTop: "7rem",
          flexDirection: "column",
        }}
      >
        {!results && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div>
              <RetirementInputBox setRetirementData={calculate} />
            </div>
          </div>
        )}
        {results && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
              marginTop: "25px",
              flexDirection: isAboveMediumScreens ? "row" : "column",
            }}
          >
            <div>
              <ResultsTable
                header="Results"
                results={results[1]}
                resetOnClick={() => window.location.reload()}
              />
            </div>
            <InvestmentGraph data={results[0]} dataType={5} />
          </div>
        )}
        {results && (
          <div>
            <InvestmentTable data={results[0]} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RetirementAgeCalculator;
