// getFollowers1.js
const { delay, waitAndClickButton, extractFollowersCount } = require("./utils");

async function getFollowers1(page, username) {
  try {
    await page.goto(`https://livecounts.nl/instagram-realtime/?u=${username}`, {
      waitUntil: "networkidle0",
      timeout: 10000,
    });

    await delay(1000);
    await waitAndClickButton(page);
    return await extractFollowersCount(page);
  } catch (error) {
    console.error("Error navigating to profile:", error);
    return null;
  }
}

module.exports = getFollowers1;
