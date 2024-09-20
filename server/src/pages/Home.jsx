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
import MontlhyExpensesInputBox from "../components/inputTables/MonthlyExpensesInputBox";
import InputError from "../components/inputTables/inputTableComponenets/InputError";
import SavedInputsTable from "../components/SavedInputsTable";

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

  const [savedInputs, setSavedInputs] = useState(null);

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
    console.log(res[0]);
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

  const saveInputs = () => {
    const carLoanData =
      carLoanType === "normal" ? carPaymentData : carIntervalData;
    fetch("http://localhost:8081/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rd: retirementData,
        md: mortgageData,
        cds: carLoanData,
        mad: marriageData,
        med: monthlyExpensesData,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  function fetchSavedInputs() {
    fetch("http://localhost:8081/savedInputs")
      .then((res) => res.json())
      .then((data) => {
        setSavedInputs(data);
        console.log(data);
      })
      .catch((err) => console.log(err));
  }

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
        <div
          style={{
            display: "flex",
            paddingTop: "2rem",
            maxWidth: "80%",
            marginLeft: "auto",
            marginRight: "auto",
            overflowX: "auto",
          }}
        >
          {savedInputs === null && (
            <button
              onClick={() => {
                fetchSavedInputs();
              }}
            >
              Load Prev Inputs
            </button>
          )}
          <SavedInputsTable data={savedInputs} />
        </div>
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

              <MarriageInputBox
                setMarriageData={setMarriageData}
                currentAge={retirementData ? retirementData.currentAge : 0}
                lifeExpetency={
                  retirementData ? retirementData.lifeExpectancy : 0
                }
              />
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
              <MortgageInputBox
                setMortgageData={setMortgageData}
                homePage={true}
                currentAge={retirementData ? retirementData.currentAge : 0}
                lifeExpetency={
                  retirementData ? retirementData.lifeExpectancy : 0
                }
              />
              <MontlhyExpensesInputBox
                setMonthlyExpensesData={setMonthlyExpensesData}
              />
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
            <div>
              <AdditionCarLoans
                setCarLoanType={setCarLoanType}
                setCarLoanCount={setCarLoanCount}
                setCDInterval={createCDInterval}
                currentAge={retirementData ? retirementData.currentAge : 0}
                lifeExpetency={
                  retirementData ? retirementData.lifeExpectancy : 0
                }
              />
            </div>
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
                    <div style={{ display: "flex" }} key={index}>
                      <CarPaymentInputBox
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
                    </div>
                  ))
                : carIntervalData.map((cd, index) => (
                    <div style={{ display: "flex" }} key={index}>
                      <FilledCarPaymentInputBox
                        header={"Car At Age " + cd.startAge}
                        price={cd.price}
                        startAge={cd.startAge}
                        currentAge={retirementData.currentAge}
                      />
                    </div>
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
              text="Cannot afford payments, consider increasing income or decreasing expenses and/or assets"
            />
            <tbody style={{ height: isAboveMediumScreens ? "5px" : "20px" }} />
            <div>
              <button
                onClick={() => saveInputs()}
                style={{
                  display: "flex",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Save Inputs
              </button>
            </div>
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
              gap: "1rem",
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
