async function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function handleError(error, message) {
  console.error(message, error);
  return null;
}

function logFollowersCount(followersCount, color, source) {
  if (followersCount) {
    console.log(
      chalk[color](
        prettyjson.render({
          followers: followersCount,
          timestamp: new Date().toLocaleString(),
          source: source,
        })
      )
    );
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
  handleError,
  logFollowersCount,
  waitAndClickButton,
  extractFollowersCount,
  extractFollowersCount2,
};
