const ProxyLists = require("proxy-lists");

class ProxyHandler {
  constructor(options) {
    this.options = options;
    this.proxies = [];
  }

  async fetchProxies() {
    const gettingProxies = ProxyLists.getProxies(this.options);
    const P = [];

    return new Promise((resolve) => {
      gettingProxies.on("data", (proxies) => {
        proxies.forEach((proxy) => {
          P.push(proxy);
          if (P.length > 100) {
            gettingProxies.emit("end");
          }
        });
      });
      gettingProxies.once("end", () => resolve(P));
    });
  }
}

module.exports = ProxyHandler;
