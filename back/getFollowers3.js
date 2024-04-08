// getFollowers3.js
const axios = require("axios");

async function getFollowers3(username) {
  try {
    const response = await axios.get(
      `https://tools.revesery.com/stalkig/revesery.php?username=${username}`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "fr",
          "sec-ch-ua": '"Chromium";v="123", "Not:A-Brand";v="8"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
          "x-requested-with": "XMLHttpRequest",
          Referer: "https://tools.revesery.com/stalkig/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      }
    );
    const followersMatch = response.data.match(
      /<strong>👥 Followers:<\/strong> (\d+)/
    );
    if (followersMatch && followersMatch[1]) {
      return parseInt(followersMatch[1], 10);
    } else {
      console.error("Follower count not found in the response.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching followers:", error);
    return null;
  }
}

module.exports = getFollowers3;
