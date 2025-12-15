import oilImg from "../assets/images/heroCard1.png";
import sesameImg from "../assets/images/heroCard2.png";

export const ordersDummy = [
  {
    orderId: "ORD-2025-001",
    createdAt: "2025-01-12T10:30:00Z",
    status: "CONFIRMED",
    paymentMethod: "COD",
    paymentStatus: "PENDING",

    items: [
      {
        productName: "Cold Pressed Groundnut Oil",
        productImage: oilImg,
        variant: { weight: "1L", price: 420 },
        quantity: 1,
      },
    ],

    priceSummary: {
      total: 420,
    },
  },

  {
    orderId: "ORD-2025-002",
    createdAt: "2025-01-08T16:10:00Z",
    status: "DELIVERED",
    paymentMethod: "ONLINE",
    paymentStatus: "PAID",

    items: [
      {
        productName: "Organic Sesame Oil",
        productImage: sesameImg,
        variant: { weight: "500ml", price: 250 },
        quantity: 2,
      },
    ],

    priceSummary: {
      total: 500,
    },
  },
];
