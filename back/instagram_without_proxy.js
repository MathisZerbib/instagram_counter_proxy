require("dotenv").config(); // Load environment variables from .env file

const puppeteer = require("puppeteer");

(async () => {
  var INSTAGRAM_USERNAME = process.env.INSTAGRAM_USERNAME;
  var INSTAGRAM_PASSWORD = process.env.INSTAGRAM_PASSWORD;

  // Function to get the current hour
  function getCurrentHour() {
    const now = new Date();
    return now.getHours();
  }

  // Function to check if it's within working hours
  function isWithinWorkingHours() {
    const openHour = parseInt(process.env.OPEN_HOUR, 10);
    const closedHour = parseInt(process.env.CLOSED_HOUR, 10);
    const currentHour = getCurrentHour();

    return currentHour >= openHour && currentHour < closedHour;
  }

  async function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  // Make a randown delay between 3000 ms and 11542
  async function randomDelay() {
    return await delay(2000 + Math.random() * 500);
  }

  const browser = await puppeteer.launch({
    headless: false,
    // userDataDir: "./user_data", TO save cookies
  }); // Launch browser in non-headless mode for visibility
  const page = await browser.newPage();

  // Navigate to Instagram login page
  await page.goto("https://www.instagram.com/accounts/login/");

  await page.waitForSelector("button");
  // get all the button in the page
  const buttons = await page.$$("button");
  // click the button that have a text in it :Autoriser tous les cookies
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const buttonText = await page.evaluate(
      (button) => button.textContent,
      button
    );
    if (buttonText === "Autoriser tous les cookies") {
      await button.click();
      break;
    }
  }

  // Wait for the login page to load
  await page.waitForSelector('input[name="username"]');

  // Fill in the login form and submit
  await page.type('input[name="username"]', INSTAGRAM_USERNAME);
  await page.type('input[name="password"]', INSTAGRAM_PASSWORD);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const loginButton = buttons.find(
      (button) => button.textContent === "Se connecter"
    );
    if (loginButton) {
      loginButton.click();
    } else {
      console.log("You been temporarly banned");
    }
  });

  await randomDelay();

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const loginButton = buttons.find(
      (button) => button.textContent === "Enregistrer les identifiants"
    );
    if (loginButton) {
      loginButton.click();
    }
  });

  await randomDelay();

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const loginButton = buttons.find(
      (button) => button.textContent === "Activer"
    );
    if (loginButton) {
      loginButton.click();
    }
  });

  await randomDelay();

  /// go to profile page
  await page.goto("https://www.instagram.com/" + INSTAGRAM_USERNAME);
  // Initial check
  let links = await page.evaluate(() => {
    const anchors = document.querySelectorAll("ul > li > a");
    return Array.from(anchors, (a) => a.innerText);
  });

  // Refresh the page every ~2 seconds and recheck the followers link
  while (true) {
    await page.reload({ waitUntil: "networkidle0" });
    await delay(1000);
    links = await page.evaluate(() => {
      const anchors = document.querySelectorAll("ul > li > a");
      return Array.from(anchors, (a) => a.innerText);
    });
    followers = links[0].split(" ")[0];
    console.log(new Date().toLocaleString() + " : " + followers + " followers");
    // Wait for 1 seconds before the next check
    await delay(1000);
  }
})();
