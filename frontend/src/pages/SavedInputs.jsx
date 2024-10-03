import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import SavedInputsTable from "../components/SavedInputsTable";
import SavedCarsTable from "../components/SavedCarsTable";
import Popups from "../components/Popups";

// Function to fetch car data
const fetchCarData = async (id) => {
  const response = await fetch(`http://localhost:8081/cars/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch cars");
  }
  return response.json();
};

const SavedInputs = () => {
  const navigate = useNavigate();

  const [id, setId] = useState(null);
  const [carData, setCarData] = useState(null);
  const [popupTexts, setPopupsTexts] = useState([]);

  const { data: savedInputsData } = useQuery({
    queryKey: ["savedInputsData"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8081/savedinputs");
      return await response.json();
    },
  });

  const { data: childAges } = useQuery({
    queryKey: ["childAges"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8081/childages");
      return await response.json();
    },
  });

  useEffect(() => {
    (async () => {
      try {
        setCarData(await fetchCarData(id));
      } catch (error) {
        console.error("Failed to fetch cars:", error);
      }
    })();
  }, [id]);

  const deleteSavedInputById = (id) => {
    fetch(`http://localhost:8081/deleteSavedInput/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          addPopup("Failed to delete row", "red");
          throw new Error("Failed to delete row");
        }
        addPopup("Delete Calculation#" + id, "red");
      })
      .catch((err) => console.error("Error:", err));
  };

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

  // Add a popup that only last for 2 seconds
  const addPopup = (text, color) => {
    setPopupsTexts((prevTexts) => [{ text: text, color: color }, ...prevTexts]);
    setTimeout(() => {
      setPopupsTexts((prevTexts) => prevTexts.slice(0, -1));
    }, 6000); // 2 seconds
  };
  return (
    <div>
      <Navbar />
      <Popups popupsTexts={popupTexts} />
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
          deleteId={deleteSavedInputById}
          redirectURL={redirectURL}
        />
        <SavedCarsTable data={carData} id={id} />
      </div>
    </div>
  );
};

export default SavedInputs;
