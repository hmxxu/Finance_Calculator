import React from "react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import InvestmentGraph from "../components/InvestmentGraph";
import InvestmentTable from "../components/InvestmentTable";
import { createRows } from "../calculateInvestmentRows";
import InvestmentInputBox from "../components/inputTables/InvestmentInputBox";
import useMediaQuery from "../hooks/useMediaQuery";

const InvestmentCalculator = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 768px)");
  const [results, setResults] = useState(null);

  function calculate(inputs) {
    const values = Object.values(inputs);
    const rows = createRows(...values);
    setResults(rows);
  }

  return (
    <div>
      <Navbar />
      <div
        style={{
          paddingTop: "7rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <InvestmentInputBox setInvestmentData={calculate} />
        </div>
        <div
          style={{
            marginTop: "25px",
            display: "flex",
            justifyContent: "center",
            gap: isAboveMediumScreens ? "90px" : "20px",
            flexDirection: isAboveMediumScreens ? "row" : "column",
          }}
        >
          {results && <InvestmentGraph data={results} dataType={5} />}
          {results && <InvestmentGraph data={results} dataType={4} />}
        </div>
        {results && <InvestmentTable data={results} />}
      </div>
    </div>
  );
};

export default InvestmentCalculator;
