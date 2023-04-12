const puppeteer = require("puppeteer");

async function handleTwitter(url) {
  // Launch a new Puppeteer instance
  const browser = await puppeteer.launch({
    args: ['--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36']
  });
  // Create a new page
  const page = await browser.newPage();

  try {
    // Navigate to the Twitter user page
    await page.goto(url);

    // Wait for the page to load
    await page.waitForSelector("[data-testid=UserName]", { timeout: 5000 });

    // Extract user details using page.evaluate()
    const userDetails = await page.evaluate(() => {
      const name = document.querySelector("[data-testid=UserName]").innerText;
      const profileImgSrc =
        document.querySelector('img[alt="Opens profile photo"]').src || "";

      // other social media links
      const externalLink =
        document.querySelector("[data-testid=UserProfileHeader_Items] > a")
          .innerText || "";

      // user description
      const description =
        document.querySelector("[data-testid=UserDescription]").innerText || "";

      // following count
      const followingCountIndex =
        Array.from(document.querySelectorAll("a span")).findIndex((_) =>
          _.innerText.includes("Following")
        ) || "";

      let followingCount;
      if (followingCountIndex >= 0) {
        followingCount =
          Array.from(document.querySelectorAll("a span"))[
            followingCountIndex
          ].closest("a").innerText || "";
      }

      // follower count
      const followerCountIndex =
        Array.from(document.querySelectorAll("a span")).findIndex((_) =>
          _.innerText.includes("Followers")
        ) || "";

      let followerCount;
      if (followerCountIndex >= 0) {
        followerCount =
          Array.from(document.querySelectorAll("a span"))[
            followerCountIndex
          ].closest("a").innerText || "";
      }

      const joiningDate =
        document.querySelector("[data-testid=UserJoinDate]").innerText || "";

      const location =
        document.querySelector('[data-testid="UserLocation"]').innerText || "";
      return {
        name,
        description,
        followingCount,
        followerCount,
        profileImgSrc,
        externalLink,
        joiningDate,
        location,
      };
    });

    // console.log(userDetails);

    // Close the Puppeteer instance
    await browser.close();

    return userDetails;
  } catch (error) {
    console.log("Error: ", error?.message);
    // Close the Puppeteer instance
    await browser.close();
  }
}

module.exports = handleTwitter;
