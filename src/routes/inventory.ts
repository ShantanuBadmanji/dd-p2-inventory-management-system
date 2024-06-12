import e, { Router, Request, Response } from "express";
import { addItemToInventory, removeItemFromInventory } from "../services";
import { inventory } from "../utils/datastructures";

// Define the routes here
const inventoryRouter = Router();
/**
 * GET route to retrieve the inventory.
 */
inventoryRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({ inventory: Object.fromEntries(inventory) });
});

/**
 * POST route to add items to the inventory.
 */
inventoryRouter.post("/add-items", (req: Request, res: Response) => {
  console.log(req.body);
  const { productId, quantity }: { productId: string; quantity: number } =
    req.body;
  addItemToInventory(productId, quantity);
  res.status(201).json({
    message: "Item added to inventory.",
    data: { inventory: Object.fromEntries(inventory) },
  });
});

/**
 * PATCH route to remove items from the inventory.
 */
inventoryRouter.patch("/remove-items", (req: Request, res: Response) => {
  console.log(req.body);
  const { productId, quantity }: { productId: string; quantity: number } =
    req.body;

  removeItemFromInventory(productId, quantity);
  res.status(200).json({
    message: "Item removed from inventory.",
    data: { inventory: Object.fromEntries(inventory) },
  });
});

export default inventoryRouter;
