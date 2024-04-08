async function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
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
    const followersText = Array.from(followersElement, (a) => a.innerText).join(
      ""
    );
    return parseInt(followersText);
  });
  return followersCount;
}

async function extractFollowersCount2(page) {
  await page.waitForSelector("#followers", {
    visible: true,
    delay: 1000,
  });
  const followersCount = await page.evaluate(() => {
    const followersElement = document.querySelectorAll(
      "#followers .odometer-inside .odometer-digit"
    );
    const followersText = Array.from(followersElement, (a) => a.innerText).join(
      ""
    );
    return parseInt(followersText);
  });
  return followersCount;
}

/// export

module.exports = {
  delay,
  waitAndClickButton,
  extractFollowersCount,
  extractFollowersCount2,
};
