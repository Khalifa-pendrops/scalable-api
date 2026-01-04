import http from "k6/http";
import { check } from "k6";

const ACCESS_TOKEN = __ENV.ACCESS_TOKEN;

export const options = {
  stages: [
    { duration: "10s", target: 50 },
    { duration: "20s", target: 50 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<80"],
  },
};

export default function () {
  const res = http.get("http://localhost:8080/bench/protected", {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  check(res, { "status is 200": (r) => r.status === 200 });
}
