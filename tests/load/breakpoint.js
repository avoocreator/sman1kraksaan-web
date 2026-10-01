import http from "k6/http";
import exec from "k6/execution";
import { check, fail } from "k6";
import { pages } from "./pages.js";

const baseUrl = (__ENV.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const requestTimeout = __ENV.REQUEST_TIMEOUT || "10s";
const abortDelay = __ENV.ABORT_DELAY || "20s";
const maxP95Ms = Number(__ENV.MAX_P95_MS || 2000);
const maxErrorRate = Number(__ENV.MAX_ERROR_RATE || 0.05);

const parseRateStages = () => {
  const value =
    __ENV.RATE_STAGES ||
    "30s:100,1m:100,30s:200,1m:200,30s:400,1m:400,30s:800,1m:800,30s:1200,1m:1200";

  return value.split(",").map((stage) => {
    const [duration, target] = stage.trim().split(":");
    if (!duration || target === undefined || Number.isNaN(Number(target))) {
      throw new Error(`Format RATE_STAGES tidak valid: ${stage}`);
    }
    return { duration, target: Number(target) };
  });
};

const abortThreshold = (threshold) => ({
  threshold,
  abortOnFail: true,
  delayAbortEval: abortDelay,
});

export const options = {
  discardResponseBodies: true,
  scenarios: {
    breakpoint: {
      executor: "ramping-arrival-rate",
      startRate: Number(__ENV.START_RATE || 50),
      timeUnit: "1s",
      preAllocatedVUs: Number(__ENV.PREALLOCATED_VUS || 200),
      maxVUs: Number(__ENV.MAX_VUS || 3000),
      stages: parseRateStages(),
      gracefulStop: "10s",
    },
  },
  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
  thresholds: {
    checks: ["rate>0.95"],
    dropped_iterations: ["count==0"],
    http_req_failed: [abortThreshold(`rate<${maxErrorRate}`)],
    http_req_duration: [abortThreshold(`p(95)<${maxP95Ms}`)],
  },
};

const requestPage = (page) => {
  const response = http.get(`${baseUrl}${page.path}`, {
    headers: { Accept: "text/html" },
    tags: { page: page.name, route: page.path },
    timeout: requestTimeout,
  });
  const passed = check(response, {
    "status 200": (result) => result.status === 200,
  });

  if (!passed && exec.scenario.iterationInTest % 100 === 0) {
    console.error(
      `Sampel request gagal: ${JSON.stringify({
        page: page.name,
        url: `${baseUrl}${page.path}`,
        status: response.status,
        statusText: response.status_text || null,
        error: response.error || null,
        errorCode: response.error_code || null,
        durationMs: response.timings.duration,
      })}`,
    );
  }
};

export function setup() {
  for (const page of pages) {
    const response = http.get(`${baseUrl}${page.path}`, {
      headers: { Accept: "text/html" },
      tags: { phase: "route_validation", page: page.name, route: page.path },
      timeout: requestTimeout,
    });

    if (response.status !== 200) {
      fail(`Validasi route gagal: ${page.path} mengembalikan HTTP ${response.status}`);
    }
  }

  console.log(`Validasi selesai: ${pages.length} halaman siap diuji di ${baseUrl}`);
}

export default function runBreakpointRequest() {
  const page = pages[exec.scenario.iterationInTest % pages.length];
  requestPage(page);
}
