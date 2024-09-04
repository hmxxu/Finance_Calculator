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
import FilledCarPaymentInputBox from "../components/inputTables/FilledCarPaymentInputBox";
import MarriageInputBox from "../components/inputTables/MarriageInputBox";

const Home = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 768px)");
  const [retirementData, setRetirementData] = useState(null);

  const [mortgageData, setMortgageData] = useState(null);
  const [marriageData, setMarriageData] = useState(null);
  const [results, setResults] = useState(null);

  const [carPaymentData, setCarPaymentData] = useState([]);
  const [carLoanCount, setCarLoanCount] = useState(0);
  const [carLoanType, setCarLoanType] = useState("normal");
  const [carIntervalData, setCarIntervalData] = useState([]);

  const [lastAssetInputs, setLastAssetInputs] = useState(null);

  function calculateButton() {
    const carLoanData =
      carLoanType === "normal" ? carPaymentData : carIntervalData;
    const res = calculateResults(
      retirementData,
      mortgageData,
      carLoanData,
      marriageData
    );
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
    // If carLoanCount is decremented, trim carPaymentData
    if (carLoanCount < carPaymentData.length) {
      setCarPaymentData((prevData) => prevData.slice(0, carLoanCount));
    }
  }, [carPaymentData]);

  function createCDInterval(inputs) {
    if (
      retirementData === null ||
      retirementData.currentAge === null ||
      retirementData.lifeExpectancy === null
    )
      return;
    setLastAssetInputs(inputs);
    const startAge = retirementData.currentAge;
    const endAge = retirementData.lifeExpectancy;
    const cdIntervals = [];
    let currentPrice = inputs.startPrice;
    for (let age = startAge; age <= endAge; age += inputs.xYears) {
      cdIntervals.push({
        price: currentPrice,
        term: 60,
        interest: 6.89,
        downPayment: 20,
        salesTax: 8.52,
        fees: 2300,
        startAge: age,
        inflation: 3.7,
      });
      currentPrice += inputs.priceIncrease;
    }
    setCarIntervalData(cdIntervals);
  }
  function recallCreateCDInterval() {
    if (lastAssetInputs === null) return;
    createCDInterval(lastAssetInputs);
  }
  useEffect(() => {
    recallCreateCDInterval();
  }, [retirementData?.currentAge, retirementData?.lifeExpectancy]);

  return (
    <div className="App">
      <Navbar />
      <div
        style={{
          marginTop: "5rem",
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
            paddingTop: "2rem",
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
                lifeExpetency={
                  retirementData ? retirementData.lifeExpectancy : 0
                }
              />
              <div>
                <MarriageInputBox
                  setMarriageData={setMarriageData}
                  currentAge={retirementData ? retirementData.currentAge : 0}
                  lifeExpetency={
                    retirementData ? retirementData.lifeExpectancy : 0
                  }
                />
              </div>
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
            <AdditionCarLoans
              setCarLoanType={setCarLoanType}
              setCarLoanCount={setCarLoanCount}
              setCDInterval={createCDInterval}
            />
          </div>
          {/* Car Input boxes */}
          {((carLoanType === "normal" && carLoanCount > 0) ||
            (carLoanType === "interval" && carIntervalData.length > 0)) && (
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
              {carLoanType === "normal"
                ? Array.from({ length: carLoanCount }).map((_, index) => (
                    <CarPaymentInputBox
                      key={index}
                      setCarPaymentInputs={(newData) =>
                        updateCarPaymentData(index, newData)
                      }
                      homePage={true}
                      currentAge={
                        retirementData ? retirementData.currentAge : 0
                      }
                      lifeExpetency={
                        retirementData ? retirementData.lifeExpectancy : 0
                      }
                    />
                  ))
                : carIntervalData.map((cd, index) => (
                    <FilledCarPaymentInputBox
                      key={index}
                      header={"Car At Age " + cd.startAge}
                      price={cd.price}
                      startAge={cd.startAge}
                      currentAge={retirementData.currentAge}
                    />
                  ))}
            </div>
          )}

          <table
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              width: isAboveMediumScreens ? "100%" : "95%",
            }}
          >
            <InputButton
              calcOnClick={calculateButton}
              resetOnClick={() => window.location.reload()}
            />
          </table>
        </div>
        {/* Results */}
        {results && (
          <div className="horizontal-divider">
            <span className="horizontal-divider-text">Results</span>
          </div>
        )}
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
