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
import InputHeader from "../components/inputTables/inputTableComponenets/InputHeader";
import InputCounter from "../components/inputTables/inputTableComponenets/InputCounter";
import InputButton from "../components/inputTables/inputTableComponenets/InputButton";

const Home = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 768px)");
  const [retirementData, setRetirementData] = useState(null);

  const [mortgageData, setMortgageData] = useState(null);
  const [carPaymentData, setCarPaymentData] = useState([]);
  const [results, setResults] = useState(null);
  //   const [mortgageCount, setmortgageCount] = useState(0);
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
  }, [carLoanCount]);

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
              <div style={{ width: isAboveMediumScreens ? "" : "100%" }}>
                <MortgageInputBox
                  setMortgageData={setMortgageData}
                  homePage={true}
                  currentAge={retirementData ? retirementData.currentAge : 0}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  width: isAboveMediumScreens ? "100%" : "95%",
                  flexGrow: 1,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <table
                  className="input-table"
                  style={{
                    width: "100%",
                  }}
                >
                  <InputHeader header="Addition Assets" />
                  {/* <InputCounter
                    leftText="Number of Mortgages:"
                    setCounter={setmortgageCount}
                    maxCount={9}
                  /> */}
                  <InputCounter
                    leftText="Number of Car Loans:"
                    setCounter={setCarLoanCount}
                    maxCount={9}
                  />
                  <InputButton
                    calcOnClick={calculateButton}
                    resetOnClick={() => window.location.reload()}
                  />
                </table>
              </div>
            </div>
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
