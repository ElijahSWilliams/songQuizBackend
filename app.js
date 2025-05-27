const express = require("express"); //import express framework
const cors = require("cors"); //import cors module
require("dotenv").config(); // import dotenv module and call config method
const app = express();
const { PORT = 2002 } = process.env;
const authRoute = require("./routes/Auth.js");
const profileRoute = require("./routes/Profile.js");

console.log("Server setup started...");

app.use(cors());

app.use(express.json()); //Add this to parse JSON bodies

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

app.use("/auth", authRoute); // route is accessible at http://localhost:2002/auth/

app.use("/api", profileRoute); // route is accessible at http://localhost:2002/api/profile

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
