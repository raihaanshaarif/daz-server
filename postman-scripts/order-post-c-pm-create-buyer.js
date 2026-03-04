// @ts-check
// Types from @postman/test-script-types-plugin are available

// Parse the response body as JSON
const responseBodyJson = pm.response.json();

// Check that the status code is 201
pm.test('Status code is 201', function () {
  pm.response.to.have.status(201);
});

// Check that the response has the required properties
pm.test('Response has required buyer properties', function () {
  pm.expect(responseBodyJson).to.have.property('id');
  pm.expect(responseBodyJson).to.have.property('name');
  pm.expect(responseBodyJson).to.have.property('brand');
  pm.expect(responseBodyJson).to.have.property('createdAt');
  pm.expect(responseBodyJson).to.have.property('updatedAt');
});

// Check that name and brand are strings
pm.test('Name and brand are strings', function () {
  pm.expect(responseBodyJson.name).to.be.a('string');
  if (responseBodyJson.brand) {
    pm.expect(responseBodyJson.brand).to.be.a('string');
  }
});

// Check that createdAt and updatedAt are valid dates
pm.test('Created and updated timestamps are valid', function () {
  pm.expect(new Date(responseBodyJson.createdAt).toISOString()).to.equal(responseBodyJson.createdAt);
  pm.expect(new Date(responseBodyJson.updatedAt).toISOString()).to.equal(responseBodyJson.updatedAt);
});