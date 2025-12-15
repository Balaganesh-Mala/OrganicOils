export const profileDummy = {
  _id: "user_001",

  fullName: "Ramesh Kumar",
  email: "ramesh@gmail.com",
  phone: "9876543210",

  avatar: "https://i.pravatar.cc/150?img=12",

  createdAt: "2024-06-15",

  addresses: [
    {
      _id: "addr_001",
      fullName: "Ramesh Kumar",
      phone: "9876543210",
      street: "12-3-45, MG Street",
      city: "Anantapur",
      state: "Andhra Pradesh",
      pincode: "515001",
      isDefault: true,
    },
    {
      _id: "addr_002",
      fullName: "Ramesh Kumar",
      phone: "9876543210",
      street: "Flat 302, Green Residency",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560076",
      isDefault: false,
    },
  ],

  stats: {
    totalOrders: 12,
    delivered: 9,
    pending: 2,
    cancelled: 1,
  },
};
