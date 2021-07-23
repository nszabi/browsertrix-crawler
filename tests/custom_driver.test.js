const yaml = require("js-yaml");
const child_process = require("child_process");
const fs = require("fs");

test("ensure custom driver with custom selector crawls JS files as pages", async () => {
  jest.setTimeout(30000);

  try {
    const proc = child_process.execSync("docker run -v $PWD/tests/fixtures:/tests/fixtures -v $PWD/test-crawls:/crawls webrecorder/browsertrix-crawler crawl --url https://www.iana.org/ --collection custom-driver-1 --driver /tests/fixtures/driver-1.js");
  }
  catch (error) {
    console.log(error);
  }

  const crawledPages = fs.readFileSync("test-crawls/collections/custom-driver-1/pages/pages.jsonl", "utf8");
  const pages = new Set();

  for (const line of crawledPages.trim().split("\n")) {
    const url = JSON.parse(line).url;
    if (!url) {
      continue;
    }
    pages.add(url);
  }

  const expectedPages = new Set([
    "https://www.iana.org/",
    "https://www.iana.org/_js/2013.1/jquery.js",
    "https://www.iana.org/_js/2013.1/iana.js"
  ]);

  expect(pages).toEqual(expectedPages);

});
 
