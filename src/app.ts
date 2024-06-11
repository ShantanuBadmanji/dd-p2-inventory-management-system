import express, { Request, Response } from "express";
import { json, urlencoded } from "body-parser";
type DiscountDetail = {
  discountPercentage: number;
  maximumDiscountCap: number;
};

type Cart = Record<string, number>;

const app = express();
const port = 3000;

app.use(express.json());
app.use(json());
app.use(urlencoded({ extended: true }));

const inventory = new Map<string, number>();
const carts = new Map<string, Cart>();
const discountCoupons = new Map<string, DiscountDetail>();

function addItemToInventory(productId: string, quantity: number): void {
  if (quantity <= 0) throw new Error("Quantity should be greater than 0");

  const currentQuantity = inventory.get(productId) || 0;
  inventory.set(productId, currentQuantity + quantity);
}

function removeItemFromInventory(productId: string, quantity: number): void {
  if (quantity <= 0) throw new Error("Quantity should be greater than 0");

  const currentQuantity = inventory.get(productId);
  if (!currentQuantity)
    throw new Error(`Product ${productId} is not in the inventory.`);

  const updatedQuantity = Math.max(currentQuantity - quantity, 0);
  inventory.set(productId, updatedQuantity);
}

function addItemToCart(
  customerId: string,
  productId: string,
  quantity: number
): void {
  const inventoryQuantity = inventory.get(productId);
  if (!inventoryQuantity)
    throw new Error(`Product ${productId} is not in the inventory.`);

  if (inventoryQuantity < quantity)
    throw new Error(
      `Not enough quantity of product ${productId} in the inventory.`
    );

  const customerCart = carts.get(customerId) || {};
  customerCart[productId] = (customerCart[productId] || 0) + quantity;
  carts.set(customerId, customerCart);
  removeItemFromInventory(productId, quantity);
}

function applyDiscountCoupon(cartValue: number, discountId: string): number {
  const discount = discountCoupons.get(discountId);
  if (!discount) throw new Error(`Discount coupon ${discountId} not found.`);

  const { discountPercentage, maximumDiscountCap } = discount;
  const discountAmount = (cartValue * discountPercentage) / 100;
  const discountedPrice =
    cartValue - Math.min(discountAmount, maximumDiscountCap);
  return discountedPrice;
}

// Define the routes here
app.get("/inventory", (req: Request, res: Response) => {
  res.status(200).json({ inventory: Object.fromEntries(inventory) });
});

app.post("/inventory/add-items", (req: Request, res: Response) => {
  console.log(req.body);
  const { productId, quantity }: { productId: string; quantity: number } =
    req.body;
  addItemToInventory(productId, quantity);
  res.status(201).json({
    message: "Item added to inventory.",
    data: { inventory: Object.fromEntries(inventory) },
  });
});

app.patch("/inventory/remove-items", (req: Request, res: Response) => {
  console.log(req.body);
  const { productId, quantity }: { productId: string; quantity: number } =
    req.body;

  removeItemFromInventory(productId, quantity);
  res.status(200).json({
    message: "Item removed from inventory.",
    data: { inventory: Object.fromEntries(inventory) },
  });
});

app.post("/cart/add-items", (req: Request, res: Response) => {
  console.log(req.body);
  const {
    customerId,
    productId,
    quantity,
  }: { customerId: string; productId: string; quantity: number } = req.body;
  addItemToCart(customerId, productId, quantity);
  res.status(201).json({
    message: "Item added to cart.",
    data: { customerId, cart: carts.get(customerId) },
  });
});

app.get("/cart/:customerId", (req: Request, res: Response) => {
  const { customerId } = req.params;
  res.status(200).json({ customerId, cart: carts.get(customerId) || {} });
});

app.get("/discount-coupons", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ discountCoupons: Object.fromEntries(discountCoupons) });
});

app.post("/discount-coupons/apply-coupon", (req: Request, res: Response) => {
  console.log(req.body);
  const { cartValue, discountId }: { cartValue: number; discountId: string } =
    req.body;
  const discountedPrice = applyDiscountCoupon(cartValue, discountId);
  res.status(200).json({
    message: "Discount applied.",
    data: { discountedPrice },
  });
});
app.post("/discount-coupons/add-coupon", (req: Request, res: Response) => {
  console.log(req.body);
  const {
    discountId,
    discountPercentage,
    maximumDiscountCap,
  }: {
    discountId: string;
    discountPercentage: number;
    maximumDiscountCap: number;
  } = req.body;
  discountCoupons.set(discountId, { discountPercentage, maximumDiscountCap });
  res.status(201).json({
    message: "Discount coupon added.",
    data: { discountCoupons: Object.fromEntries(discountCoupons) },
  });
});

app.use((err: Error, req: Request, res: Response, next: Function) => {
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
