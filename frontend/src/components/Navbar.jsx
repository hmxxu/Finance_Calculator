import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import icon from "../svgs/calculator.svg";
import "../App.css";
import useMediaQuery from "../hooks/useMediaQuery";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const navigate = useNavigate();
  const isAboveMediumScreens = useMediaQuery("(min-width: 768px)");
  const [isMenuToggled, setIsMenuToggled] = useState(false);

  return (
    <nav>
      <div
        style={{
          backgroundColor: "#003366",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "fixed",
          top: 0,
          zIndex: 30,
          width: "100%",
          paddingTop: "1.5rem",
          paddingBottom: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "0 auto",
            width: "83.3333%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: "4rem",
            }}
          >
            {/* Left side */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                cursor: "pointer",
                color: "white",
              }}
              onClick={() => navigate("/home")}
            >
              <img src={icon} alt="Calculator Icon" width="50px" />
              <div className="link">Finance Calculator</div>
            </div>

            {/* Right side */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              {isAboveMediumScreens ? (
                <div style={{ display: "flex", gap: "3rem" }}>
                  <Link className="link" to="/investment-calculator">
                    Investment
                  </Link>
                  <Link className="link" to="/retirement-age-calculator">
                    Retirement Age
                  </Link>
                  <Link className="link" to="/mortgage-calculator">
                    Mortgage
                  </Link>
                  <Link className="link" to="/car-payment-calculator">
                    Car Payment
                  </Link>
                </div>
              ) : (
                // Mobile screen
                <button
                  style={{
                    borderRadius: "9999px",
                    backgroundColor: "#336699",
                    padding: "0.5rem",
                    border: "none",
                  }}
                  onClick={() => setIsMenuToggled(!isMenuToggled)}
                >
                  <Bars3Icon
                    style={{
                      height: "1.5rem",
                      width: "1.5rem",
                      color: "white",
                    }}
                  />
                </button>
              )}
            </div>
          </div>
          {/*  Mobile Menu modal */}
          {!isAboveMediumScreens && (
            <div className={`menu ${isMenuToggled ? "show" : ""}`}>
              {/* Close Icon */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "3rem",
                }}
              >
                <button
                  className="close-button"
                  onClick={() => setIsMenuToggled(!isMenuToggled)}
                >
                  <XMarkIcon
                    style={{
                      height: "1.5rem",
                      width: "1.5rem",
                      color: "#9CA3AF",
                    }}
                  />
                </button>
              </div>
              {/* Menu items */}
              <div
                style={{
                  marginLeft: "20%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2.5rem",
                  fontSize: "1.5rem",
                }}
              >
                <Link className="mobile-link" to="/investment-calculator">
                  Investment
                </Link>
                <Link className="mobile-link" to="/retirement-age-calculator">
                  Retirement Age
                </Link>
                <Link className="mobile-link" to="/mortgage-calculator">
                  Mortgage
                </Link>
                <Link className="mobile-link" to="/car-payment-calculator">
                  Car Payment
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
