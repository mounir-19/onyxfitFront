import plant from "../assets/plant.png";
import creatine from "../assets/creatine.png";
import protein from "../assets/protien.png";
import energy from "../assets/energy.png";
import range from "../assets/Range.png";
import multivitamins from "../assets/multivitamin.png";
import str from "../assets/str.png";
import rec from "../assets/recovery.png";
import lean from "../assets/lean.png";
import gain from "../assets/gain.png";
import lose from "../assets/lose.png";
import b1 from "../assets/best1.png";
import b2 from "../assets/best2.png";
import b3 from "../assets/best3.png";
import b4 from "../assets/best4.png";
import heroSection from "../assets/heroSection.png"; // adjust extension if .jpg/.webp

export const NAV_LINKS = [
  "FOOD",
  "PROTEINS",
  "SPORTS NUTRITION",
  "SPORTSWEAR",
  "ACCESSORIES",
  "TOP OFFERS",
];

export const TICKER_TEXT =
  "ALL PROTEIN AND PRE-WORKOUTS! | UP TO -75% | PRE-WORKOUTS! | UP TO -75% | ";

export const SLIDES = [
  {
    badge: "FLASH DEAL",
    l1: "RECOVER",
    l2: "FASTER",
    sub: "Advanced recovery supplements to help your muscles bounce back after hard training.",
    product: "BCAA Recovery Formula",
    img: heroSection
  },
];
export const CATS = [
  {
    label: "Protein\nPowders",
    img: protein,
  },
  {
    label: "Creatine",
    img: creatine,
  },
  {
    label: "Energy",
    img: energy,
  },
  {
    label: "Platinium\nRange",
    img: range,
  },
  {
    label: "Multivitamins",
    img: multivitamins,
  },
  {
    label: "Plant protein",
    img: plant,
  },
];

export const GOALS = [
  {
    label: "LEAN\nMUSCLE",
    img: lean,
  },
  {
    label: "GAIN\nMASS",
    img: gain,
  },
  {
    label: "LOSE\nWEIGHT",
    img: lose,
  },
  {
    label: "RECOVERY",
    img: rec,
  },
  {
    label: "STRENGTH",
    img: str,
  },
];

export const PRODUCTS = [
  {
    id: 1,
    name: "Gold Standard 100% Whey Protein Powder",
    brand: "Optimum Nutrition",
    category: "Proteins",
    goal: ["Lean Muscle", "Gain Mass"],
    rating: 4.9,
    reviews: 1467,
    price: 21.99,
    oldPrice: null,
    badge: null,
    img: b1,
    imgs: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=700&q=80",
      "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=700&q=80",
      "https://images.unsplash.com/photo-1648984732564-4f39da64bd13?w=700&q=80",
    ],
    flavours: [
      "Double Rich Chocolate",
      "Vanilla Ice Cream",
      "Strawberry",
      "Cookies & Cream",
    ],
    sizes: ["908g", "2270g", "4540g"],
    description:
      "Gold Standard 100% Whey has been the world's best-selling whey protein powder for over two decades. Each serving delivers 24g of blended protein consisting of whey protein isolate, whey protein concentrate and whey peptides to support your muscle-building goals.",
    highlights: [
      "24g protein per serving",
      "5.5g BCAAs naturally occurring",
      "4g glutamine & glutamic acid",
      "Banned substance tested",
      "Instantised for easy mixing",
    ],
    nutrition: [
      { label: "Calories", value: "120 kcal" },
      { label: "Protein", value: "24g" },
      { label: "Carbohydrates", value: "3g" },
      { label: "Sugars", value: "1g" },
      { label: "Fat", value: "1.5g" },
      { label: "Sodium", value: "130mg" },
    ],
  },
  {
    id: 2,
    name: "2x Gold Standard 100% Whey Protein (2270g)",
    brand: "Optimum Nutrition",
    category: "Proteins",
    goal: ["Lean Muscle", "Gain Mass"],
    rating: 0,
    reviews: 0,
    price: 174.0,
    oldPrice: 169.2,
    badge: "SAVE €4.80",
    img: b2,
    imgs: [
      "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=700&q=80",
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=700&q=80",
    ],
    flavours: ["Double Rich Chocolate", "Vanilla Ice Cream", "Strawberry"],
    sizes: ["2x 2270g"],
    description:
      "Get twice the gains with this double bundle of the world's #1 selling whey protein. Perfect for serious athletes who go through protein quickly and want to save on every order.",
    highlights: [
      "2x 2270g tubs",
      "48g protein per double serving",
      "Best value bundle",
      "Free shipping included",
      "Banned substance tested",
    ],
    nutrition: [
      { label: "Calories", value: "120 kcal" },
      { label: "Protein", value: "24g" },
      { label: "Carbohydrates", value: "3g" },
      { label: "Sugars", value: "1g" },
      { label: "Fat", value: "1.5g" },
      { label: "Sodium", value: "130mg" },
    ],
  },
  {
    id: 3,
    name: "Micronised Creatine Powder",
    brand: "Optimum Nutrition",
    category: "Creatine",
    goal: ["Strength", "Gain Mass"],
    rating: 4.8,
    reviews: 269,
    price: 15.0,
    oldPrice: null,
    badge: null,
    img: b3,
    imgs: [
      "https://images.unsplash.com/photo-1648984732564-4f39da64bd13?w=700&q=80",
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=700&q=80",
    ],
    flavours: ["Unflavoured"],
    sizes: ["317g", "634g"],
    description:
      "Optimum Nutrition Micronised Creatine Powder is made with CreaPure®, the purest form of creatine monohydrate available. Supports increases in muscle size, strength and power output during high-intensity training.",
    highlights: [
      "100% creatine monohydrate",
      "Micronised for better mixing",
      "3g per serving",
      "Unflavoured — stacks with anything",
      "CreaPure® certified",
    ],
    nutrition: [
      { label: "Calories", value: "0 kcal" },
      { label: "Protein", value: "0g" },
      { label: "Carbohydrates", value: "0g" },
      { label: "Creatine", value: "3g" },
      { label: "Fat", value: "0g" },
      { label: "Sodium", value: "0mg" },
    ],
  },
  {
    id: 4,
    name: "Serious Mass Weight Gainer Protein Powder",
    brand: "Optimum Nutrition",
    category: "Proteins",
    goal: ["Gain Mass"],
    rating: 4.8,
    reviews: 161,
    price: 30.0,
    oldPrice: null,
    badge: null,
    img: b4,
    imgs: [
      "https://images.unsplash.com/photo-1611077543867-bab08b6cf9b4?w=700&q=80",
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=700&q=80",
    ],
    flavours: ["Chocolate", "Vanilla", "Banana", "Strawberry"],
    sizes: ["1360g", "2720g", "5450g"],
    description:
      "Serious Mass is the ultimate in weight gain formulas. With 1,250 calories per serving and 50g of blended protein to support muscle recovery, it's designed for those who need serious calorie support to bulk up.",
    highlights: [
      "1,250 calories per serving",
      "50g blended protein",
      "250g carbohydrates",
      "25 vitamins & minerals",
      "Added creatine & glutamine",
    ],
    nutrition: [
      { label: "Calories", value: "1250 kcal" },
      { label: "Protein", value: "50g" },
      { label: "Carbohydrates", value: "250g" },
      { label: "Sugars", value: "20g" },
      { label: "Fat", value: "4.5g" },
      { label: "Sodium", value: "470mg" },
    ],
  },
];

export const SOCIAL_PATHS = [
  "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
  "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z",
  "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM10 15V9l5.2 3-5.2 3z",
];