import { inventory, discountCoupons, carts } from "./utils/datastructures";

/**
 * Adds an item to the inventory.
 * @param productId - The ID of the product.
 * @param quantity - The quantity of the product to add.
 * @throws Error if the quantity is less than or equal to 0.
 */
function addItemToInventory(productId: string, quantity: number): void {
  if (quantity <= 0) throw new Error("Quantity should be greater than 0");

  const currentQuantity = inventory.get(productId) || 0;
  inventory.set(productId, currentQuantity + quantity);
}

/**
 * Removes an item from the inventory.
 * @param productId - The ID of the product.
 * @param quantity - The quantity of the product to remove.
 * @throws Error if the quantity is less than or equal to 0 or if the product is not in the inventory.
 */
function removeItemFromInventory(productId: string, quantity: number): void {
  if (quantity <= 0) throw new Error("Quantity should be greater than 0");

  const currentQuantity = inventory.get(productId);
  if (!currentQuantity)
    throw new Error(`Product ${productId} is not in the inventory.`);

  const updatedQuantity = Math.max(currentQuantity - quantity, 0);
  inventory.set(productId, updatedQuantity);
}

/**
 * Adds an item to the customer's cart.
 * @param customerId - The ID of the customer.
 * @param productId - The ID of the product.
 * @param quantity - The quantity of the product to add to the cart.
 * @throws Error if the product is not in the inventory or if there is not enough quantity in the inventory.
 */
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

/**
 * Applies a discount coupon to the cart value.
 * @param cartValue - The total value of the cart.
 * @param discountId - The ID of the discount coupon.
 * @returns The discounted price after applying the coupon.
 * @throws Error if the discount coupon is not found.
 */
function applyDiscountCoupon(cartValue: number, discountId: string): number {
  const discount = discountCoupons.get(discountId);
  if (!discount) throw new Error(`Discount coupon ${discountId} not found.`);

  const { discountPercentage, maximumDiscountCap } = discount;
  const discountAmount = (cartValue * discountPercentage) / 100;
  const discountedPrice =
    cartValue - Math.min(discountAmount, maximumDiscountCap);
  return discountedPrice;
}

export {
  addItemToCart,
  addItemToInventory,
  applyDiscountCoupon,
  removeItemFromInventory,
};
