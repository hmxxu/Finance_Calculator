import React from "react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import icon from "../svgs/calculator.svg";
import "../App.css";
import "../styles/navbar.css";
import useMediaQuery from "../hooks/useMediaQuery";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const navigate = useNavigate();
  const isAboveMediumScreens = useMediaQuery("(min-width: 768px)");
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  const menuRef = useRef(null); // Reference to the menu div

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuToggled(false);
    }
  };

  useEffect(() => {
    if (isAboveMediumScreens) return;
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const Links = ({ id }) => (
    <div id={id}>
      <Link
        className="nav-menu-link"
        to="/investment-calculator"
        onClick={() => setIsMenuToggled(false)}
      >
        Investment
      </Link>
      <Link
        className="nav-menu-link"
        to="/retirement-age-calculator"
        onClick={() => setIsMenuToggled(false)}
      >
        Retirement Age
      </Link>
      <Link
        className="nav-menu-link"
        to="/mortgage-calculator"
        onClick={() => setIsMenuToggled(false)}
      >
        Mortgage
      </Link>
      <Link
        className="nav-menu-link"
        to="/car-payment-calculator"
        onClick={() => setIsMenuToggled(false)}
      >
        Car Payment
      </Link>
    </div>
  );

  return (
    <nav id="nav-1">
      <div id="nav-2">
        <div id="nav-3">
          {/* Left side */}
          <div id="nav-icon-wrapper" onClick={() => navigate("/home")}>
            <img src={icon} alt="Calculator Icon" width="50px" />
            <div className="nav-menu-link">Finance Calculator</div>
          </div>

          {/* Right side */}
          <div id="nav-menu">
            {isAboveMediumScreens ? (
              <Links id="nav-menu-links" />
            ) : (
              // Mobile screen
              <button
                id="nav-menu-dropdown"
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
          <div
            id={isMenuToggled ? "nav-mobile-menu-show" : "nav-mobile-menu"}
            ref={menuRef}
          >
            {/* Close Icon */}
            <div id="nav-menu-dropdown-close">
              <button
                id="nav-menu-dropdown-close-button"
                onClick={() => setIsMenuToggled(false)}
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
            <Links id="nav-mobile-menu-links" />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
