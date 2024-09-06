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
import AdditionCarLoans from "../components/inputTables/AdditionCarLoans";
import FilledCarPaymentInputBox from "../components/inputTables/FilledCarPaymentInputBox";
import MarriageInputBox from "../components/inputTables/MarriageInputBox";
import MontlyExpensesInputBox from "../components/inputTables/MontlyExpensesInputBox";
import InputError from "../components/inputTables/inputTableComponenets/InputError";

const Home = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 768px)");
  const [retirementData, setRetirementData] = useState(null);
  const [mortgageData, setMortgageData] = useState(null);
  const [marriageData, setMarriageData] = useState(null);
  const [monthlyExpensesData, setMonthlyExpensesData] = useState(null);

  const [results, setResults] = useState(null);

  const [carPaymentData, setCarPaymentData] = useState([]);
  const [carIntervalData, setCarIntervalData] = useState([]);

  const [carLoanCount, setCarLoanCount] = useState(0);
  const [carLoanType, setCarLoanType] = useState("normal");

  const [lastAssetInputs, setLastAssetInputs] = useState(null);

  function calculateButton() {
    const carLoanData =
      carLoanType === "normal" ? carPaymentData : carIntervalData;
    const res = calculateResults(
      retirementData,
      mortgageData,
      carLoanData,
      marriageData,
      monthlyExpensesData
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
  }, [carPaymentData, carLoanCount]);

  function createCDInterval(inputs) {
    if (
      retirementData === null ||
      retirementData.currentAge === null ||
      retirementData.lifeExpectancy === null
    )
      return;
    setLastAssetInputs(inputs);
    const cdIntervals = [];
    let currentPrice = inputs.startPrice;
    for (
      let age = inputs.startAge;
      age <= retirementData.lifeExpectancy;
      age += inputs.xYears
    ) {
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
          {/* Retirement, Mortgage, Marriage, Monthly Expenses */}
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              flexDirection: isAboveMediumScreens ? "row" : "column",
              gap: "2rem",
            }}
          >
            {/* Left Side (Retirement and Marriage)*/}
            <div
              style={{
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
              }}
            >
              <div>
                <RetirementInputBox
                  setRetirementData={setRetirementData}
                  homePage={true}
                />
              </div>
              <div style={{ display: isAboveMediumScreens ? "flex" : "" }}>
                <MarriageInputBox
                  setMarriageData={setMarriageData}
                  currentAge={retirementData ? retirementData.currentAge : 0}
                  lifeExpetency={
                    retirementData ? retirementData.lifeExpectancy : 0
                  }
                />
              </div>
            </div>

            {/* Right Side (Mortgage and Monthly Expenses*/}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                width: isAboveMediumScreens ? "" : "100%",
              }}
            >
              <div style={{ display: isAboveMediumScreens ? "flex" : "" }}>
                <MortgageInputBox
                  setMortgageData={setMortgageData}
                  homePage={true}
                  currentAge={retirementData ? retirementData.currentAge : 0}
                  lifeExpetency={
                    retirementData ? retirementData.lifeExpectancy : 0
                  }
                />
              </div>
              <div style={{ width: "100%" }}>
                <MontlyExpensesInputBox
                  setMonthlyExpensesData={setMonthlyExpensesData}
                />
              </div>
            </div>
          </div>
          {/* Addition Assets */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: isAboveMediumScreens ? "row" : "column",
            }}
          >
            <AdditionCarLoans
              setCarLoanType={setCarLoanType}
              setCarLoanCount={setCarLoanCount}
              setCDInterval={createCDInterval}
              currentAge={retirementData ? retirementData.currentAge : 0}
              lifeExpetency={retirementData ? retirementData.lifeExpectancy : 0}
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
            <InputError
              visible={
                results !== null && results[0][results[0].length - 1][5] < 0
              }
              text="Cannot afford payments, consider increasing income or decreases expenses or assets"
            />
            <tbody style={{ height: "10px" }} />
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
              <InvestmentGraph data={results[0]} dataType={5} />
              <InvestmentGraph data={results[0]} dataType={6} />
            </div>
            <div style={{ marginLeft: "auto", marginRight: "auto" }}>
              <ResultsTable
                header="Results"
                results={results[1]}
                resetOnClick={() => window.location.reload()}
              />
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
