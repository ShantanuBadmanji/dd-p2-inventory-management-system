import "dotenv/config";
import app from "./app";
import {
  addItemToCart,
  addItemToInventory,
  applyDiscountCoupon,
  removeItemFromInventory,
} from "./services";
import { carts, discountCoupons, inventory } from "./utils/datastructures";
const port = process.env.PORT || 3000;

function demo() {
  console.log("----------------------------------------Demonstration Started--------------------------------------------------\n\n");
  console.log("Initial state:");
  console.log("Inventory:", inventory);
  console.log("Carts:", carts);
  console.log("Discount Coupons:", discountCoupons);
  console.log();

  // Add items to the inventory
  addItemToInventory("product1", 10);
  addItemToInventory("product2", 5);

  console.log("After adding items to the inventory:");
  console.log("Inventory:", inventory);
  console.log();

  // Add items to the cart
  addItemToCart("customer1", "product1", 5);
  addItemToCart("customer1", "product2", 3);

  console.log("After adding items to the cart:");
  console.log("Inventory:", inventory);
  console.log("Carts:", carts);
  console.log();

  // Try adding a non-existent product to the cart
  try {
    addItemToCart("customer1", "product3", 2);
  } catch (error: any) {
    console.log("Error:", error.message);
  }

  // Try adding more quantity than available in the inventory
  try {
    addItemToCart("customer1", "product2", 5);
  } catch (error: any) {
    console.log("Error:", error.message);
  }

  console.log("After failed attempts:");
  console.log("Inventory:", inventory);
  console.log("Carts:", carts);
  console.log();

  // Remove items from the inventory
  removeItemFromInventory("product1", 3);

  console.log("After removing items from the inventory:");
  console.log("Inventory:", inventory);
  console.log();

  // Add a discount coupon
  discountCoupons.set("DISC10", {
    discountPercentage: 10,
    maximumDiscountCap: 100,
  });

  console.log("After adding a discount coupon:");
  console.log("Discount Coupons:", discountCoupons);
  console.log();

  // Apply the discount coupon
  const cartValue = 1000;
  const discountedPrice = applyDiscountCoupon(cartValue, "DISC10");

  console.log("After applying the discount coupon:");
  console.log("Discounted Price:", discountedPrice);
  console.log();

  // Try applying a non-existent discount coupon
  try {
    applyDiscountCoupon(cartValue, "DISC20");
  } catch (error: any) {
    console.log("Error:", error.message);
  }

  console.log("-----------------------------------------Demonstration Ended-----------------------------------------\n\n");
}

demo();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
