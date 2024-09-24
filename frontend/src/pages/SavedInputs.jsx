import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchData } from "../fetchFunctions";
import SavedInputsTable from "../components/SavedInputsTable";
import SavedCarsTable from "../components/SavedCarsTable";

const SavedInputs = () => {
  const navigate = useNavigate();

  const [id, setId] = useState(null);
  const [carData, setCarData] = useState(null);
  const [savedInputsData, setSavedInputsData] = useState(null);
  const [childAges, setChildAges] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setSavedInputsData(await fetchData("savedinputs"));
        setChildAges(await fetchData("childages"));
      } catch (error) {
        console.error("Failed to fetch savedinputs:", error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setCarData(await fetchData("cars/" + id));
      } catch (error) {
        console.error("Failed to fetch cars:", error);
      }
    })();
  }, [id]);

  // Redirects to calculator page with preset values
  const redirectURL = (data, childAges) => {
    const mad = {};
    const md = {};
    const med = {};
    const rd = {};

    // Loop through the original object
    for (const key in data) {
      if (key.startsWith("mad_")) {
        mad[key.replace("mad_", "")] = data[key];
      } else if (key.startsWith("md_")) {
        md[key.replace("md_", "")] = data[key];
      } else if (key.startsWith("med_")) {
        med[key.replace("med_", "")] = data[key];
      } else if (key.startsWith("rd_")) {
        rd[key.replace("rd_", "")] = data[key];
      }
    }
    mad["childAges"] = childAges;

    const queryParams = new URLSearchParams({
      rd: encodeURIComponent(JSON.stringify(rd)),
      md: encodeURIComponent(JSON.stringify(md)),
      cds: encodeURIComponent(JSON.stringify(carData)),
      mad: encodeURIComponent(JSON.stringify(mad)),
      med: encodeURIComponent(JSON.stringify(med)),
    });

    navigate(`/home?${queryParams.toString()}`);
  };

  return (
    <div>
      <Navbar />
      <div
        style={{
          paddingTop: "7rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SavedInputsTable
          inputData={savedInputsData}
          childAges={childAges}
          setId={setId}
          redirectURL={redirectURL}
        />
        <SavedCarsTable data={carData} id={id} />
      </div>
    </div>
  );
};

export default SavedInputs;
