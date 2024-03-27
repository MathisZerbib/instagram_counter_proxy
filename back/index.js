// Copyright (c) 2024 Mathis Zerbib
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


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
    await page.goto(`https://livecounts.nl/instagram-realtime/?u=${username}`, {
      waitUntil: "networkidle0",
      timeout: 10000,
    });
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
