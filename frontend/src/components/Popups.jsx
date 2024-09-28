import React from "react";
import { motion } from "framer-motion";

const Popups = ({ popupsTexts }) => {
  return (
    <div id="popup-wrapper">
      {popupsTexts.map((popup, index) => (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          id="popup"
          key={index}
          style={{
            backgroundColor: popup.color === "red" ? "#FF617D" : "#4bb543",
          }}
        >
          {popup.text}
        </motion.div>
      ))}
    </div>
  );
};

export default Popups;
