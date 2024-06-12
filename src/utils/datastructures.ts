/**
 * Represents the discount details.
 */
type DiscountDetail = {
  discountPercentage: number;
  maximumDiscountCap: number;
};

/**
 * Represents the customer's cart.
 */
type Cart = Record<string, number>;

export const inventory = new Map<string, number>();
export const carts = new Map<string, Cart>();
export const discountCoupons = new Map<string, DiscountDetail>();
