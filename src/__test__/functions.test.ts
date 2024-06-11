
import {
  addItemToCart,
  addItemToInventory,
  applyDiscountCoupon,
  carts,
  discountCoupons,
  inventory,
  removeItemFromInventory,
} from "../app";

describe("Inventory Management", () => {
  beforeEach(() => {
    // Reset the inventory and carts before each test
    inventory.clear();
    carts.clear();
    discountCoupons.clear();
  });

  test("addItemToInventory", () => {
    addItemToInventory("product1", 10);
    expect(inventory.get("product1")).toBe(10);
  });

  test("addItemToInventory with negative quantity", () => {
    expect(() => addItemToInventory("product1", -5)).toThrow(
      "Quantity should be greater than 0"
    );
  });

  test("removeItemFromInventory", () => {
    addItemToInventory("product1", 20);
    removeItemFromInventory("product1", 5);
    expect(inventory.get("product1")).toBe(15);
  });

  test("removeItemFromInventory with non-existent product", () => {
    expect(() => removeItemFromInventory("product1", 5)).toThrow(
      "Product product1 is not in the inventory."
    );
  });

  test("removeItemFromInventory with negative quantity", () => {
    expect(() => removeItemFromInventory("product1", -5)).toThrow(
      "Quantity should be greater than 0"
    );
  });

  test("addItemToCart", () => {
    addItemToInventory("product1", 10);
    addItemToCart("customer1", "product1", 5);
    expect(carts.get("customer1")).toEqual({ product1: 5 });
    expect(inventory.get("product1")).toBe(5);
  });

  test("addItemToCart with non-existent product", () => {
    expect(() => addItemToCart("customer1", "product1", 5)).toThrow(
      "Product product1 is not in the inventory."
    );
  });

  test("addItemToCart with insufficient inventory", () => {
    addItemToInventory("product1", 5);
    expect(() => addItemToCart("customer1", "product1", 10)).toThrow(
      "Not enough quantity of product product1 in the inventory."
    );
  });
});

describe("Discount Coupons", () => {
  test("applyDiscountCoupon", () => {
    discountCoupons.set("DISC10", {
      discountPercentage: 10,
      maximumDiscountCap: 100,
    });
    const discountedPrice = applyDiscountCoupon(1000, "DISC10");
    expect(discountedPrice).toBe(900);
  });

  test("applyDiscountCoupon with non-existent coupon", () => {
    expect(() => applyDiscountCoupon(1000, "DISC20")).toThrow(
      "Discount coupon DISC20 not found."
    );
  });
});