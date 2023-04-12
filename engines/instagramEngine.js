const puppeteer = require("puppeteer");

async function handleInstagram(url) {
  // Launch a new Puppeteer instance
  const browser = await puppeteer.launch({
    args: ['--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36']
  });

  // Create a new page
  const page = await browser.newPage();

  try {

    // Navigate to the instagram user page
    console.log('waiting for all requests to complete.')
    await page.goto(url, {waitUntil: 'networkidle0'});

    // Wait for the page to load
    console.log('waiting for title selector')
    await page.waitForSelector('[title="Verified"]', { timeout: 5000 });

    console.log('waiting for following count selector parent');
    await page.waitForSelector('main section ul li', { timeout: 5000 });

    // Extract user details using page.evaluate()
    console.log('Evaluating user info')
    const userDetails = await page.evaluate(() => {
      // const getElementByXpath = (xpath) => {
      //   const xpathResult = document.evaluate(
      //     xpath,
      //     document,
      //     null,
      //     XPathResult.FIRST_ORDERED_NODE_TYPE,
      //     null
      //   );
      //   return xpathResult.singleNodeValue;
      // };

      // function findUrl(str) {
      //   if (str === "" || !str) {
      //     return "";
      //   }
      //   const urlRegex = /(https?:\/\/[^\s]+)/gi;
      //   const match = str.match(urlRegex);
      //   return match ? match[0] : "";
      // }

      const name =
        document.querySelector('[title="Verified"]').parentElement
          .previousElementSibling?.innerText || "";

      const profileImgSrc = document.querySelector(
        `[alt="${name}'s profile picture"]`
      ).src || "";

      const description =
         document.querySelector("main section").lastChild?.innerText || "";

      const externalLink = document.querySelector("main section").lastChild.querySelector('a').innerText || "";

      const postsCount =
        Array.from(document.querySelectorAll("section li"))
          .slice(0, 10)
          .find((_) => _?.innerText.includes("posts"))?.innerText || "";

      const followingCount =
        Array.from(document.querySelectorAll("main section ul li"))
          .slice(0, 10)
          .find((_) => _?.innerText.includes("ollowing"))?.innerText || "";

      const followerCount =
        Array.from(document.querySelectorAll("main section ul li"))
          .slice(0, 10)
          .find((_) => _?.innerText.includes("ollowers"))?.innerText || "";

      return {
        name,
        profileImgSrc,
        description,
        externalLink,
        postsCount,
        followingCount,
        followerCount,
      };
    });

    // console.log(userDetails);

    // Close the Puppeteer instance
    await browser.close();
    return userDetails;
  } catch (error) {
    console.log("Error: ", error?.message);
    await browser.close();
  }
}

module.exports = handleInstagram;
