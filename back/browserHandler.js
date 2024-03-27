// browserHandler.js
const puppeteer = require("puppeteer-extra");
puppeteer.use(require("puppeteer-extra-plugin-stealth")());
const PuppeteerExtraPluginProxy = require("puppeteer-extra-plugin-proxy2");

class BrowserHandler {
  constructor(proxies) {
    this.proxies = proxies;
    this.currentProxyIndex = 0;
    this.browserInitialized = this.launchBrowser();
  }

  async launchBrowser() {
    const proxy = this.proxies[this.currentProxyIndex];
    console.log(`Using proxy: ${proxy.ipAddress}:${proxy.port}`);
    puppeteer.use(
      PuppeteerExtraPluginProxy({
        address: proxy.ipAddress,
        port: proxy.port,
      })
    );

    try {
      this.browser = await puppeteer.launch({
        headless: true,
        executablePath: executablePath(),
        args: ["--ignore-certificate-errors"],
      });
      this.browser.on("disconnected", () => this.launchBrowser());
      console.log("Browser launched successfully");
    } catch (error) {
      console.error("Failed to launch browser with proxy:", proxy, error);
      this.currentProxyIndex =
        (this.currentProxyIndex + 1) % this.proxies.length;
      return this.launchBrowser();
    }
  }

  async getPage() {
    if (!this.browser) {
      throw new Error("Browser not initialized");
    }
    return this.browser.newPage();
  }
}

function executablePath() {
  switch (process.platform) {
    case "darwin":
      return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    default:
      return null; // Return null for other platforms or specify the path
  }
}

module.exports = BrowserHandler;
