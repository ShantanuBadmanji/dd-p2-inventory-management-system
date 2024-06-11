import express, { Request, Response } from "express";

type DiscountDetail = {
  discountPercentage: number;
  maximumDiscountCap: number;
};

type Cart = Record<string, number>;

const app = express();
const port = 3000;

app.use(express.json());

const inventory = new Map<string, number>();
const carts = new Map<string, Cart>();
const discountCoupons = new Map<string, DiscountDetail>();

function addItemToInventory(productId: string, quantity: number): void {
  const currentQuantity = inventory.get(productId) || 0;
  inventory.set(productId, currentQuantity + quantity);
}

function removeItemFromInventory(productId: string, quantity: number): void {
  const currentQuantity = inventory.get(productId) || 0;
  const updatedQuantity = Math.max(currentQuantity - quantity, 0);
  inventory.set(productId, updatedQuantity);
}

function addItemToCart(
  customerId: string,
  productId: string,
  quantity: number
): void {
  if (!inventory.has(productId)) {
    console.log(`Product ${productId} is not in the inventory.`);
    return;
  }

  const inventoryQuantity = inventory.get(productId)!;
  if (inventoryQuantity < quantity) {
    console.log(
      `Not enough quantity in the inventory for product ${productId}.`
    );
    return;
  }

  const customerCart = carts.get(customerId) || {};
  customerCart[productId] = (customerCart[productId] || 0) + quantity;
  carts.set(customerId, customerCart);
  removeItemFromInventory(productId, quantity);
}

function applyDiscountCoupon(cartValue: number, discountId: string): number {
  const discount = discountCoupons.get(discountId);
  if (!discount) {
    console.log(`Discount coupon ${discountId} does not exist.`);
    return cartValue;
  }

  const { discountPercentage, maximumDiscountCap } = discount;
  const discountAmount = (cartValue * discountPercentage) / 100;
  const discountedPrice =
    cartValue - Math.min(discountAmount, maximumDiscountCap);
  return discountedPrice;
}

// Define the routes here

app.post("/inventory", (req: Request, res: Response) => {
  const { productId, quantity }: { productId: string; quantity: number } =
    req.body;
  addItemToInventory(productId, quantity);
  res.status(200).send("Item added to inventory.");
});

app.delete("/inventory", (req: Request, res: Response) => {
  const { productId, quantity }: { productId: string; quantity: number } =
    req.body;
  removeItemFromInventory(productId, quantity);
  res.status(200).send("Item removed from inventory.");
});

app.post("/cart", (req: Request, res: Response) => {
  const {
    customerId,
    productId,
    quantity,
  }: { customerId: string; productId: string; quantity: number } = req.body;
  addItemToCart(customerId, productId, quantity);
  res.status(200).send("Item added to cart.");
});

app.post("/apply-coupon", (req: Request, res: Response) => {
  const { cartValue, discountId }: { cartValue: number; discountId: string } =
    req.body;
  const discountedPrice = applyDiscountCoupon(cartValue, discountId);
  res.status(200).send(`Discounted price is ${discountedPrice}`);
});

app.get("/cart/:customerId", (req: Request, res: Response) => {
  const { customerId } = req.params;
  const customerCart = carts.get(customerId) || {};
  let cartValue = 0;
  for (const [productId, quantity] of Object.entries(customerCart)) {
    const productPrice = productId === "product1" ? 100 : 200; // Assume product prices for demonstration
    cartValue += productPrice * quantity;
  }
  res.status(200).send(`Cart value is ${cartValue}`);
});

app.post("/coupon", (req: Request, res: Response) => {
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
  res.status(200).send("Discount coupon added.");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
