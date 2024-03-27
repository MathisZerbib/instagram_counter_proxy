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
