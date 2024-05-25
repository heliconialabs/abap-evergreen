import * as fs from "node:fs";
import * as path from "node:path";
import * as glob from "glob";

async function run() {
  const files = glob.sync("src/**/*.*", {nosort: true, nodir: true});

  for (const filename of files) {
    if (filename.endsWith(".xml") === false
        || filename.endsWith("package.devc.xml")) {
      continue;
    }

    console.log(filename);
    const input = fs.readFileSync(filename, "utf8");

    const result = await fetch("http://localhost:8080/evergreen", {
      method: "POST",
      headers: {
        "Content-Type": "text/xml",
        "x-filename": path.basename(filename),
      },
      body: input,
    });

    if (result.ok === false) {
      throw new Error(`Failed to fetch: ${result.statusText}`);
    }

    const output = await result.arrayBuffer();
    if (Buffer.from(output).toString() !== input) {
      fs.writeFileSync(filename, Buffer.from(output));
    }
  }
}

await run();