## API Documentation

```markdown
# Inventory Management System API Documentation

## Authentication

All API endpoints are protected and require authentication. Include the AuthenticationToken cookie with all requests.

### Login
- **URL**: `/api/auth/login`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user": {
      "Username": "username",
      "email": "user@example.com",
      "isVerified": true
    }
  }
  ```

## Dashboard

### Get Dashboard Statistics
- **URL**: `/api/dashboard-stats`
- **Method**: GET
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "counts": {
        "customers": 10,
        "items": 25,
        "orders": 15,
        "pendingOrders": 5,
        "completedOrders": 8,
        "cancelledOrders": 2
      },
      "totalSales": 5000,
      "inventoryValue": 12500,
      "lowStockItems": [
        {
          "itemID": "ITM001",
          "name": "Sample Item",
          "code": "ABC123",
          "quantity": 5,
          "price": 100
        }
      ],
      "recentOrders": [
        {
          "orderID": "ORD001",
          "customerID": "CID001",
          "totalAmount": 500,
          "status": "pending",
          "createdAt": "2023-08-22T10:30:00.000Z",
          "customer": {
            "custID": "CID001",
            "name": "John Doe"
          }
        }
      ]
    }
  }
  ```

## Customers

### Get All Customers
- **URL**: `/api/Customers`
- **Method**: GET
- **Response**:
  ```json
  {
    "success": true,
    "customers": [
      {
        "custID": "CID001",
        "name": "John Doe",
        "nic": "123456789V",
        "address": "123 Main St",
        "contactNo": "0771234567"
      }
    ]
  }
  ```

### Get Customer by ID
- **URL**: `/api/Customer/:id`
- **Method**: GET
- **URL Parameters**: `id` - Customer ID (custID)
- **Response**:
  ```json
  {
    "success": true,
    "customer": {
      "custID": "CID001",
      "name": "John Doe",
      "nic": "123456789V",
      "address": "123 Main St",
      "contactNo": "0771234567"
    }
  }
  ```

### Create Customer
- **URL**: `/api/newCustomer`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "name": "Jane Smith",
    "nic": "987654321V",
    "address": "456 Oak Ave",
    "contactNo": "0777654321"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Customer created successfully",
    "customer": {
      "custID": "CID002",
      "name": "Jane Smith",
      "nic": "987654321V",
      "address": "456 Oak Ave",
      "contactNo": "0777654321"
    }
  }
  ```

### Update Customer
- **URL**: `/api/updateCustomer/:id`
- **Method**: PUT
- **URL Parameters**: `id` - Customer ID (custID)
- **Request Body**:
  ```json
  {
    "name": "Jane Smith",
    "nic": "987654321V",
    "address": "789 Pine St",
    "contactNo": "0777654321"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Customer updated successfully",
    "customer": {
      "custID": "CID002",
      "name": "Jane Smith",
      "nic": "987654321V",
      "address": "789 Pine St",
      "contactNo": "0777654321"
    }
  }
  ```

### Delete Customer
- **URL**: `/api/deleteCustomer/:id`
- **Method**: DELETE
- **URL Parameters**: `id` - Customer ID (custID)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Customer deleted successfully and IDs reorganized"
  }
  ```

## Items

### Get All Items
- **URL**: `/api/Items`
- **Method**: GET
- **Response**:
  ```json
  {
    "success": true,
    "items": [
      {
        "itemID": "ITM001",
        "code": "ABC123",
        "name": "Sample Item",
        "price": 100,
        "quantity": 50
      }
    ]
  }
  ```

### Get Item by ID
- **URL**: `/api/Item/:id`
- **Method**: GET
- **URL Parameters**: `id` - Item ID (itemID)
- **Response**:
  ```json
  {
    "success": true,
    "item": {
      "itemID": "ITM001",
      "code": "ABC123",
      "name": "Sample Item",
      "price": 100,
      "quantity": 50
    }
  }
  ```

### Search Items
- **URL**: `/api/searchItems?query=sample`
- **Method**: GET
- **Query Parameters**: `query` - Search term for name or code
- **Response**:
  ```json
  {
    "success": true,
    "count": 2,
    "items": [
      {
        "itemID": "ITM001",
        "code": "ABC123",
        "name": "Sample Item",
        "price": 100,
        "quantity": 50
      },
      {
        "itemID": "ITM002",
        "code": "SAMPLE456",
        "name": "Another Item",
        "price": 150,
        "quantity": 25
      }
    ]
  }
  ```

### Create Item
- **URL**: `/api/newItem`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "code": "DEF456",
    "name": "New Item",
    "price": 150,
    "quantity": 25
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Item created successfully",
    "item": {
      "itemID": "ITM002",
      "code": "DEF456",
      "name": "New Item",
      "price": 150,
      "quantity": 25
    }
  }
  ```

### Update Item
- **URL**: `/api/updateItem/:id`
- **Method**: PUT
- **URL Parameters**: `id` - Item ID (itemID)
- **Request Body**:
  ```json
  {
    "code": "DEF456",
    "name": "Updated Item",
    "price": 175,
    "quantity": 30
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Item updated successfully",
    "item": {
      "itemID": "ITM002",
      "code": "DEF456",
      "name": "Updated Item",
      "price": 175,
      "quantity": 30
    }
  }
  ```

### Delete Item
- **URL**: `/api/deleteItem/:id`
- **Method**: DELETE
- **URL Parameters**: `id` - Item ID (itemID)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Item deleted successfully and IDs reorganized"
  }
  ```

## Orders

### Get All Orders
- **URL**: `/api/Orders`
- **Method**: GET
- **Response**:
  ```json
  {
    "success": true,
    "orders": [
      {
        "orderID": "ORD001",
        "customer": {
          "custID": "CID001",
          "name": "John Doe"
        },
        "items": [
          {
            "item": {
              "itemID": "ITM001",
              "name": "Sample Item"
            },
            "quantity": 2,
            "price": 100
          }
        ],
        "totalAmount": 200,
        "status": "pending",
        "createdAt": "2023-08-22T10:30:00.000Z"
      }
    ]
  }
  ```

### Get Order by ID
- **URL**: `/api/Order/:id`
- **Method**: GET
- **URL Parameters**: `id` - Order ID (orderID)
- **Response**:
  ```json
  {
    "success": true,
    "order": {
      "orderID": "ORD001",
      "customer": {
        "custID": "CID001",
        "name": "John Doe"
      },
      "items": [
        {
          "item": {
            "itemID": "ITM001",
            "name": "Sample Item"
          },
          "quantity": 2,
          "price": 100
        }
      ],
      "totalAmount": 200,
      "status": "pending",
      "createdAt": "2023-08-22T10:30:00.000Z"
    }
  }
  ```

### Create Order
- **URL**: `/api/New-Order`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "customerID": "CID001",
    "items": [
      {
        "itemID": "ITM001",
        "quantity": 2
      },
      {
        "itemID": "ITM002",
        "quantity": 1
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Order created successfully",
    "order": {
      "orderID": "ORD002",
      "customerID": "CID001",
      "items": [
        {
          "item": "60d21b4667d0d8992e610c85",
          "itemID": "ITM001",
          "quantity": 2,
          "price": 100
        },
        {
          "item": "60d21b4667d0d8992e610c86",
          "itemID": "ITM002",
          "quantity": 1,
          "price": 150
        }
      ],
      "totalAmount": 350,
      "status": "pending",
      "createdAt": "2023-08-22T15:45:00.000Z"
    }
  }
  ```

### Update Order Status
- **URL**: `/api/Order-Status/:id`
- **Method**: PUT
- **URL Parameters**: `id` - Order ID (orderID)
- **Request Body**:
  ```json
  {
    "status": "completed"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Order status updated successfully",
    "order": {
      "orderID": "ORD001",
      "status": "completed"
    }
  }
  ```

### Delete Order
- **URL**: `/api/Order/:id`
- **Method**: DELETE
- **URL Parameters**: `id` - Order ID (orderID)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Order deleted successfully and IDs reorganized"
  }
  ```

## Error Responses

All endpoints may return the following error responses:

- **400 Bad Request**:
  ```json
  {
    "success": false,
    "message": "Specific error message explaining the issue"
  }
  ```

- **401 Unauthorized**:
  ```json
  {
    "success": false,
    "message": "Unauthorized"
  }
  ```

- **404 Not Found**:
  ```json
  {
    "success": false,
    "message": "Resource not found"
  }
  ```

- **500 Internal Server Error**:
  ```json
  {
    "success": false,
    "message": "Error message describing the issue"
  }
  ```
```
