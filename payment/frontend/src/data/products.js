const img = (seed) => `https://picsum.photos/seed/${seed}/200/200`;

export const products = [
  { id: 1,  name: "Wireless Bluetooth Earbuds", price: 1499, image: img("earbuds") },
  { id: 2,  name: "Smart Fitness Band",         price: 2499, image: img("fitnessband") },
  { id: 3,  name: "Mechanical Keyboard",        price: 3299, image: img("keyboard") },
  { id: 4,  name: "Wireless Gaming Mouse",      price: 1799, image: img("gamingmouse") },
  { id: 5,  name: "Power Bank 10000mAh",        price: 1199, image: img("powerbank") },
  { id: 6,  name: "Laptop Backpack",            price: 1399, image: img("backpack") },
  { id: 7,  name: "65W USB-C Fast Charger",     price: 1299, image: img("charger") },
  { id: 8,  name: "Portable Bluetooth Speaker", price: 2199, image: img("speaker") },
  { id: 9,  name: "Full HD Webcam",             price: 1999, image: img("webcam") },
  { id: 10, name: "LED Desk Lamp",              price: 899,  image: img("desklamp") },
];