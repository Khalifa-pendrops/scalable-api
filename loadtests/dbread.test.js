import http from "k6/http";
import { check } from "k6";

// Normalize + validate token (Windows-safe)
const ACCESS_TOKEN = (__ENV.ACCESS_TOKEN || "").replace(/\s+/g, "");

if (!ACCESS_TOKEN) {
  throw new Error(
    'ACCESS_TOKEN is missing. Run with: k6 run -e ACCESS_TOKEN="<token>" dbread.test.js'
  );
}

export const options = {
  stages: [
    { duration: "10s", target: 50 },
    { duration: "20s", target: 50 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<150"],
  },
};

export default function () {
  const res = http.get("http://localhost:8080/bench/db-read", {
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
  });

  if (__ITER === 0) {
    console.log("SAMPLE BODY:", res.body);
  }


  // Log a few failures only (prevents log spam at 50 VUs)
  if (res.status !== 200 && __ITER < 2) {
    console.log(`FAIL status=${res.status} body=${res.body}`);
  }

  check(res, { "status is 200": (r) => r.status === 200 });
}
