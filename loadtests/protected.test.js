import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 1,
  iterations: 1,
};

// Normalize + validate token (Windows-safe)
const ACCESS_TOKEN = (__ENV.ACCESS_TOKEN || "").replace(/\s+/g, "");

if (!ACCESS_TOKEN) {
  throw new Error(
    'ACCESS_TOKEN is missing. Run with: k6 run -e ACCESS_TOKEN="<token>" protected.test.js'
  );
}

export default function () {
  const res = http.get("http://localhost:8080/bench/protected", {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  console.log("STATUS:", res.status);
  console.log("BODY:", res.body);

  check(res, {
    "status is 200": (r) => r.status === 200,
  });
}
