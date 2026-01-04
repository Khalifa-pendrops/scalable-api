import http from "k6/http";
import { check } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 50 },
    { duration: "20s", target: 50 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<50"], // stricter target for a ping endpoint
  },
};

export default function () {
  const res = http.get("http://localhost:8080/bench/ping");
  check(res, { "status is 200": (r) => r.status === 200 });
}
