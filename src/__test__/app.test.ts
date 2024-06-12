import supertest from "supertest";
import app from "../app";
import { carts, discountCoupons, inventory } from "../utils/datastructures";

const request = supertest(app);

describe("Routes", () => {
  beforeEach(() => {
    inventory.clear();
    carts.clear();
    discountCoupons.clear();
  });

  test("GET /inventory", async () => {
    const response = await request.get("/inventory");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ inventory: {} });
  });

  test("POST /inventory/add-items", async () => {
    const response = await request
      .post("/inventory/add-items")
      .send({ productId: "product1", quantity: 10 });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Item added to inventory.");
    expect(response.body.data.inventory).toEqual({ product1: 10 });
  });

  test("PATCH /inventory/remove-items", async () => {
    await request
      .post("/inventory/add-items")
      .send({ productId: "product1", quantity: 10 });
    const response = await request
      .patch("/inventory/remove-items")
      .send({ productId: "product1", quantity: 5 });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Item removed from inventory.");
    expect(response.body.data.inventory).toEqual({ product1: 5 });
  });

  test("POST /cart/add-items", async () => {
    await request
      .post("/inventory/add-items")
      .send({ productId: "product1", quantity: 10 });
    const response = await request
      .post("/cart/add-items")
      .send({ customerId: "customer1", productId: "product1", quantity: 5 });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Item added to cart.");
    expect(response.body.data.customerId).toBe("customer1");
    expect(response.body.data.cart).toEqual({ product1: 5 });
  });

  test("GET /cart/:customerId", async () => {
    await request
      .post("/inventory/add-items")
      .send({ productId: "product1", quantity: 10 });
    await request
      .post("/cart/add-items")
      .send({ customerId: "customer1", productId: "product1", quantity: 5 });
    const response = await request.get("/cart/customer1");
    expect(response.status).toBe(200);
    expect(response.body.customerId).toBe("customer1");
    expect(response.body.cart).toEqual({ product1: 5 });
  });

  test("GET /discount-coupons", async () => {
    const response = await request.get("/discount-coupons");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ discountCoupons: {} });
  });

  test("POST /discount-coupons/apply-coupon", async () => {
    discountCoupons.set("DISC10", {
      discountPercentage: 10,
      maximumDiscountCap: 100,
    });
    const response = await request
      .post("/discount-coupons/apply-coupon")
      .send({ cartValue: 1000, discountId: "DISC10" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Discount applied.");
    expect(response.body.data.discountedPrice).toBe(900);
  });

  test("POST /discount-coupons/add-coupon", async () => {
    const response = await request.post("/discount-coupons/add-coupon").send({
      discountId: "DISC10",
      discountPercentage: 10,
      maximumDiscountCap: 100,
    });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Discount coupon added.");
    expect(response.body.data.discountCoupons).toEqual({
      DISC10: { discountPercentage: 10, maximumDiscountCap: 100 },
    });
  });
});
