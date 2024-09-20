import React from "react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import ResultsTable from "../components/ResultsTable";
import CarPaymentInputBox from "../components/inputTables/CarPaymentInputBox";
import { calculateResults } from "../calculateCarPayment";
import useMediaQuery from "../hooks/useMediaQuery";

const CarPaymentCalculator = () => {
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
          paddingTop: "7rem",
          display: "flex",
          flexDirection: isAboveMediumScreens ? "row" : "column",
          justifyContent: "center",
          gap: "2rem",
        }}
      >
        <div>
          <CarPaymentInputBox setCarPaymentInputs={calculate} />
        </div>

        {results && (
          <div>
            <ResultsTable
              header="Results"
              results={results}
              resetOnClick={() => window.location.reload()}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CarPaymentCalculator;
