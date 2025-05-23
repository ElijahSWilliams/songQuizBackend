const express = require("express"); //import express framework
const cors = require("cors"); //import cors module
require("dotenv").config(); // import dotenv module and call config method
const app = express();
const { PORT = 2002 } = process.env;

const authRoute = require("./routes/Auth.js");

console.log("Server setup started...");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

app.get("/login", (req, res) => {});

app.use("/auth", authRoute);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
