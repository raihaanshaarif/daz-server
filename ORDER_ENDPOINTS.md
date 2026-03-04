# Order Tracking API Endpoints

This document lists all endpoints for the Order Tracking system, including sample requests and responses.

## Base URL

`http://localhost:5001/api/v1/order` (assuming default port)

## Authentication

None required (as per existing modules)

---

## 1. Buyers

### Create Buyer

**Endpoint:** `POST /buyers`  
**Description:** Create a new buyer

**Sample Request:**

```json
{
  "name": "Nike",
  "brand": "Nike"
}
```

**Sample Response:**

```json
{
  "id": 1,
  "name": "Nike",
  "brand": "Nike",
  "createdAt": "2026-03-02T12:00:00.000Z",
  "updatedAt": "2026-03-02T12:00:00.000Z"
}
```

### Get All Buyers

**Endpoint:** `GET /buyers`  
**Description:** Retrieve all buyers

**Sample Response:**

```json
[
  {
    "id": 1,
    "name": "Nike",
    "brand": "Nike",
    "createdAt": "2026-03-02T12:00:00.000Z",
    "updatedAt": "2026-03-02T12:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Adidas",
    "brand": "Adidas",
    "createdAt": "2026-03-02T12:00:00.000Z",
    "updatedAt": "2026-03-02T12:00:00.000Z"
  }
]
```

---

## 2. Factories

### Create Factory

**Endpoint:** `POST /factories`  
**Description:** Create a new factory

**Sample Request:**

```json
{
  "name": "Bangladesh Textiles"
}
```

**Sample Response:**

```json
{
  "id": 1,
  "name": "Bangladesh Textiles",
  "createdAt": "2026-03-02T12:00:00.000Z",
  "updatedAt": "2026-03-02T12:00:00.000Z"
}
```

### Get All Factories

**Endpoint:** `GET /factories`  
**Description:** Retrieve all factories

**Sample Response:**

```json
[
  {
    "id": 1,
    "name": "Bangladesh Textiles",
    "createdAt": "2026-03-02T12:00:00.000Z",
    "updatedAt": "2026-03-02T12:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Vietnam Garments",
    "createdAt": "2026-03-02T12:00:00.000Z",
    "updatedAt": "2026-03-02T12:00:00.000Z"
  }
]
```

---

## 3. Orders

### Create Order

**Endpoint:** `POST /orders`  
**Description:** Create a new order. Note: `totalPrice`, `totalFactoryPrice`, and `dazCommission` are automatically calculated from `quantity * price`, `quantity * factoryUnitPrice`, and `totalPrice - totalFactoryPrice` respectively. Production stage fields (yarnBooking, etc.) are DateTime? for tracking completion dates.

**Sample Request:**

```json
{
  "orderNumber": "ORD-001",
  "shipDate": "2026-04-01T00:00:00.000Z",
  "dept": "Apparel",
  "style": "T-Shirt",
  "color": "Blue",
  "lot": "LOT-123",
  "quantity": 1000,
  "price": 5.5,
  "factoryUnitPrice": 3.0,
  "finalDazCommission": 450.0,
  "paymentTerm": "30 days",
  "overallRemarks": "Urgent order",
  "buyerId": 1,
  "factoryId": 1,
  "createdById": 1
}
```

**Sample Response:**

```json
{
  "id": 1,
  "orderNumber": "ORD-001",
  "shipDate": "2026-04-01T00:00:00.000Z",
  "dept": "Apparel",
  "style": "T-Shirt",
  "color": "Blue",
  "lot": "LOT-123",
  "quantity": 1000,
  "price": 5.5,
  "totalPrice": 5500.0,
  "factoryUnitPrice": 3.0,
  "totalFactoryPrice": 3000.0,
  "dazCommission": 500.0,
  "finalDazCommission": 450.0,
  "paymentTerm": "30 days",
  "yarnBooking": null,
  "labdipYarndip": null,
  "printStrikeOff": null,
  "ppSample": null,
  "bulkFabric": null,
  "cutting": null,
  "printing": null,
  "swing": null,
  "finishing": null,
  "shipmentSample": null,
  "inspection": null,
  "exFactory": null,
  "overallRemarks": "Urgent order",
  "commissionStatus": "PENDING",
  "commissionAmount": null,
  "buyerId": 1,
  "factoryId": 1,
  "createdById": 1,
  "createdAt": "2026-03-02T12:00:00.000Z",
  "updatedAt": "2026-03-02T12:00:00.000Z",
  "buyer": {
    "id": 1,
    "name": "Nike",
    "brand": "Nike"
  },
  "factory": {
    "id": 1,
    "name": "Bangladesh Textiles"
  },
  "createdBy": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com"
  }
}
```

### Get Orders (with pagination and filters)

**Endpoint:** `GET /orders`  
**Description:** Retrieve orders with optional pagination, search, and filters  
**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `search` (string) - searches in orderNumber, style, color, dept
- `buyerId` (number)
- `factoryId` (number)
- `shipDate` (ISO date string)
- `commissionStatus` (string: PENDING or PAID)

**Sample Request:** `GET /orders?page=1&limit=5&search=T-Shirt&buyerId=1`

**Sample Response:**

```json
{
  "data": [
    {
      "id": 1,
      "orderNumber": "ORD-001",
      "shipDate": "2026-04-01T00:00:00.000Z",
      "dept": "Apparel",
      "style": "T-Shirt",
      "color": "Blue",
      "buyer": { "id": 1, "name": "Nike", "brand": "Nike" },
      "factory": { "id": 1, "name": "Bangladesh Textiles" },
      "createdBy": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "createdAt": "2026-03-02T12:00:00.000Z",
      "updatedAt": "2026-03-02T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 1,
    "totalPages": 1
  }
}
```

### Get Order by ID

**Endpoint:** `GET /orders/:id`  
**Description:** Retrieve a specific order by ID

**Sample Response:**

```json
{
  "id": 1,
  "orderNumber": "ORD-001",
  "shipDate": "2026-04-01T00:00:00.000Z",
  "dept": "Apparel",
  "style": "T-Shirt",
  "color": "Blue",
  "quantity": 1000,
  "price": 5.5,
  "totalPrice": 5500.0,
  "commissionStatus": "PENDING",
  "buyer": {
    "id": 1,
    "name": "Nike",
    "brand": "Nike"
  },
  "factory": {
    "id": 1,
    "name": "Bangladesh Textiles"
  },
  "createdBy": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com"
  },
  "createdAt": "2026-03-02T12:00:00.000Z",
  "updatedAt": "2026-03-02T12:00:00.000Z"
}
```

### Update Order

**Endpoint:** `PATCH /orders/:id`  
**Description:** Update an existing order. If `quantity`, `price`, or `factoryUnitPrice` are updated, `totalPrice`, `totalFactoryPrice`, and `dazCommission` are automatically recalculated.

**Sample Request:**

```json
{
  "commissionStatus": "PAID",
  "commissionAmount": 450.0,
  "exFactory": true
}
```

**Sample Response:**

```json
{
  "id": 1,
  "orderNumber": "ORD-001",
  "commissionStatus": "PAID",
  "commissionAmount": 450.0,
  "exFactory": true,
  "updatedAt": "2026-03-02T13:00:00.000Z"
}
```

### Delete Order

**Endpoint:** `DELETE /orders/:id`  
**Description:** Delete an order

**Sample Response:**

```json
{
  "id": 1,
  "orderNumber": "ORD-001",
  "deleted": true
}
```

### Get Order Statistics

**Endpoint:** `GET /orders/stats`  
**Description:** Get order statistics

**Sample Response:**

```json
{
  "stats": {
    "totalOrders": 5
  },
  "commissionStatusBreakdown": [
    {
      "commissionStatus": "PENDING",
      "_count": 3
    },
    {
      "commissionStatus": "PAID",
      "_count": 2
    }
  ],
  "lastWeekOrderCount": 2
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "message": "Error description"
}
```

Status codes:

- 200: Success
- 201: Created
- 404: Not Found
- 500: Internal Server Error

---

## 📋 All API Endpoints Summary

### Buyers

- `POST http://localhost:5001/api/v1/order/buyers` - Create a new buyer
- `GET http://localhost:5001/api/v1/order/buyers` - Get all buyers

### Factories

- `POST http://localhost:5001/api/v1/order/factories` - Create a new factory
- `GET http://localhost:5001/api/v1/order/factories` - Get all factories

### Orders

- `POST http://localhost:5001/api/v1/order/orders` - Create a new order
- `GET http://localhost:5001/api/v1/order/orders` - Get orders (with pagination, search, filters)
- `GET http://localhost:5001/api/v1/order/orders/:id` - Get order by ID
- `PATCH http://localhost:5001/api/v1/order/orders/:id` - Update an order
- `DELETE http://localhost:5001/api/v1/order/orders/:id` - Delete an order
- `GET http://localhost:5001/api/v1/order/orders/stats` - Get order statistics
