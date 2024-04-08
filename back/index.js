// main.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ProxyHandler = require("./proxyHandler");
const BrowserHandler = require("./browserHandler");
const prettyjson = require("prettyjson");
const { delay } = require("./utils");
const getFollowers1 = require("./getFollowers1");
const getFollowers2 = require("./getFollowers2");
const getFollowers3 = require("./getFollowers3");

let chalk;

import("chalk").then((module) => {
  chalk = module.default;
});

(async () => {
  const app = express();
  const port = 3001;
  let followersCount = 0;

  app.use(cors());

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  const proxyHandler = new ProxyHandler({
    countries: ["fr", "ch", "be"],
    anonymityLevel: ["elite", "anonymous"],
  });

  const proxies = await proxyHandler.fetchProxies();
  const browserHandler = new BrowserHandler(proxies);

  await browserHandler.browserInitialized;

  const page = await browserHandler.getPage();

  // Main execution loop
  while (true) {
    try {
      followersCount = await getFollowers1(
        page,
        process.env.INSTAGRAM_USERNAME
      );
      if (followersCount) {
        console.log(
          chalk.green(
            prettyjson.render({
              followers: followersCount,
              timestamp: new Date().toLocaleString(),
              source: "getFollowers1",
            })
          )
        );
      }

      if (!followersCount) {
        followersCount = await getFollowers2(
          page,
          process.env.INSTAGRAM_USERNAME
        );
        if (followersCount) {
          console.log(
            chalk.blue(
              prettyjson.render({
                followers: followersCount,
                timestamp: new Date().toLocaleString(),
                source: "getFollowers2",
              })
            )
          );
        }
      }
      if (!followersCount) {
        followersCount = await getFollowers3(process.env.INSTAGRAM_USERNAME);
        if (followersCount) {
          console.log(
            chalk.red(
              prettyjson.render({
                followers: followersCount,
                timestamp: new Date().toLocaleString(),
                source: "getFollowers3",
              })
            )
          );
        }
      }
    } catch (error) {
      console.error("Error fetching followers:", error);
    }

    await page.reload({ waitUntil: "networkidle0", timeout: 10000 });
    console.log("----------------------------------------");

    app.get("/api/followers", async (req, res) => {
      res.json({ followers: followersCount });
    });
  }
})();
