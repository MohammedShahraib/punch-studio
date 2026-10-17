import { createServer } from "node:http";
import { readFileSync } from "node:fs";
createServer((req, res) => { res.setHeader("Content-Type", "text/html"); res.end(readFileSync("dist/index.html")); })
  .listen(3000, () => console.log("Open http://localhost:3000"));
