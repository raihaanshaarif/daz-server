// @ts-check
// Types from @postman/test-script-types-plugin are available

// Parse the response body as JSON
const responseBodyJson = pm.response.json();

// Check that the status code is 200
pm.test('Status code is 200', function () {
  pm.response.to.have.status(200);
});

// Check that the response has data and pagination
pm.test('Response has data and pagination', function () {
  pm.expect(responseBodyJson).to.have.property('data');
  pm.expect(responseBodyJson).to.have.property('pagination');
});

// Check that data is an array
pm.test('Data is an array', function () {
  pm.expect(responseBodyJson.data).to.be.an('array');
});

// Check pagination structure
pm.test('Pagination has required properties', function () {
  const pagination = responseBodyJson.pagination;
  pm.expect(pagination).to.have.property('page');
  pm.expect(pagination).to.have.property('limit');
  pm.expect(pagination).to.have.property('total');
  pm.expect(pagination).to.have.property('totalPages');
});

// If data array is not empty, check first order structure
if (responseBodyJson.data.length > 0) {
  pm.test('First order has required properties', function () {
    const order = responseBodyJson.data[0];
    pm.expect(order).to.have.property('id');
    pm.expect(order).to.have.property('orderNumber');
    pm.expect(order).to.have.property('buyer');
    pm.expect(order).to.have.property('factory');
  });
}