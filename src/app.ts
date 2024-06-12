import express, { Request, Response } from "express";
import { json, urlencoded } from "body-parser";
import { inventoryRouter, cartRouter, couponRouter } from "./routes";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(cors()); // Enable CORS for all requests
app.use(express.json());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("combined"));

app.use("/inventory", inventoryRouter);
app.use("/cart", cartRouter);
app.use("/discount-coupons", couponRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Inventory Management System API" });
});

/**
 * Error handling middleware.
 */
app.use((err: Error, req: Request, res: Response, next: Function) => {
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;
