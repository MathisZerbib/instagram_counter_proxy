// getFollowers2.js
const { delay, extractFollowersCount2 } = require("./utils");

async function getFollowers2(page, username) {
  try {
    await page.goto(
      `https://mixerno.space/embed-count/instagram-user-counter/${username}`,
      {
        waitUntil: "networkidle0",
        timeout: 10000,
      }
    );

    await delay(1000);
    return await extractFollowersCount2(page);
  } catch (error) {
    console.error("Error navigating to profile:", error);
    return null;
  }
}

module.exports = getFollowers2;
