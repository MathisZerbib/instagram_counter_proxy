require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ProxyHandler = require("./proxyHandler");
const BrowserHandler = require("./browserHandler");

const app = express();
const port = 3000;

app.use(cors());
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

let followersCount = 0;

(async () => {
  const proxyHandler = new ProxyHandler({
    countries: ["fr", "ch", "be"],
    anonymityLevel: ["elite", "anonymous"],
  });

  const proxies = await proxyHandler.fetchProxies();
  const browserHandler = new BrowserHandler(proxies);

  await browserHandler.browserInitialized;

  const page = await browserHandler.getPage();

  async function navigateToProfile(page, username) {
    try {
      await page.goto(
        `https://livecounts.nl/instagram-realtime/?u=${username}`,
        {
          waitUntil: "networkidle0",
          timeout: 10000,
        }
      );
    } catch (error) {
      console.error("Error navigating to profile:", error);
      // Handle the error, e.g., retry navigation, exit the function, etc.
      // throw error;
      await navigateToProfile(page, username);
    }
  }

  async function waitAndClickButton(page) {
    try {
      await page.waitForSelector(".fc-button-label", {
        visible: true,
        timeout: 2000,
      });
      await page.click(".fc-button-label");
    } catch (error) {
      // console.log("The .fc-button-label element was not found.");
    }
  }

  async function extractFollowersCount(page) {
    await page.waitForSelector(".main-odometer", {
      visible: true,
      delay: 1000,
    });
    const followersCount = await page.evaluate(() => {
      const followersElement = document.querySelectorAll(
        ".main-odometer .odometer-inside .odometer-digit"
      );
      const followersText = Array.from(
        followersElement,
        (a) => a.innerText
      ).join("");
      return parseInt(followersText);
    });
    return followersCount;
  }

  async function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  await navigateToProfile(page, process.env.INSTAGRAM_USERNAME);

  while (true) {
    let currentUrl = page.url();
    await delay(1000);
    await waitAndClickButton(page);

    followersCount = await extractFollowersCount(page);

    console.log(
      JSON.stringify({
        followers: followersCount,
        timestamp: new Date().toLocaleString(),
      })
    );

    app.get("/api/followers", async (req, res) => {
      res.json({ followers: followersCount });
    });

    await page.reload({ waitUntil: "networkidle0", timeout: 10000 });

    if (currentUrl.includes("google_vignette")) {
      await navigateToProfile(page, process.env.INSTAGRAM_USERNAME);
    }
  }
})();
