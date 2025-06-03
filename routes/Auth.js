const express = require("express");
const authRouter = express.Router();
require("dotenv").config();
const querystring = require("querystring");

const CLIENT_ID = process.env.clientID;
const CLIENT_SECRET = process.env.clientSecret;
const redirectURI =
  process.env.redirectURI || "http://localhost:2002/auth/callback";

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

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`); //send user to Spotify auth page
});
//end GET

/* Spotify sends the user back to /callback endpoint with a code, 
and then this function sends that code to the frontend
*/
authRouter.get("/callback", (req, res) => {
  const code = req.query.code;

  // Send code to frontend to handle the token exchange
  res.redirect(`${redirectURI}?code=${code}`);
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
    console.error("Token exchange error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
}); //end POST

module.exports = authRouter;
