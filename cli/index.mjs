import * as fs from "node:fs";
import * as glob from "glob";

async function run() {
  const files = glob.sync("src/**/*.*", {nosort: true, nodir: true});
  console.dir(files);
}

await run();