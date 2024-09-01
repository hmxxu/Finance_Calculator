import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RetirementInputBox from "../components/inputTables/RetirementInputBox";
import MortgageInputBox from "../components/inputTables/MortgageInputBox";
import CarPaymentInputBox from "../components/inputTables/CarPaymentInputBox";
import { calculateResults } from "../calculateHome";
import InvestmentTable from "../components/InvestmentTable";
import InvestmentGraph from "../components/InvestmentGraph";
import ResultsTable from "../components/ResultsTable";
import useMediaQuery from "../hooks/useMediaQuery";
import InputButton from "../components/inputTables/inputTableComponenets/InputButton";
import AdditionCarLoans from "../components/AdditionCarLoans";

const Home = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 768px)");
  const [retirementData, setRetirementData] = useState(null);

  const [mortgageData, setMortgageData] = useState(null);
  const [carPaymentData, setCarPaymentData] = useState([]);
  const [results, setResults] = useState(null);
  const [carLoanCount, setCarLoanCount] = useState(0);

  function calculateButton() {
    const res = calculateResults(retirementData, mortgageData, carPaymentData);
    setResults(res);
  }

  const updateCarPaymentData = (index, newData) => {
    setCarPaymentData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = newData;
      return updatedData;
    });
  };

  useEffect(() => {
    // Delete/pop if carLoanCount is decremented
    if (carLoanCount < carPaymentData.length) carPaymentData.pop();
  }, [carLoanCount, carPaymentData]);

  return (
    <div className="App">
      <Navbar />
      <div
        style={{
          marginTop: "7rem",
          display: "flex",
          flexDirection: "column",
          gap: carLoanCount > 0 ? "2rem" : "0",
        }}
      >
        {/* Inputs boxes  */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          {/* Retirement, Mortgage, Addition Assets inputs */}
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              flexDirection: isAboveMediumScreens ? "row" : "column",
              gap: "2rem",
            }}
          >
            {/* Left Side (Retirement input)*/}
            <div>
              <RetirementInputBox
                setRetirementData={setRetirementData}
                homePage={true}
              />
            </div>
            {/* Right Side (Mortgage and Addition Assets inputs)*/}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                width: isAboveMediumScreens ? "" : "100%",
              }}
            >
              <MortgageInputBox
                setMortgageData={setMortgageData}
                homePage={true}
                currentAge={retirementData ? retirementData.currentAge : 0}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: "auto",
              marginRight: "auto",
              width: isAboveMediumScreens ? "400px" : "95%",
            }}
          >
            <AdditionCarLoans />
          </div>
          {/* Car Input boxes */}
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              flexDirection: isAboveMediumScreens ? "row" : "column",
              maxWidth: isAboveMediumScreens ? "967px" : "",
              width: "100%",
            }}
          >
            {Array.from({ length: carLoanCount }).map((_, index) => (
              <CarPaymentInputBox
                key={index}
                setCarPaymentInputs={(newData) =>
                  updateCarPaymentData(index, newData)
                }
                homePage={true}
                currentAge={retirementData ? retirementData.currentAge : 0}
              />
            ))}
          </div>

          <table
            style={{ marginLeft: "auto", marginRight: "auto", width: "100%" }}
          >
            <InputButton
              calcOnClick={calculateButton}
              resetOnClick={() => window.location.reload()}
            />
          </table>
        </div>
        {/* Results */}
        {results && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Result Table and Graph */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: isAboveMediumScreens ? "2rem" : "1rem",
                flexDirection: isAboveMediumScreens ? "row" : "column",
              }}
            >
              <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                <ResultsTable
                  header="Results"
                  results={results[1]}
                  resetOnClick={() => window.location.reload()}
                />
              </div>
              <InvestmentGraph data={results[0]} dataType={5} />
            </div>
            {/* Result Table */}
            <InvestmentTable data={results[0]} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
