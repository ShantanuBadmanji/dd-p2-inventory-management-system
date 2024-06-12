import { Router, Request, Response } from "express";
import { applyDiscountCoupon } from "../services";
import { discountCoupons } from "../utils/datastructures";

// Define the routes here
const couponRouter = Router();

/**
 * GET route to retrieve the discount coupons.
 */
couponRouter.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ discountCoupons: Object.fromEntries(discountCoupons) });
});

/**
 * POST route to apply a discount coupon to the cart.
 */
couponRouter.post("/apply-coupon", (req: Request, res: Response) => {
  console.log(req.body);
  const { cartValue, discountId }: { cartValue: number; discountId: string } =
    req.body;
  const discountedPrice = applyDiscountCoupon(cartValue, discountId);
  res.status(200).json({
    message: "Discount applied.",
    data: { discountedPrice },
  });
});

/**
 * POST route to add a discount coupon.
 */
couponRouter.post("/add-coupon", (req: Request, res: Response) => {
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

export default couponRouter;
