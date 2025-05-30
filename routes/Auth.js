const express = require("express");
const authRouter = express.Router();
require("dotenv").config();
const querystring = require("querystring");

const CLIENT_ID = process.env.clientID;
const CLIENT_SECRET = process.env.clientSecret;
const redirectURI = process.env.redirectURI;

const SCOPES = [
  "user-library-read",
  "user-read-private",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
  "streaming",
].join(" ");

//collect user info and send user to Spotifys login screen
authRouter.get("/login", (req, res) => {
  //http://localhost:2002/auth/login

  const queryParams = querystring.stringify({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: redirectURI,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`