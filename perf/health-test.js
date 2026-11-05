import http from 'k6/http';
import { check, sleep } from 'k6';

// Ejecutar SOLO contra un sistema propio o con permiso por escrito:
//   BASE_URL=http://localhost:3000 k6 run perf/health-test.js
export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const response = http.get(`${__ENV.BASE_URL}/health`);

  check(response, {
    'health returns 200': (r) => r.status === 200,
  });

  sleep(1);
}
