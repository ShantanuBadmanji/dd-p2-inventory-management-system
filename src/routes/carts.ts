import { Router, Request, Response } from "express";
import { addItemToCart } from "../services";
import { carts } from "../utils/datastructures";

// Define the routes here
const cartRouter = Router();
/**
 * POST route to add items to the customer's cart.
 */
cartRouter.post("/add-items", (req: Request, res: Response) => {
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

/**
 * GET route to retrieve the customer's cart.
 */
cartRouter.get("/:customerId", (req: Request, res: Response) => {
  const { customerId } = req.params;
  res.status(200).json({ customerId, cart: carts.get(customerId) || {} });
});

export default cartRouter;