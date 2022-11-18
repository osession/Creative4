const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

let cart = [];
let myProducts = [];

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/test', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  color: String, 
  size: String,
  describe: String, 
  quantity: Number,
  contact: String
});

productSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });
  
productSchema.set('toJSON', {
  virtuals: true
});

const Product = mongoose.model('Product', productSchema);

app.get('/api/products', async (req, res) => {
  try {
    let products = await Product.find();
    myProducts = products;
    res.send({products: products});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
  
app.post('/api/products', async (req, res) => {
    const product = new Product({
    name: req.body.name,
    price: req.body.price,
    color: req.body.color,
    size: req.body.size,
    describe: req.body.describe,
    quantity: req.body.quantity,
    contact: req.body.contact
  });
  try {
    await product.save();
    res.send({product:product});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
  
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

const cartSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  contact: String, 
  total: Number
});

cartSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });
  
cartSchema.set('toJSON', {
  virtuals: true
});

const Cart = mongoose.model('Cart', cartSchema);

app.get('/api/cart', async (req, res) => {
  try {
    let items = await Cart.find();
    cart = items;
    res.send({items: items});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/cart/:name', async (req, res) => {
  let item = cart.find((item) => item.name == req.params.name);
  let match = myProducts.find((match) => match.name == req.params.name);
  if (item != undefined) {
    //console.log(item.name);
    item.quantity = item.quantity + 1;
    //console.log(item.quantity);
    try {
      await item.save();
      res.send({item:item});
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
  else {
    const item = new Cart({
      name: req.params.name,
      quantity: 1, 
      contact: match.contact
      //total: match.price
    });
    try {
      await item.save();
      res.send({item:item});
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
});

app.delete('/api/cart/:id', async (req, res) => {
  try {
    await Cart.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/cart/:id/:quantity', async (req, res) => {
  console.log(req.params);
  let item = cart.find((item) => item.id == req.params.id);
  //console.log(match.data.items);
  let newQuant = req.params.quantity;
  if (item != undefined) {
    //console.log(item.name);
    let match = myProducts.find((match) => match.name == item.name);
    if (newQuant == 0) {
      try {
        await Cart.deleteOne({
          _id: req.params.id
        });
        res.sendStatus(200);
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
    } 
    else if (newQuant > match.quantity) {
      console.log("Quantity exceeds availabiility");
    }
    else {
      item.quantity = newQuant;
      //item.total = item.quantity * item.price
      try {
        await item.save();
        res.send({item:item});
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
    }
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
  
  