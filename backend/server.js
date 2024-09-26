import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";
import {
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
} from "./dbQueries.js";

import { ChatOpenAI } from "@langchain/openai";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";

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

//************************************************** MySQL databases ***************************************************\\

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

// Get all saved inputs
app.get("/savedInputs", (req, res) => {
  pool.query("SELECT * FROM savedInputs", (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Get all child ages
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
app.post("/insertSavedInputs", async (req, res) => {
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

//***************************************************** LangChain ******************************************************\\
const aiInstructions = `
You are a AI chatbot for my finance calculator website.
You will only anwser questions about finance, house prices, car prices, marriage cost.
If the user asks any non-related questions reply with
"I am AI chatbot assistant only meant to anwser finance questions".
At the end of every message cite all information you provide.
Here are some topic they can ask about:
    * Retirement Age
    * Life Expectancy
    * Income
    * Investment
    * Savings Account
    * Checking Account
    * Retirement
    * Marriage
    * Child Cost
    * Paternity Leave
    * Divorce
    * House Prices
    * Mortgage
    * Cost of buying a car
    * Monthly Expenses
    * Grocery and Food Cost
    * Health Insurance Cost
    * Car Insurance Cost
    * CellPhone Plan Cost
    * Utilities Cost
    * Subscriptions Cost
    * Transportation Cost
    * Pet Cost
`;

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o-mini",
  temperature: 0,
  maxTokens: 1000,
});

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
});

const vectorstore = new MemoryVectorStore(embeddings);

const retriever = vectorstore.asRetriever({ k: 2 });

const retrieverPrompt = ChatPromptTemplate.fromMessages([
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
  [
    "user",
    "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
  ],
]);

// This chain will return a list of documents from the vector store
const retrieverChain = await createHistoryAwareRetriever({
  llm: model,
  retriever,
  rephrasePrompt: retrieverPrompt,
});

// Fake chat history
const chatHistory = [new SystemMessage(aiInstructions)];

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Answer the user's questions based on the following context: {context}.",
  ],
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
]);

const chain = await createStuffDocumentsChain({
  llm: model,
  prompt: prompt,
});

const conversationChain = await createRetrievalChain({
  combineDocsChain: chain,
  retriever: retrieverChain,
});

// A basic message from the user
const userMessage = async (question) => {
  try {
    const response = await conversationChain.invoke({
      chat_history: chatHistory,
      input: question,
    });
    chatHistory.push(new HumanMessage(question));
    chatHistory.push(new AIMessage(response.answer));
    return response.answer;
  } catch (error) {
    console.error("Error asking the question:", error);
    return null;
  }
};

app.post("/AiChatbot", async (req, res) => {
  const ret = await userMessage(req.body.message);
  res.send(JSON.stringify({ message: ret }));
});
