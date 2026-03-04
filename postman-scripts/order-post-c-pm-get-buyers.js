// @ts-check
// Types from @postman/test-script-types-plugin are available

// Parse the response body as JSON
const responseBodyJson = pm.response.json();

// Check that the status code is 200
pm.test('Status code is 200', function () {
  pm.response.to.have.status(200);
});

// Check that the response is an array
pm.test('Response is an array', function () {
  pm.expect(responseBodyJson).to.be.an('array');
});

// If array is not empty, check the first item structure
if (responseBodyJson.length > 0) {
  pm.test('First buyer has required properties', function () {
    const buyer = responseBodyJson[0];
    pm.expect(buyer).to.have.property('id');
    pm.expect(buyer).to.have.property('name');
    pm.expect(buyer).to.have.property('createdAt');
    pm.expect(buyer).to.have.property('updatedAt');
  });
}