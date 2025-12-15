export const coupons = [
  {
    code: "WELCOME10",
    type: "PERCENT",          // PERCENT | FLAT
    value: 10,                // 10%
    minCartValue: 500,
    maxDiscount: 150,
    expiry: "2026-01-01",
    isActive: true,
    usageLimit: 1,            // per user
  },
  {
    code: "FLAT50",
    type: "FLAT",             // flat ₹
    value: 50,
    minCartValue: 399,
    expiry: "2025-12-31",
    isActive: true,
  },
];
