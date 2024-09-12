import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InvestmentCalculator from "./pages/InvestmentCalculator";
import RetirementAgeCalculator from "./pages/RetirementAgeCalculator";
import MortgageCalculator from "./pages/MortgageCalculator";
import CarPaymentCalculator from "./pages/CarPaymentCalculator";
import NoPage from "./pages/NoPage";

function App() {
  return (
    <div>
      <HashRouter>
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
      </HashRouter>
    </div>
  );
}

export default App;
