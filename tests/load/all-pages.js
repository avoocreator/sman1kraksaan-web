import http from "k6/http";
import exec from "k6/execution";
import { check, fail, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";
import { pages } from "./pages.js";

const baseUrl = (__ENV.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const maxP95Ms = Number(__ENV.MAX_P95_MS || 2000);
const maxP99Ms = Number(__ENV.MAX_P99_MS || 2000);
const maxErrorRate = Number(__ENV.MAX_ERROR_RATE || 0.01);
const thinkTimeSeconds = Number(__ENV.THINK_TIME || 1);
const requestTimeout = __ENV.REQUEST_TIMEOUT || "30s";

const parseStages = () => {
  const value = __ENV.STAGES || "20s:5,40s:20,40s:50,40s:100,1m:100,20s:0";

  return value.split(",").map((stage) => {
    const [duration, target] = stage.trim().split(":");
    if (!duration || target === undefined || Number.isNaN(Number(target))) {
      throw new Error(`Format STAGES tidak valid: ${stage}`);
    }
    return { duration, target: Number(target) };
  });
};

const pageMetrics = Object.fromEntries(
  pages.map((page) => [
    page.name,
    {
      duration: new Trend(`page_${page.name}_duration`, true),
      errors: new Rate(`page_${page.name}_errors`),
    },
  ]),
);

const thresholds = {
  checks: ["rate>0.99"],
  http_req_failed: [`rate<${maxErrorRate}`],
  http_req_duration: [`p(95)<${maxP95Ms}`, `p(99)<${maxP99Ms}`],
};

for (const page of pages) {
  thresholds[`page_${page.name}_duration`] = [
    `p(95)<${maxP95Ms}`,
    `p(99)<${maxP99Ms}`,
  ];
  thresholds[`page_${page.name}_errors`] = [`rate<${maxErrorRate}`];
}

export const options = {
  discardResponseBodies: true,
  scenarios: {
    all_pages_stress: {
      executor: "ramping-vus",
      stages: parseStages(),
      gracefulRampDown: "10s",
    },
  },
  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
  thresholds,
};

const logFailure = (phase, page, response) => {
  console.error(
    `Request gagal: ${JSON.stringify({
      phase,
      page: page.name,
      url: `${baseUrl}${page.path}`,
      status: response.status,
      statusText: response.status_text || null,
      error: response.error || null,
      errorCode: response.error_code || null,
      durationMs: response.timings.duration,
    })}`,
  );
};

const requestPage = (page) => {
  const response = http.get(`${baseUrl}${page.path}`, {
    headers: { Accept: "text/html" },
    tags: { page: page.name, route: page.path },
    timeout: requestTimeout,
  });
  const passed = check(response, {
    [`${page.name}: status 200`]: (result) => result.status === 200,
  });

  pageMetrics[page.name].duration.add(response.timings.duration);
  pageMetrics[page.name].errors.add(!passed);

  if (!passed) {
    logFailure("stress", page, response);
  }

  return passed;
};

export function setup() {
  for (const page of pages) {
    const response = http.get(`${baseUrl}${page.path}`, {
      headers: { Accept: "text/html" },
      tags: { phase: "route_validation", page: page.name, route: page.path },
      timeout: requestTimeout,
    });

    if (response.status !== 200) {
      logFailure("route_validation", page, response);
      fail(`Validasi route gagal: ${page.path} mengembalikan HTTP ${response.status}`);
    }
  }

  console.log(`Validasi selesai: ${pages.length} halaman siap diuji di ${baseUrl}`);
}

export default function runPageRequest() {
  const page = pages[exec.scenario.iterationInTest % pages.length];
  requestPage(page);
  sleep(thinkTimeSeconds);
}
