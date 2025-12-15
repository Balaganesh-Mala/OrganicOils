import image1 from "../assets/images/heroCard1.png";
import image2 from "../assets/images/heroCard2.png";
import image3 from "../assets/images/heroCard3.png";
import image4 from "../assets/images/heroCard4.png";
import image5 from "../assets/images/heroCard5.png";
import image6 from "../assets/images/heroCard6.png";
import image7 from "../assets/images/heroCard7.png";


export const products = [
  {
    _id: "prod_001",
    productName: "Cold Pressed Groundnut Oil",
    shortDescription: "100% natural cold pressed groundnut oil",
    description:
      "Traditional wood-pressed groundnut oil made from premium quality peanuts using age-old methods to preserve nutrients and aroma.",

    brand: "MB Organic",
    category: "Organic Seeds",

    variants: [
      {
        weight: "500ml",
        price: 220,
        mrp: 260,
        stock: 10,
        sku: "GNO-500",
      },
      {
        weight: "1L",
        price: 420,
        mrp: 500,
        stock: 5,
        sku: "GNO-1L",
      },
    ],

    isOrganic: true,
    coldPressed: true,
    ingredients: ["Groundnuts"],
    shelfLife: "6 months",
    expiryDate: "2026-01-30",
    storageInstructions: "Store in a cool and dry place",
    madeIn: "India",

    isFeatured: true,
    isBestSeller: true,
    isActive: true,

    images: [
      { url: image1 },
      { url: image2 },
    ],

    ratings: 4.6,
    numOfReviews: 24,

    reviews: [
      {
        name: "Ramesh Kumar",
        rating: 5,
        comment: "Excellent quality oil, very fresh and aromatic.",
      },
      {
        name: "Sita Devi",
        rating: 4,
        comment: "Good taste and purity, worth the price.",
      },
    ],
  },

  {
    _id: "prod_002",
    productName: "Cold Pressed Sesame Oil",
    shortDescription: "Traditional wood pressed sesame oil",
    description:
      "Pure cold pressed sesame oil extracted using wooden churners to retain natural flavor and nutrients.",

    brand: "MB Organic",
    category: "Cold Pressed Oils",

    variants: [
      {
        weight: "500ml",
        price: 250,
        mrp: 300,
        stock: 0,
        sku: "SEO-500",
      },
      {
        weight: "1L",
        price: 480,
        mrp: 560,
        stock: 4,
        sku: "SEO-1L",
      },
    ],

    isOrganic: true,
    coldPressed: true,
    ingredients: ["Sesame Seeds"],
    shelfLife: "6 months",
    expiryDate: "2026-02-15",
    storageInstructions: "Store in airtight container away from sunlight",
    madeIn: "India",

    isFeatured: true,
    isBestSeller: false,
    isActive: true,

    images: [
      { url: image3 },
      { url: image4 },
    ],

    ratings: 4.4,
    numOfReviews: 18,

    reviews: [
      {
        name: "Anil",
        rating: 5,
        comment: "Very authentic taste, reminds me of village oil.",
      },
      {
        name: "Meena",
        rating: 4,
        comment: "Good quality but packaging can be improved.",
      },
    ],
  },

  {
    _id: "prod_003",
    productName: "Homemade Mango Pickle",
    shortDescription: "Spicy traditional homemade mango pickle",
    description:
      "Authentic Andhra-style mango pickle prepared using handpicked raw mangoes and cold pressed oil.",

    brand: "MB Organic",
    category: "Traditional Pickles",

    variants: [
      {
        weight: "250g",
        price: 120,
        mrp: 150,
        stock: 12,
        sku: "MP-250",
      },
      {
        weight: "500g",
        price: 220,
        mrp: 260,
        stock: 6,
        sku: "MP-500",
      },
    ],

    isOrganic: true,
    coldPressed: false,
    ingredients: ["Raw Mango", "Red Chilli", "Salt", "Mustard", "Oil"],
    shelfLife: "12 months",
    expiryDate: "2026-06-01",
    storageInstructions: "Keep refrigerated after opening",
    madeIn: "India",

    isFeatured: false,
    isBestSeller: true,
    isActive: true,

    images: [
      { url: image5 },
      { url: image6 },
    ],

    ratings: 4.7,
    numOfReviews: 32,

    reviews: [
      {
        name: "Lakshmi",
        rating: 5,
        comment: "Perfect spice level and very tasty.",
      },
      {
        name: "Suresh",
        rating: 4,
        comment: "Authentic homemade flavor.",
      },
    ],
  },

  {
    _id: "prod_004",
    productName: "Organic Sunflower Seeds",
    shortDescription: "High nutrition raw organic sunflower seeds",
    description:
      "Premium quality organic sunflower seeds rich in protein, fiber, and healthy fats.",

    brand: "MB Organic",
    category: "Seeds",

    variants: [
      {
        weight: "250g",
        price: 90,
        mrp: 120,
        stock: 20,
        sku: "SFS-250",
      },
      {
        weight: "500g",
        price: 170,
        mrp: 220,
        stock: 10,
        sku: "SFS-500",
      },
    ],

    isOrganic: true,
    coldPressed: false,
    ingredients: ["Sunflower Seeds"],
    shelfLife: "9 months",
    expiryDate: "2026-04-20",
    storageInstructions: "Store in airtight container",
    madeIn: "India",

    isFeatured: false,
    isBestSeller: false,
    isActive: true,

    images: [
      { url: image7 },
      { url: image1 },
    ],

    ratings: 4.3,
    numOfReviews: 14,

    reviews: [
      {
        name: "Kiran",
        rating: 4,
        comment: "Fresh seeds, good quality.",
      },
      {
        name: "Divya",
        rating: 5,
        comment: "Very healthy and clean packaging.",
      },
    ],
  },
  {
    _id: "prod_005",
    productName: "Organic Sesame Oil",
    shortDescription: "Traditional wood pressed sesame oil",
    description:
      "Pure cold pressed sesame oil extracted using wooden churners to retain natural flavor and nutrients.",

    brand: "Pristine Organic",
    category: "Cold Pressed Oils",

    variants: [
      {
        weight: "500ml",
        price: 250,
        mrp: 300,
        stock: 2,
        sku: "SEO-500",
      },
      {
        weight: "1L",
        price: 480,
        mrp: 560,
        stock: 4,
        sku: "SEO-1L",
      },
    ],

    isOrganic: true,
    coldPressed: true,
    ingredients: ["Sesame Seeds"],
    shelfLife: "6 months",
    expiryDate: "2026-02-15",
    storageInstructions: "Store in airtight container away from sunlight",
    madeIn: "India",

    isFeatured: true,
    isBestSeller: false,
    isActive: true,

    images: [
      { url: image4 },
    ],

    ratings: 4.4,
    numOfReviews: 18,

    reviews: [
      {
        name: "Anil",
        rating: 5,
        comment: "Very authentic taste, reminds me of village oil.",
      },
      {
        name: "Meena",
        rating: 4,
        comment: "Good quality but packaging can be improved.",
      },
    ],
  },
  {
    _id: "prod_006",
    productName: "Organic yellow mustard seeds",
    shortDescription: "High nutrition raw organic sunflower seeds",
    description:
      "Premium quality organic sunflower seeds rich in protein, fiber, and healthy fats.",

    brand: "MB Organic",
    category: "Seeds",

    variants: [
      {
        weight: "250g",
        price: 90,
        mrp: 120,
        stock: 20,
        sku: "SFS-250",
      },
      {
        weight: "500g",
        price: 170,
        mrp: 220,
        stock: 10,
        sku: "SFS-500",
      },
    ],

    isOrganic: true,
    coldPressed: false,
    ingredients: ["Sunflower Seeds"],
    shelfLife: "9 months",
    expiryDate: "2026-04-20",
    storageInstructions: "Store in airtight container",
    madeIn: "India",

    isFeatured: false,
    isBestSeller: false,
    isActive: true,

    images: [
      { url: image6 },
      { url: image2 },
    ],

    ratings: 4.3,
    numOfReviews: 14,

    reviews: [
      {
        name: "Kiran",
        rating: 4,
        comment: "Fresh seeds, good quality.",
      },
      {
        name: "Divya",
        rating: 5,
        comment: "Very healthy and clean packaging.",
      },
    ],
  },
  {
    _id: "prod_007",
    productName: "Organic Groundnut Seeds",
    shortDescription: "High nutrition raw organic sunflower seeds",
    description:
      "Premium quality organic sunflower seeds rich in protein, fiber, and healthy fats.",

    brand: "MB Organic",
    category: "Seeds",

    variants: [
      {
        weight: "250g",
        price: 90,
        mrp: 120,
        stock: 20,
        sku: "SFS-250",
      },
      {
        weight: "500g",
        price: 170,
        mrp: 220,
        stock: 10,
        sku: "SFS-500",
      },
    ],

    isOrganic: true,
    coldPressed: false,
    ingredients: ["Sunflower Seeds"],
    shelfLife: "9 months",
    expiryDate: "2026-04-20",
    storageInstructions: "Store in airtight container",
    madeIn: "India",

    isFeatured: false,
    isBestSeller: false,
    isActive: true,

    images: [
      { url: image2 },
      { url: image6 },
    ],

    ratings: 4.3,
    numOfReviews: 14,

    reviews: [
      {
        name: "Kiran",
        rating: 4,
        comment: "Fresh seeds, good quality.",
      },
      {
        name: "Divya",
        rating: 5,
        comment: "Very healthy and clean packaging.",
      },
    ],
  },
];
