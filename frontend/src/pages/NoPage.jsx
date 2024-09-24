import React from "react";
import Navbar from "../components/Navbar";

const NoPage = () => {
  return (
    <div>
      <Navbar />
      <div
        style={{
          fontSize: "50px",
          textAlign: "center",
          fontWeight: "bold",
          paddingTop: "100px",
        }}
      >
        Page Does Not Exist ERROR:404
      </div>
    </div>
  );
};

export default NoPage;
