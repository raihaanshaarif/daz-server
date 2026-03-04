// @ts-check
// Types from @postman/test-script-types-plugin are available

// Parse the response body as JSON
const responseBodyJson = pm.response.json();

// Check that the status code is 201
pm.test('Status code is 201', function () {
  pm.response.to.have.status(201);
});

// Check that the response has the required properties
pm.test('Response has required order properties', function () {
  pm.expect(responseBodyJson).to.have.property('id');
  pm.expect(responseBodyJson).to.have.property('orderNumber');
  pm.expect(responseBodyJson).to.have.property('quantity');
  pm.expect(responseBodyJson).to.have.property('price');
  pm.expect(responseBodyJson).to.have.property('totalPrice');
  pm.expect(responseBodyJson).to.have.property('buyerId');
  pm.expect(responseBodyJson).to.have.property('factoryId');
  pm.expect(responseBodyJson).to.have.property('createdById');
  pm.expect(responseBodyJson).to.have.property('commissionStatus');
  pm.expect(responseBodyJson).to.have.property('buyer');
  pm.expect(responseBodyJson).to.have.property('factory');
  pm.expect(responseBodyJson).to.have.property('createdBy');
});

// Check auto-calculated totalPrice
pm.test('Total price is correctly calculated', function () {
  const expectedTotal = responseBodyJson.quantity * responseBodyJson.price;
  pm.expect(responseBodyJson.totalPrice).to.equal(expectedTotal);
});

// Check commission status is PENDING by default
pm.test('Commission status is PENDING', function () {
  pm.expect(responseBodyJson.commissionStatus).to.equal('PENDING');
});

// Check buyer and factory relations
pm.test('Buyer relation is included', function () {
  pm.expect(responseBodyJson.buyer).to.have.property('id');
  pm.expect(responseBodyJson.buyer).to.have.property('name');
});

pm.test('Factory relation is included', function () {
  pm.expect(responseBodyJson.factory).to.have.property('id');
  pm.expect(responseBodyJson.factory).to.have.property('name');
});