const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const {
  createUsersTable,
  insertUsersQuery,
  deleteUsersQuery,
  createSavedInputsTable,
  insertSavedInputsQuery,
  deleteSavedInputsQuery,
  createUserCalculationsTable,
  insertUserCalculationsQuery,
  deleteUserCalculationsTable,
  createCarsTable,
  insertCarsQuery,
  getCarsByCalcIdQuery,
  deleteCarsQuery,
  createChildAgesTable,
  insertChildAgesQuery,
  deleteChildAgesTable,
  insertSavedInputsPreset1,
  insertSavedInputsPreset2,
  getSavedInputsLength,
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
app.use(express.json());

app.listen(8081, () => {
  console.log("listening");
});

// Function that takes in a query and values, and runs it on the SQL database, returning a Promise
function runQuery(query, values) {
  return new Promise((resolve, reject) => {
    pool.execute(query, values, (err, results) => {
      if (err) {
        console.error("Error inserting data:", err);
        reject(err); // Reject the Promise with the error
      } else {
        resolve(results); // Resolve the Promise with the results
      }
    });
  });
}

// Create all tables and a preset if they don't exist already
(async function createTables() {
  await runQuery(createSavedInputsTable);
  await runQuery(createUsersTable);
  await runQuery(createUserCalculationsTable);
  await runQuery(createCarsTable);
  await runQuery(createChildAgesTable);

  // Check if savedInputs table is empty before inserting
  if ((await runQuery(getSavedInputsLength))[0].count === 0) {
    const result = await runQuery(insertSavedInputsPreset1);
    const cds = [
      [result.insertId, 30000, 60, 6.89, 20, 8.52, 2300, 25, 3.7],
      [result.insertId, 35000, 60, 6.8, 20, 8.52, 2400, 35, 3.7],
      [result.insertId, 40000, 60, 6.75, 20, 8.52, 2500, 45, 3.7],
      [result.insertId, 45000, 60, 6.7, 20, 8.52, 2600, 55, 3.7],
    ];

    for (const cd of cds) {
      await runQuery(insertCarsQuery, cd);
    }

    await runQuery(insertSavedInputsPreset2, [result.insertId]);
  }
})();

// Get all saved inputs (will do per user later)
app.get("/savedInputs", (req, res) => {
  pool.query("SELECT * FROM savedInputs", (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Get all saved inputs (will do per user later)
app.get("/childAges", (req, res) => {
  pool.query("SELECT * FROM childages", (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Get all cars from a given calculation ID
app.get("/cars/:calcId", (req, res) => {
  const calcId = req.params.calcId;
  pool.query(getCarsByCalcIdQuery, [calcId], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Save inputs to multiple tables
app.post("/submit", async (req, res) => {
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
  try {
    // Wait for the insert query to complete and get the insert ID
    const result = await runQuery(insertSavedInputsQuery, combinedValuesArray);

    // Insert cars data
    cds.forEach(async (cd) => {
      const cdValuesArray = Object.values(cd);
      cdValuesArray.unshift(result.insertId);
      await runQuery(insertCarsQuery, cdValuesArray);
    });

    // Insert child ages
    childAges.forEach(async (age) => {
      await runQuery(insertChildAgesQuery, [result.insertId, age]);
    });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send("Error saving data");
  }
});

app.delete("/deleteSavedInput/:id", (req, res) => {
  const { id } = req.params;
  runQuery(deleteSavedInputsQuery, [id]);
  runQuery(deleteCarsQuery, [id]);
  runQuery(deleteChildAgesTable, [id]);
});
