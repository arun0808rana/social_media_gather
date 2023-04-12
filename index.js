const readline = require("readline");
const handleTwitter = require("./engines/twitterEngine");
const handleInstagram = require("./engines/instagramEngine");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  const input = await prompt("Enter media source link \n");
  // console.log("input", input);
  getProvidedMediaSource(input);
  rl.close();
}

main();

async function getProvidedMediaSource(input) {
  const mediaTargets = [
    "instagram",
    "facebook",
    "twitter",
    "fb",
    "pinterest",
    "linktree",
    "reddit",
    "linkedin",
  ];

  const userData = {};
  const collectiveUserData = {
    twitter: null,
    instagram: null,
    facebook: null,
    reddit: null,
    linkedin: null,
    pinterest: null,
    fb: null,
  }
  const domainName = getDomainName(`${input}`).split(".")[0];
  // console.log('domainName: ', domainName);

  if (mediaTargets.includes(domainName)) {
    switch (domainName) {
      case "instagram":
        userData[domainName] = await handleInstagram(input);
        collectiveUserData[domainName] = userData;
        break;

      case "twitter":
        userData[domainName] = await handleTwitter(input);
        collectiveUserData[domainName] = userData;
        break;

      default:
        break;
    }
    console.log('user data: ', userData);
  } else {
    console.log("Source cannot be fetched. Try another source link");
  }
}

function getDomainName(url) {
  return url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im)[1];
}
