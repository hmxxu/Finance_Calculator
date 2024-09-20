const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const {
  createUsersTable,
  insertUsersQuery,
  createSavedInputsTable,
  insertSavedInputsQuery,
  createUserCalculationsTable,
  insertUserCalculationsQuery,
  createCarsTable,
  insertCarsQuery,
  createChildAgesTable,
  insertChildAgesQuery,
} = require("./dbQueries");

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();
app.use(cors());

app.get("/savedInputs", (req, res) => {
  const sql = "SELECT * FROM savedInputs";
  pool.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.listen(8081, () => {
  console.log("listening");
});

function createTables() {
  createUsersTable();
  createSavedInputsTable();
  createUserCalculationsTable();
  createCarsTable();
  createChildAgesTable();
}

// Function that takes in a query and values runs it on the sql
function runQuery(query, values) {
  pool.execute(query, values, (err, results) => {
    if (err) {
      console.error("Error inserting data:", err);
      return;
    }
    console.log("Data inserted:", results);
  });
}

app.use(express.json());
app.post("/submit", (req, res) => {
  const { rd, md, cds, mad, med } = req.body;

  const { childAges, ...madWithoutChildAges } = mad;
  const madValuesArray = Object.values(madWithoutChildAges);

  const rdValuesArray = Object.values(rd);
  const mdValuesArray = Object.values(md);
  const medValuesArray = Object.values(med);
  const combinedValuesArray = rdValuesArray
    .concat(madValuesArray)
    .concat(mdValuesArray)
    .concat(medValuesArray);
  runQuery(insertSavedInputsQuery, combinedValuesArray);
});

// insertIntoTestTable("Leo", 20, 50000);
