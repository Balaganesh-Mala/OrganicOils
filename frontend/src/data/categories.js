// src/data/categories.js
import oilsImg from "../assets/images/heroCard1.png";
import seedsImg from "../assets/images/heroCard2.png";
import picklesImg from "../assets/images/heroCard3.png";

export const categories = [
  {
    _id: "cat_oils",
    title: "Cold Pressed Oils",
    slug: "cold-pressed-oils",
    description:
      "Pure, natural cold pressed oils extracted using traditional wooden chekku methods.",
    image: { url: oilsImg },
    highlights: ["Wood Pressed", "No Chemicals", "Rich Aroma"],
    isActive: true,
  },
  {
    _id: "cat_seeds",
    title: "Organic Seeds",
    slug: "organic-seeds",
    description:
      "High-quality organic seeds rich in nutrients, perfect for daily healthy consumption.",
    image: { url: seedsImg },
    highlights: ["High Nutrition", "Naturally Sourced", "No Preservatives"],
    isActive: true,
  },
  {
    _id: "cat_pickles",
    title: "Traditional Pickles",
    slug: "traditional-pickles",
    description:
      "Homemade style pickles prepared with authentic recipes and cold pressed oils.",
    image: { url: picklesImg },
    highlights: ["Homemade", "Authentic Taste", "No Artificial Colors"],
    isActive: true,
  },
  
];
