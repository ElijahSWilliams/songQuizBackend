// routes/auth.js
const express = require("express");
const loginRouter = express.Router();
require("dotenv").config();

const querystring = require("querystring"); //Node.js module that helps build or parse URL query parameters

const CLIENT_ID = process.env.CLIENT_ID; //set client id
const REDIRECT_URI = process.env.REDIRECT_URI; //set redirect url=i
const SCOPES = [
  "user-library-read",
  "user-read-private",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
  "streaming",
].join(" "); //set scope and join

router.get("/login", (req, res) => {
  const queryParams = querystring.stringify({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

module.exports = loginRouter;
