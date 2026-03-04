// @ts-check
// Types from @postman/test-script-types-plugin are available

// Parse the response body as JSON
const responseBodyJson = pm.response.json();

// Check that the status code is 200
pm.test('Status code is 200', function () {
  pm.response.to.have.status(200);
});

// Check that the response has stats
pm.test('Response has stats', function () {
  pm.expect(responseBodyJson).to.have.property('stats');
  pm.expect(responseBodyJson.stats).to.have.property('totalOrders');
});

// Check commission status breakdown
pm.test('Response has commission status breakdown', function () {
  pm.expect(responseBodyJson).to.have.property('commissionStatusBreakdown');
  pm.expect(responseBodyJson.commissionStatusBreakdown).to.be.an('array');
});

// Check last week order count
pm.test('Response has last week order count', function () {
  pm.expect(responseBodyJson).to.have.property('lastWeekOrderCount');
  pm.expect(responseBodyJson.lastWeekOrderCount).to.be.a('number');
});