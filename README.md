# Inventory Management System

This is an implementation of an Inventory Management System using Node.js, Express, and TypeScript. The system provides APIs for managing inventory, customer carts, and discount coupons.

## Features

- Add, remove, and retrieve items from the inventory
- Add items to customer carts
- Retrieve customer carts
- Apply discount coupons to cart values
- Add and retrieve discount coupons

## Implementation Details

The system uses the following data structures:

- `inventory` (Map): Stores products as keys and their respective quantities as values.
- `carts` (Map): Stores customer IDs as keys and their respective carts as values. Each cart is an object that maps product IDs to their quantities.
- `discountCoupons` (Map): Stores coupon IDs as keys and their respective discount details as values. Each discount detail is an object with `discountPercentage` and `maximumDiscountCap` properties.

The following functions are implemented:

- `addItemToInventory(productId, quantity)`: Adds a product to the inventory or updates the quantity if the product already exists.
- `removeItemFromInventory(productId, quantity)`: Removes the specified quantity of a product from the inventory.
- `addItemToCart(customerId, productId, quantity)`: Adds a product to the customer's cart if the product is available in the inventory.
- `applyDiscountCoupon(cartValue, discountId)`: Applies a discount coupon to the provided cart value and returns the discounted price.

## API Endpoints

The following API endpoints are available:

- `GET /inventory`: Retrieve the current inventory.
- `POST /inventory/add-items`: Add items to the inventory.
- `PATCH /inventory/remove-items`: Remove items from the inventory.
- `POST /cart/add-items`: Add items to a customer's cart.
- `GET /cart/:customerId`: Retrieve a customer's cart.
- `GET /discount-coupons`: Retrieve the available discount coupons.
- `POST /discount-coupons/apply-coupon`: Apply a discount coupon to a cart value.
- `POST /discount-coupons/add-coupon`: Add a new discount coupon.

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the server with `npm run dev`

The server will be running on `http://localhost:3000`.

## Building

1. Build the project with `npm run build`
2. Run the built server with `npm run start`

## Testing

Unit tests for the functions and API endpoints are included in the project. Run the tests with `npm run test`.
