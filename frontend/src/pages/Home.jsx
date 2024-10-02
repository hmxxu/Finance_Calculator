import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import AiChatbot from "../components/AiChatbot";
import Popups from "../components/Popups";

const Home = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 768px)");
  const navigate = useNavigate();
  const [retirementData, setRetirementData] = useState(null);
  const [mortgageData, setMortgageData] = useState(null);
  const [marriageData, setMarriageData] = useState(null);
  const [monthlyExpensesData, setMonthlyExpensesData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [results, setResults] = useState(null);

  const [carPaymentData, setCarPaymentData] = useState([]);
  const [carIntervalData, setCarIntervalData] = useState([]);

  const [carLoanCount, setCarLoanCount] = useState(0);
  const [carLoanType, setCarLoanType] = useState("normal");

  const [lastAssetInputs, setLastAssetInputs] = useState(null);
  const [popupTexts, setPopupsTexts] = useState([]);
  const resultRef = useRef(null);

  // If carLoanCount is decremented, trim carPaymentData
  useEffect(() => {
    if (carLoanCount < carPaymentData.length) {
      setCarPaymentData((prevData) => prevData.slice(0, carLoanCount));
    }
  }, [carPaymentData, carLoanCount]);

  // Rerender interval car inputs if current age or life expectancy changes
  useEffect(() => {
    if (lastAssetInputs === null || carLoanType === "normal") return;
    createCDInterval(lastAssetInputs);
  }, [retirementData?.currentAge, retirementData?.lifeExpectancy]);

  // Add a popup that only last for 2 seconds
  const addPopup = (text, color) => {
    setPopupsTexts((prevTexts) => [{ text: text, color: color }, ...prevTexts]);
    setTimeout(() => {
      setPopupsTexts((prevTexts) => prevTexts.slice(0, -1));
    }, 6000); // 2 seconds
  };

  function calculateButton() {
    const carLoanData =
      carLoanType === "normal" ? carPaymentData : carIntervalData;

    // Check if any of the input boxes have null values
    if (
      !retirementData ||
      !mortgageData ||
      !marriageData ||
      !monthlyExpensesData ||
      !carLoanData ||
      carLoanData.some((value) => value === null)
    ) {
      addPopup("One of the inputs are invalid", "red");
      setErrorMessage("One of the inputs are invalid");
      return;
    }
    const res = calculateResults(
      retirementData,
      mortgageData,
      carLoanData,
      marriageData,
      monthlyExpensesData
    );
    setResults(res);
    if (res !== null && res[0][res[0].length - 1][5] < 0) {
      addPopup(
        "Cannot afford payments, consider increasing income or decreasing expenses and/or assets",
        "red"
      );
      setErrorMessage(
        "Cannot afford payments, consider increasing income or decreasing expenses and/or assets"
      );
    } else {
      setErrorMessage("");
    }

    // Scroll to results (wait for results to render first)
    setTimeout(() => {
      if (resultRef.current) {
        window.scrollTo({
          top: resultRef.current.offsetTop - 140,
          behavior: "smooth",
        });
      }
    }, 100);
  }

  const updateCarPaymentData = (index, newData) => {
    setCarPaymentData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = newData;
      return updatedData;
    });
  };

  function createCDInterval(inputs) {
    if (
      !inputs ||
      retirementData === null ||
      retirementData.currentAge === null ||
      retirementData.lifeExpectancy === null
    ) {
      setCarIntervalData(null);
      return;
    }

    setLastAssetInputs(inputs);
    const cdIntervals = [];
    let currentPrice = inputs.startPrice;
    for (
      let age = inputs.startAge;
      age < retirementData.lifeExpectancy;
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

  const saveInputs = () => {
    const carLoanData =
      carLoanType === "normal" ? carPaymentData : carIntervalData;
    fetch("http://localhost:8081/insertSavedInputs", {
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
      .then((data) => {
        console.log(data);
        addPopup("Successfully saved input", "green"); // Add popup here
      })
      .catch((err) => {
        addPopup("Error connecting to database", "red");
        console.log(err);
      });
  };

  return (
    <div className="App">
      <Navbar />
      <Popups popupsTexts={popupTexts} />
      <AiChatbot />

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
            marginLeft: "auto",
            marginRight: "auto",
            // overflowX: "auto",
          }}
        ></div>
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
                currentAge={retirementData ? retirementData.currentAge : null}
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
                currentAge={retirementData ? retirementData.currentAge : null}
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
                currentAge={retirementData ? retirementData.currentAge : null}
                lifeExpetency={
                  retirementData ? retirementData.lifeExpectancy : 0
                }
              />
            </div>
          </div>
          {/* Car Input boxes */}
          {((carLoanType === "normal" && carLoanCount > 0) ||
            (carLoanType === "interval" &&
              carIntervalData &&
              carIntervalData.length > 0)) && (
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
                          retirementData ? retirementData.currentAge : null
                        }
                        lifeExpetency={
                          retirementData ? retirementData.lifeExpectancy : 0
                        }
                        index={index}
                      />
                    </div>
                  ))
                : carIntervalData.map((cd, index) => (
                    <div style={{ display: "flex" }} key={index}>
                      <FilledCarPaymentInputBox
                        header={"Car At Age " + cd.startAge}
                        price={cd.price}
                        startAge={cd.startAge}
                        currentAge={
                          retirementData ? retirementData.currentAge : null
                        }
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
            <InputError visible={errorMessage !== ""} text={errorMessage} />
            <tbody style={{ height: isAboveMediumScreens ? "15px" : "35px" }} />
            <tbody>
              <tr>
                <td
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "1rem",
                    justifyContent: "center",
                  }}
                >
                  {/* Load Saved Input Button */}
                  <button
                    onClick={() => navigate("/saved-inputs")}
                    className="save-button"
                  >
                    Load Saved Input
                  </button>
                  {/* Save Input button */}
                  <button onClick={() => saveInputs()} className="save-button">
                    Save Inputs
                  </button>
                </td>
              </tr>
            </tbody>
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
            ref={resultRef}
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
