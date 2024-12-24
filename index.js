import http from "k6/http";
import { check, sleep } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";

// Define custom metrics
const failRate = new Rate("failed_requests");
const successRate = new Rate("successful_requests");
const requestDuration = new Trend("request_duration", true); // Tracks duration of requests
const totalRequests = new Counter("total_requests");

const authTokenHardcoded =
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyOGZyeFVsTGRkdElKLUM5dWRvZzgxUk9VcGFWQlR0SmtUaUtiVlN1R3BrIn0.eyJleHAiOjE3MzQ4MDUxMjEsImlhdCI6MTczNDc5NzkyMSwianRpIjoiNmMzMWQzOTYtODk4YS00MTE4LTlmZDctYTcxY2U1MDM4ZDEwIiwiaXNzIjoiaHR0cHM6Ly9za2FkaS1kZXYucG9ydGFsLmF0YWNhZGFvLmNvbS5ici9yZWFsbXMvUi1PZmVydGFzTW9iaWxlc0Rldi1LQyIsImF1ZCI6IlItT2ZlcnRhc01vYmlsZXNEZXYtS0MiLCJzdWIiOiI2YmM0NTkwOC00ZDM0LTQ1OTYtYTRhMC0yNTE0NjM0Y2NlNDQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJPZmVydGFzTW9iaWxlc0RldiIsInNlc3Npb25fc3RhdGUiOiJhZDI3Njc4OS0wOTM2LTQzYjQtOTVjNi0yYmQ0NzY4NzdjNzUiLCJzY29wZSI6IlItT2ZlcnRhc01vYmlsZXNEZXYtZXh0ZXJubyIsInNpZCI6ImFkMjc2Nzg5LTA5MzYtNDNiNC05NWM2LTJiZDQ3Njg3N2M3NSIsInJvbGUiOlsiZGVmYXVsdC1yb2xlcy1yLW9mZXJ0YXNtb2JpbGVzZGV2LWtjIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImtjci1vZmVydGFzLWV4dGVybm8iXX0.WlXs9lLFToJGGvOpVOD2xSEvKEVUTOLogtxgoBjenFjCmnM1s4-h0rzh15WQPVbltuzcDfWDQ3s5_d-U7dvADtphCfbBGZC-rwyIeC4awcoxB1bXIR1DbXdQWhHq_fOvOk1-US8Y9t_-cgmikCrD2Fy11l9U3YMmlQexnOpIlVGEYlgqCIkCY32jpqC_L08zTgLzo4v76V53RNNGIykMe2LxykOfx5KP_SHrr2uXb7XwM0BbUSQK6Xcp8i-uJ_KRti8TfSviXEhF5Yekqg1ZsdfhSxMNQRYXJ64bz-WVOhHO1f4VY7cleafa2-HL798Bwpsq6pOLApFL6uzcSO4ZHA";

// const backofficeDomain =
// "https://tyr.portal.atacadao.com.br/mobile/ofertas-backoffice/v1";
const transacionalDomain =
  "https://tyr.portal.atacadao.com.br/mobile/ofertas-transacional/v1";

const tests = [
  // {
  //   url: `${backofficeDomain}/offer`,
  //   type: "GET",
  //   requests: 75,
  // },
  // {
  //   url: `${backofficeDomain}/offer/list-active`,
  //   type: "GET",
  //   requests: 75,
  // },
  // {
  //   url: `${backofficeDomain}/offer/list-active`,
  //   type: "GET",
  //   requests: 75,
  // },
  // {
  //   url: `${backofficeDomain}/categoria/descontos?idFilial=66`,
  //   type: "GET",
  //   requests: 75,
  // },
  // {
  //   url: `${backofficeDomain}/produto/leitor?idFilial=66&ean=7896002100014`,
  //   type: "GET",
  //   requests: 75,
  // },
  // {
  //   url: `${backofficeDomain}/produto/busca?idUser=6bc45908-4d34-4596-a4a0-2514634cce44&idFilial=66`,
  //   type: "GET",
  //   requests: 75,
  // },
  // {
  //   url: `${backofficeDomain}/produto/status?idUser=6bc45908-4d34-4596-a4a0-2514634cce44&idFilial=66&status=${encodeURIComponent(
  //     "EM ATIVAÇÃO"
  //   )}`,
  //   type: "GET",
  //   requests: 75,
  // },
  // {
  //   url: `${backofficeDomain}/vitrine/mobile?idFilial=66&idUser=id_usuario_keycloak`,
  //   type: "GET",
  //   requests: 75,
  // },
  // {
  //   url: `${backofficeDomain}/vitrine/mobilev2?idFilial=66&idUser=id_usuario_keycloak`,
  //   type: "GET",
  //   requests: 75,
  // },
  // {
  //   url: `${backofficeDomain}/busca-loja-via-cep?page=1&pageSize=10&cep=20541152`,
  //   type: "GET",
  //   requests: 75,
  // },
  // {
  //   url: `${backofficeDomain}/busca-loja-via-cidade-nome?page=1&pageSize=10`,
  //   type: "GET",
  //   requests: 75,
  // },
  // {
  //   url: `${backofficeDomain}/busca-loja-via-cidade-nome?page=1&pageSize=10`,
  //   type: "GET",
  //   requests: 75,
  // },
  // {
  //   url: `${backofficeDomain}/offer/product?idFilial=66&idOffer=12367&idSku=32275957`,
  //   type: "GET",
  //   requests: 75,
  // },
  // {
  //   url: `${backofficeDomain}/flyer?filialId=916`,
  //   type: "GET",
  //   requests: 75,
  // },

  {
    url: `${transacionalDomain}/ofertas/ativar`,
    type: "POST",
    payload: {
      idFilial: "66",
      idUsuario: "6bc45908-4d34-4596-a4a0-2514634cce44",
    },
  },
  // {
  //   url: `${transacionalDomain}/ofertas/ativar/v2`,
  //   type: "POST",
  //   payload: {
  //     idFilial: "66",
  //     username: "fernando.zanchetta123@kobe.io",
  //   },
  // },
];

// Test configuration
export const options = {
  vus: 75, // 1,000 virtual users
  iterations: 75,
  thresholds: {
    failed_requests: ["rate<0.01"], // Fail rate should be less than 1%
    successful_requests: ["rate>0.99"], // Success rate should be at least 99%
    request_duration: ["p(95)<500"], // 95% of requests should respond within 500ms
  },
};

// User interaction scenario
export default function () {
  tests.forEach((test) => {
    const params = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTokenHardcoded}`,
      },
    };

    let response;
    if (test.type === "GET") {
      response = http.get(test.url, params);
    } else if (test.type === "POST") {
      response = http.post(test.url, JSON.stringify(test.payload), params);
    }

    console.log(`url: ${test.url} | response status: ${response.status}`);

    // Check if the response is successful
    const isSuccessful = response.status === 200 || response.status === 204;
    check(response, {
      "Status is 200 or 204": (res) => res.status === 200 || res.status === 204,
    });

    // Update custom metrics
    totalRequests.add(1); // Each iteration makes one request
    requestDuration.add(response.timings.duration); // Log request duration
    failRate.add(!isSuccessful); // Increment fail rate if the request failed
    successRate.add(isSuccessful); // Increment success rate if the request succeeded
  });

  sleep(0.2);
}

// Log the summary at the end of the test
export function handleSummary(data) {
  const summary = `
====== Test Summary ======
Total requests made: ${data.metrics["total_requests"].values.count}
Failed requests rate: ${(
    data.metrics["failed_requests"].values.rate * 100
  ).toFixed(2)}%
Successful requests rate: ${(
    data.metrics["successful_requests"].values.rate * 100
  ).toFixed(2)}%
95th percentile request duration: ${
    data.metrics["request_duration"].values["p(95)"]
  } ms
==========================
`;

  // Return an object with valid keys and values
  return {
    stdout: summary, // Print the summary to stdout
    "summary.json": JSON.stringify(data, null, 2), // Save the full report as JSON
    "summary-log.txt": summary,
  };
}
