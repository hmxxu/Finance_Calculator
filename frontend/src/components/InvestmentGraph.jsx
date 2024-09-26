import React from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import "../styles/investmentGraph.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

const InvestmentGraph = ({ data, dataType }) => {
  const yFormatted = data[0][dataType];
  data = data.slice(1);
  const years = data.map((item) => item[0]);
  const mappedData = data.map((item) => item[dataType]);
  ChartJS.register(Filler);

  const chartData = {
    labels: years,
    datasets: [
      {
        label: yFormatted,
        data: mappedData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Years",
          font: {
            weight: "bold",
          },
        },
      },
      y: {
        title: {
          display: true,
          text: yFormatted,
          font: {
            weight: "bold",
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div id="investment-graph-wrapper">
      <div id="investment-graph">
        <div style={{ textAlign: "center" }}>{yFormatted} By Year</div>
        {data && <Line data={chartData} options={options} />}
      </div>
    </div>
  );
};

InvestmentGraph.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
      .isRequired
  ),
  dataType: PropTypes.number.isRequired,
};

export default InvestmentGraph;
