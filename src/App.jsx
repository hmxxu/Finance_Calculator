import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InvestmentCalculator from "./pages/InvestmentCalculator";
import RetirementAgeCalculator from "./pages/RetirementAgeCalculator";
import MortgageCalculator from "./pages/MortgageCalculator";
import CarPaymentCalculator from "./pages/CarPaymentCalculator";
import NoPage from "./pages/NoPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/investment-calculator"
            element={<InvestmentCalculator />}
          />
          <Route
            path="/retirement-age-calculator"
            element={<RetirementAgeCalculator />}
          />
          <Route path="/mortgage-calculator" element={<MortgageCalculator />} />
          <Route
            path="/car-payment-calculator"
            element={<CarPaymentCalculator />}
          />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
