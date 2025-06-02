const express = require("express");
const profileRouter = express.Router();

profileRouter.get("/profile", async (req, res) => {
  console.log("getProfile");
  const accessToken = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

  if (!accessToken) {
    return res.status(401).json({ error: "No access token provided" });
  }

  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    const profile = await response.json();
    res.json(profile);
  } catch (err) { 
    console.error("err:", err)
    res.status(500).json({ error: err.message });
  }
});

profileRouter.get("/tracks", async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ error: "No access token provided" });
  }

  try {
    const response = await fetch("https://api.spotify.com/v1/me/tracks", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch saved tracks");
    }

    const tracks = await response.json();
    res.json(tracks);
  } catch (err) { 
    console.error("err:", err)
    res.status(500).json({ error: err.message });
  }
});

module.exports = profileRouter;
