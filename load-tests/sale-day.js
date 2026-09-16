import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },   // ramp-up
    { duration: '5m', target: 200 },  // sustained sale-day load
    { duration: '2m', target: 400 },  // spike
    { duration: '3m', target: 200 },  // recovery
    { duration: '2m', target: 0 },    // ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],   // <1% error rate
  },
};

export default function () {
  const baseUrl = __ENV.BASE_URL || 'http://localhost:3001/api';

  // 1. Browse catalog
  const browseRes = http.get(`${baseUrl}/products?limit=10`);
  check(browseRes, {
    'browse status is 200': (r) => r.status === 200,
  });
  sleep(1);

  // 2. Search products
  const searchRes = http.get(`${baseUrl}/search?q=oud&minPrice=10&maxPrice=500`);
  check(searchRes, {
    'search status is 200': (r) => r.status === 200,
  });
  sleep(1);

  // 3. 10% conversion funnel proceeds to checkout simulation
  if (Math.random() < 0.1) {
    const checkoutRes = http.get(`${baseUrl}/health`);
    check(checkoutRes, {
      'checkout status is 200': (r) => r.status === 200,
    });
  }
  sleep(2);
}
