import hero from "./hero.png";
import about from "./about.png";
import about1 from "./about1.png";
import about2 from "./about2.png";
import about3 from "./about3.png";
import about4 from "./about4.png";
import apple from "./apple.png";
import arrival_icon1 from "./arrival_icon1.png";
import arrival_icon2 from "./arrival_icon2.png";
import arrival_icon3 from "./arrival_icon3.png";
import bag from "./bag.png";
import cart from "./cart.png";
import call from "./call.png";
import message from "./message.png";
import category from "./category.png";
import computer from "./computer.png";
import f1 from "./f1.png";
import f2 from "./f2.png";
import f3 from "./f3.png";
import f4 from "./f4.png";
import free_delivery from "./free_delivery.png";
import game from "./game.png";
import head_phone from "./head_phone.png";
import login_image from "./login_image.png";
import minus from "./minus.png";
import plus from "./plus.png";
import music from "./music.png";
import new_arrival_right from "./new_arrival_right.png";
import new_arrival_left from "./new_arrival_left.png";
import p1 from "./p1.png";
import p2 from "./p2.png";
import p3 from "./p3.png";
import p5 from "./p5.png";
import p6 from "./p6.png";
import p7 from "./p7.png";
import p8 from "./p8.png";
import phone from "./phone.png";
import r1 from "./r1.png";
import r2 from "./r2.png";
import r3 from "./r3.png";
import remove_icon from "./remove_icon.png";
import right_arrow from "./right_arrow.png";
import shirt from "./shirt.png";
import table from "./table.png";
import team1 from "./team1.png";
import team2 from "./team2.png";
import team3 from "./team3.png";
import user from "./user.png";
import watch from "./watch.png";
import wish from "./wish.png";
import search from "./search.png";
import red_heart from "./red_heart.webp";

export const assets = {
  hero,
  red_heart,
  search,
  category,
  new_arrival_left,
  new_arrival_right,
  call,
  cart,
  wish,
  free_delivery,
  right_arrow,
  login_image,
  user,
  plus,
  minus,
  remove_icon,
  message,
  apple,
  about,
};

export const aboutData = [
  { id: 1001, image: about1, number: "10.5k", text: "solar active on our site" },
  { id: 1002, image: about2, number: "45.5k", text: "customer active on our site" },
  { id: 1003, image: about3, number: "25k", text: "annual gross sale on our site" },
  { id: 1004, image: about4, number: "33k", text: "Monthly Product sale" },
];

export const latestProducts = [
  {
    id: 2001,
    image: f1,
    name: "Wireless Gamepad",
    oldPrice: 59.99,
    newPrice: 39.99,
    rating: r2,
    number: 88,
    discount: -50,
    description: "Experience ultimate gaming control with our wireless gamepad...",
  },
  {
    id: 2002,
    image: f2,
    name: "Mechanical Keyboard",
    oldPrice: 89.99,
    newPrice: 69.99,
    rating: r1,
    number: 99,
    discount: -13,
    description: "Enhance your typing and gaming with this mechanical keyboard...",
  },
  {
    id: 2003,
    image: f3,
    name: "LED Monitor",
    oldPrice: 199.99,
    newPrice: 149.99,
    rating: r3,
    number: 105,
    discount: -23,
    description: "Get stunning visuals with this high-resolution LED monitor...",
  },
  {
    id: 2004,
    image: f4,
    name: "Ergonomic Gaming Chair",
    oldPrice: 249.99,
    newPrice: 199.99,
    rating: r1,
    number: 200,
    discount: -33,
    description: "Sit in comfort for long hours with this ergonomic gaming chair...",
  },
];

export const categories = [
  { id: 3001, image: phone, name: "Phone" },
  { id: 3002, image: computer, name: "Computer" },
  { id: 3003, image: watch, name: "Watch" },
  { id: 3004, image: game, name: "Game" },
  { id: 3005, image: head_phone, name: "Headphone" },
];

export const BestProducts = [
  {
    id: 4001,
    image: bag,
    name: "Stylish Backpack",
    oldPrice: 49.99,
    newPrice: 29.99,
    rating: r1,
    number: 88,
    discount: -50,
    description: "Carry your essentials in style with this durable backpack...",
  },
  {
    id: 4002,
    image: shirt,
    name: "Casual Shirt",
    oldPrice: 39.99,
    newPrice: 24.99,
    rating: r3,
    number: 88,
    discount: -33,
    description: "Stay comfortable and fashionable with this premium casual shirt...",
  },
  {
    id: 4003,
    image: music,
    name: "Wireless Earbuds",
    oldPrice: 79.99,
    newPrice: 49.99,
    rating: r1,
    number: 88,
    discount: -20,
    description: "Enjoy crystal-clear sound with these wireless earbuds...",
  },
  {
    id: 4004,
    image: table,
    name: "Wooden Study Table",
    oldPrice: 159.99,
    newPrice: 119.99,
    rating: r2,
    number: 88,
    discount: -28,
    description: "Upgrade your workspace with this elegant wooden study table...",
  },
];

export const products = [
  {
    id: 5001,
    image: p1,
    name: "Dry Dog Food",
    oldPrice: 5.99,
    newPrice: 3.99,
    rating: r1,
    number: 88,
    discount: -50,
    description: "Freshly baked bread with a soft and fluffy texture...",
  },
  {
    id: 5002,
    image: p2,
    name: "Camera",
    oldPrice: 29.99,
    newPrice: 24.99,
    rating: r2,
    number: 89,
    discount: -30,
    description: "Nutritious dry dog food with high protein...",
  },
  {
    id: 5003,
    image: p3,
    name: "Laptop",
    oldPrice: 499.99,
    newPrice: 399.99,
    rating: r3,
    number: 106,
    discount: -20,
    description: "Capture stunning photos with this high-quality digital camera...",
  },
  {
    id: 5004,
    image: p5,
    name: "Suzuki Honda",
    oldPrice: 14.99,
    newPrice: 9.99,
    rating: r2,
    number: 200,
    discount: -20,
    description: "Gentle face wash that cleanses and hydrates your skin...",
  },
  {
    id: 5005,
    image: p6,
    name: "Winter bau",
    oldPrice: 24999.99,
    newPrice: 22999.99,
    rating: r2,
    number: 70,
    discount: -36,
    description: "Stylish and fuel-efficient car with advanced safety features...",
  },
  {
    id: 5006,
    image: p7,
    name: "Gamepad",
    oldPrice: 79.99,
    newPrice: 59.99,
    rating: r1,
    number: 88,
    discount: -50,
    description: "Comfortable and stylish shoes designed for daily wear...",
  },
  {
    id: 5007,
    image: p8,
    name: "jacket",
    oldPrice: 59.99,
    newPrice: 39.99,
    rating: r2,
    number: 167,
    discount: -25,
    description: "Wireless gamepad with precise controls...",
  },
];

export const newArrivalData = [
  {
    id: 6001,
    image: arrival_icon1,
    text: "FREE AND FAST DELIVERY",
    description: "upgrade your workspace with this elegant wooden",
  },
  {
    id: 6002,
    image: arrival_icon2,
    text: "CUSTOMER SERVICE",
    description: "upgrade your workspace with this elegant wooden",
  },
  {
    id: 6003,
    image: arrival_icon3,
    text: "MONEY BACK GUARANTEE",
    description: "upgrade your workspace with this elegant wooden",
  },
];

export const team = [
  { id: 7001, image: team1, name: "Tom Cruise", designation: "Founder & Chairman" },
  { id: 7002, image: team2, name: "Emma Watson", designation: "Managing Director" },
  { id: 7003, image: team3, name: "Will Smith", designation: "Product designer" },
];