import { useState, useEffect } from 'react';
import myImage from './clothing.png';
import axios from 'axios';
import './App.css';

function App() {
  // setup state
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [cart, setCart] = useState([]);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [describe, setDescribe] = useState("");
  const [contact, setContact] = useState("");
  const [quantity, setQuantity] = useState();
  
  const fetchProducts = async() => {
    try {      
      const response = await axios.get("/api/products");
      console.log(response.data);
      setProducts(response.data.products);
    } catch(error) {
      setError("error retrieving products: " + error);
    }
  }
  const createProduct = async() => {
    try {
      await axios.post("/api/products", {name: name, price: price, color: color, size: size, describe: describe, quantity: quantity, contact:contact});
    } catch(error) {
      setError("error adding a product: " + error);
    }
  }
  const deleteOneProduct = async(product) => {
    try {
      await axios.delete("/api/products/" + product.id);
    } catch(error) {
      setError("error deleting a product" + error);
    }
  }

  // fetch ticket data
  useEffect(() => {
    fetchProducts();
  },[]);

  const addProduct = async(e) => {
    e.preventDefault();
    await createProduct();
    fetchProducts();
    setName("");
    setPrice();
    setColor("");
    setSize("");
    setDescribe("");
    setQuantity();
    setContact("");
  }

  const deleteProduct = async(product) => {
    await deleteOneProduct(product);
    fetchProducts();
  }
  
  const fetchCart = async() => {
    try {
      const response = await axios.get("/api/cart");
      console.log(response);
      setCart(response.data.items);
      /*let newItems =  await response.data.map( async item =>{
        item.name = await getName(item.id);
        //console.log(item);
        setItems([...newItems, item]);
        return item;})
      console.log(newItems);*/
    } catch(error) {
      setError("error retreiving cart" + error);
    }
  }
  
  const addToCart = async(name) => {
    try {
      //console.log(id);
      await axios.post("/api/cart/" + name);
      //updateCart();
      //console.log(cart);
    } catch(error) {
      setError("error adding to cart: " + error);
    }
  }
  
  const addOneItem = async(name) => {
    await addToCart(name);
    fetchCart();
  }
  
  const deleteOneItem = async(item) => {
    try {
      await axios.delete("/api/cart/" + item.id);
    } catch(error) {
      setError("error deleting a item" + error);
    }
  }
  
  const deleteItem = async(item) => {
    await deleteOneItem(item);
    fetchCart();
  }
  
  const decreaseQuantity = async(id, quant) => {
    try {
      await axios.put("/api/cart/" + id + "/" + quant);
      //updateCart();
      //console.log(cart);
    } catch(error) {
      setError("error decreasing quantity: " + error);
    }
  }
  
  const putOneBack = async(id, quant) => {
    await decreaseQuantity(id, quant);
    fetchCart();
  }
  
  const increaseQuantity = async(id, quant) => {
    try {
      await axios.put("/api/cart/" + id + "/" + quant);
      //console.log(cart);
    } catch(error) {
      setError("error increasing quantity: " + error);
    }
  }
  
  const addAnother = async(id, quant) => {
    await increaseQuantity(id, quant);
    fetchCart();
  }


  // render results
  return (
    <div className="App">
      {error}
      <div className="header">
        <h1>Sell your used clothes!</h1>
        <h3>All you have to do is post the name, asking price, color, and a description of the design, if any.</h3>
        <p>Anyone can purchase your clothes! When they add to their cart, 
        they can view your contact information to message you about exchange of the item and payment.</p>
      </div>
      <div className="columns">
      <div className="create">
      <h2>Create a Product</h2>
      <form onSubmit={addProduct}>
        <div>
          <label>
            Name:
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Price:
            <input type="number" value={price} onChange={e=>setPrice(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Color:
            <input type="text" value={color} onChange={e=>setColor(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Size:
            <input type="text" value={size} onChange={e=>setSize(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Description:
            <input type="text" value={describe} onChange={e=>setDescribe(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Quantity:
            <input type="number" value={quantity} onChange={e=>setQuantity(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Contact Info:
            <input type="text" value={contact} onChange={e=>setContact(e.target.value)} />
          </label>
        </div>
        <input type="submit" value="Submit" />
      </form>
      </div>
      <div className="products">
      <h2>Products</h2>
      {products.map( product => (
        <div key={product.id} className="ticket">
          <div className="problem">
            <p>{product.color } {product.describe} {product.name}, size {product.size}: ${product.price}</p>
            <p>{product.quantity} available</p>
            <p><button onClick={e => addOneItem(product.name)}>Add to Cart</button>
            <button onClick={e => deleteProduct(product)}>Delete</button></p>
          </div>
        </div>
      ))}
      </div>
      <div className="cart">
      <h2>Cart</h2>
      {cart.map( item => (
        <div key={item.id} className="item">
          <div className="">
            <p>{item.quantity} {item.name}, total: ${item.total}</p>
            <p>CONTACT {item.contact}</p>
            <p><button onClick={e => putOneBack(item.id, (item.quantity - 1))}>-</button>
            <button onClick={e => addAnother(item.id, (item.quantity + 1))}>+</button>
            <button onClick={e => deleteItem(item)}>Delete</button></p>
          </div>
        </div>))}
      </div>
      </div>
      <div className="myImage">
        <img src={myImage} alt="clothes rack" />
      </div>
      <div className="githubRepo">
      <a href="https://github.com/osession/Creative4">Olivia's github repo</a>
      </div>
    </div>
  );
}

export default App;

      // <div className="picture">
      //   <img src="clothes.jpg">clothing rack</img>
      // </div>