import image1 from "../assets/images/heroCard1.png";
import image2 from "../assets/images/heroCard2.png";

export const cartDummy = {
  items: [
    {
      productId: "prod_001",
      productName: "Cold Pressed Groundnut Oil",
      productImage: image1,
      category: "Edible Oils",

      variant: {
        sku: "GNO-1L",
        weight: "1L",
        price: 420,
        mrp: 500,
        maxStock: 5,
      },

      quantity: 1,
      isAvailable: true,
      addedAt: "2025-01-10",
    },

    {
      productId: "prod_002",
      productName: "Organic Sesame Oil",
      productImage: image2,
      category: "Edible Oils",

      variant: {
        sku: "SEO-500",
        weight: "500ml",
        price: 250,
        mrp: 300,
        maxStock: 8,
      },

      quantity: 2,
      isAvailable: true,
      addedAt: "2025-01-10",
    },
  ],

  coupon: {
    code: "ORGANIC10",
    type: "percentage", // or "flat"
    value: 10,
    minCartValue: 500,
    maxDiscount: 200,
  },
};
