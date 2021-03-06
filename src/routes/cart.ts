// require the express module
import express from "express";
import Item from "../models/Item";

// create a new Router object
const cartRouter = express.Router();

const cart: Item[] = [
  {
    id: 1,
    product: "Oat Milk",
    price: 5,
    quantity: 60,
  },
  {
    id: 2,
    product: "Frosted Flakes",
    price: 3,
    quantity: 1,
  },
  {
    id: 3,
    product: "Olives",
    price: 3,
    quantity: 1,
  },
  {
    id: 4,
    product: "Pepsi",
    price: 6,
    quantity: 2,
  },
  {
    id: 5,
    product: "Turkey slices",
    price: 4,
    quantity: 3,
  },
];
let nextId = 6;

cartRouter.get("/cart-items", (req, res) => {
  const { maxPrice, prefix, pageSize } = req.query;
  let filteredArray: Item[] = cart;
  if (maxPrice) {
    filteredArray = filteredArray.filter(
      (item) => item.price <= parseFloat(maxPrice as string)
    );
  }
  if (prefix) {
    filteredArray = filteredArray.filter((item) =>
      item.product.toLowerCase().startsWith(prefix as string)
    );
  }
  if (pageSize) {
    filteredArray = filteredArray.slice(0, parseInt(pageSize as string));
  }
  res.status(200);
  res.json(filteredArray);
});

cartRouter.get("/cart-items/:id", (req, res) => {
  const id: number = parseInt(req.params.id);
  const cartItem = cart.find((item) => item.id === id);
  if (cartItem) {
    res.status(200);
    res.json(cartItem);
  } else {
    res.status(404);
    res.send("ID not found");
  }
});

cartRouter.post("/cart-items", (req, res) => {
  const cartItem: Item = req.body;
  cartItem.id = nextId;
  nextId++;
  cart.push(cartItem);
  res.status(201);
  res.json(cartItem);
});

cartRouter.put("/cart-items/:id", (req, res) => {
  const id: number = parseInt(req.params.id);
  const index: number = cart.findIndex((item) => item.id === id);
  if (index === -1) {
    res.status(404);
    res.send("Please enter a valid id");
  } else {
    const updatedItem: Item = req.body;
    updatedItem.id = id;
    cart[index] = updatedItem;
    res.status(200);
    res.json(updatedItem);
  }
});

cartRouter.delete("/cart-items/:id", (req, res) => {
  const id: number = parseInt(req.params.id);
  const index: number = cart.findIndex((item) => item.id === id);
  cart.splice(index, 1);
  res.sendStatus(204);
});

export default cartRouter;
