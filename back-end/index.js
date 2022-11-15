const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

let cart = [];

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/test', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
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
    res.send({products: products});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
  
app.post('/api/products', async (req, res) => {
    const product = new Product({
    name: req.body.name,
    price: req.body.price
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
  if (item != undefined) {
    console.log(item.name);
    item.quantity = item.quantity + 1;
    console.log(item.quantity);
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
      quantity: 1
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
  let item = cart.find((item) => item.id == req.params.id);
  if (item != undefined) {
    console.log(item.name);
    item.quantity = req.params.quantity;
    if (item.quantity == 0) {
      try {
        await Cart.deleteOne({
          _id: req.params.id
        });
        res.sendStatus(200);
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
    } else {
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
  
  