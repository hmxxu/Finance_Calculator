import React from "react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import ResultsTable from "../components/ResultsTable";
import InvestmentTable from "../components/InvestmentTable";
import MortgageInputBox from "../components/inputTables/MortgageInputBox";
import { calculateResults } from "../calculateMortgage";
import useMediaQuery from "../hooks/useMediaQuery";

const MortgageCalculator = () => {
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
          paddingTop: "7rem",
          gap: "1rem",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            flexDirection: isAboveMediumScreens ? "row" : "column",
          }}
        >
          <div>
            <MortgageInputBox setMortgageData={calculate} />
          </div>
          {results && (
            <div>
              <ResultsTable
                header="Results"
                results={results[1]}
                resetOnClick={() => window.location.reload()}
              />
            </div>
          )}
        </div>
        {results && <InvestmentTable data={results[0]} />}
      </div>
    </div>
  );
};

export default MortgageCalculator;
