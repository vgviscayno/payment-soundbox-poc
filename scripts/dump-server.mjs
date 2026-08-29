// Throwaway request-dump handler for wayfinder ticket #5.
// Superseded by the real receiver in ticket #10, which takes over port 4242.
// Zero deps: proves a request survives the tunnel, and captures raw bodies
// for ticket #8 (settling the undocumented webhook contract).
import { createServer } from "node:http";
import { writeFileSync, mkdirSync } from "node:fs";

const PORT = Number(process.env.PORT ?? 4242);
// tmp/ is gitignored: captures carry the merchant's legal name and a bank
// reference, and this repo is public. Never write them under a tracked path.
const DIR = new URL("../tmp/captures/", import.meta.url);
mkdirSync(DIR, { recursive: true });

createServer((req, res) => {
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    const rawBody = Buffer.concat(chunks).toString("utf8");
    const capture = {
      receivedAt: new Date().toISOString(),
      method: req.method,
      url: req.url,
      headers: req.headers,
      rawBody, // raw, unparsed: signature verification needs the exact bytes
    };
    const file = new URL(`${capture.receivedAt.replace(/[:.]/g, "-")}.json`, DIR);
    writeFileSync(file, JSON.stringify(capture, null, 2));
    console.log(`\n--- ${capture.receivedAt} ${req.method} ${req.url} -> ${file.pathname}`);
    console.log(JSON.stringify(req.headers, null, 2));
    console.log(rawBody || "(empty body)");

    // PayMongo demands 200-209 with a JSON body within 30s, and disables the
    // endpoint after three fully-exhausted events. Answer immediately.
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ received: true }));
  });
}).listen(PORT, () => console.log(`dump server on http://localhost:${PORT}`));
