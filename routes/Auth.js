const express = require("express");
const authRouter = express.Router();
require("dotenv").config();
const querystring = require("querystring");

const CLIENT_ID = process.env.clientID;
const CLIENT_SECRET = process.env.clientSecret;
const isProd = process.env.NODE_ENV === "production";

const redirectURI = isProd
  ? "https://elijahswilliams.github.io/SongQUIZ/"
  : "http://localhost:2001/SongQUIZ/";

console.log("URI:", redirectURI, "ISPROD", isProd);

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

  console.log(`Redirect URI in login: ${redirectURI}`);

  const queryParams = querystring.stringify({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: redirectURI,
  });

  const authURL = `https://accounts.spotify.com/authorize?${queryParams}`;

  console.log("Redirecting to Spotify with URL:", authURL);

  res.redirect(authURL); //send user to Spotify auth page
});
//end GET

/* Spotify sends the user back to /callback endpoint with a code, 
and then this function sends that code to the frontend
*/
authRouter.get("/callback", (req, res) => {
  const code = req.query.code;

  console.log(redirectURI);
  // Send code to frontend to handle the token exchange
  res.redirect(`${redirectURI}#/callback?code=${code}`);
});
//end GET

/* After the frontend receives the code, it sends it back to the server via this POST /token
it then exchanges the code with SPotify for the accessToken and the refreshToken
*/
authRouter.post("/token", async (req, res) => {
  console.log("Getting Token");
  const code = req.body.code;

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectURI,
      }),
    });

    const data = await response.json();

    if (data.access_token) {
      res.json({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
    } else {
      res.status(400).json({ error: "Failed to get tokens", details: data });
    }
  } catch (err) {
    console.error("Toke