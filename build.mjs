import { mkdirSync, copyFileSync, rmSync, existsSync, readFileSync, writeFileSync } from "node:fs";
// Accept the Data API address too (…supabase.co/rest/v1/) and reduce it to the base Project URL.
const url = (process.env.VITE_SUPABASE_URL || "").trim().replace(/\/(rest|auth|storage|functions)\/v1.*$/, "").replace(/\/+$/, "");
const key = (process.env.VITE_SUPABASE_ANON_KEY || "").trim();

// Safety: refuse to build if a secret key is used in browser code.
function role(k) {
  try { return JSON.parse(Buffer.from(k.split(".")[1], "base64url").toString()).role; } catch { return ""; }
}
if (key.startsWith("sb_secret_") || role(key) === "service_role") {
  throw new Error("VITE_SUPABASE_ANON_KEY is a SECRET/service-role key. Use the public anon or publishable key only.");
}
if (url && !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)) throw new Error("VITE_SUPABASE_URL must look like https://xxxx.supabase.co");

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");
let html = readFileSync("index.html", "utf8");
if (key && !key.startsWith("sb_publishable_") && role(key) !== "anon") console.warn("Key is not a publishable (sb_publishable_...) or legacy anon key. Check it.");
if (url && key) {
  html = html.replace("__SUPABASE_URL__", url).replace("__SUPABASE_ANON_KEY__", key);
  console.log("Supabase config injected.");
} else {
  console.warn("VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set: login will show 'not configured'.");
}
writeFileSync("dist/index.html", html);
for (const f of ["_headers", "robots.txt", "sitemap.xml"]) {
  if (!existsSync(f)) throw new Error("Missing file: " + f);
  copyFileSync(f, "dist/" + f);
}
console.log("Built to dist/");
