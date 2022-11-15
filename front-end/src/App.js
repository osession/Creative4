import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // setup state
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cart, setCart] = useState([]);

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
      await axios.post("/api/products", {name: name, price: price});
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
    setPrice("");
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
      <div className="create">
      <h1>Create a Product</h1>
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
            <textarea value={price} onChange={e=>setPrice(e.target.value)}></textarea>
          </label>
        </div>
        <input type="submit" value="Submit" />
      </form>
      </div>
      <div className="products">
      <h1>Products</h1>
      {products.map( product => (
        <div key={product.id} className="ticket">
          <div className="problem">
            <p>{product.name}, {product.price}</p>
            <p><button onClick={e => addOneItem(product.name)}>Add to Cart</button>
            <button onClick={e => deleteProduct(product)}>Delete</button></p>
          </div>
        </div>
      ))}
      </div>
      <div className="cart">
      <h1>Cart</h1>
      {cart.map( item => (
        <div key={item.id} className="item">
          <div className="">
            <p>{item.name}, {item.quantity}</p>
            <p><button onClick={e => putOneBack(item.id, (item.quantity - 1))}>-</button>
            <button onClick={e => addAnother(item.id, (item.quantity + 1))}>+</button>
            <button onClick={e => deleteItem(item)}>Delete</button></p>
          </div>
        </div>))}
      </div>
      <div className="githubRepo">
      <a href="https://github.com/osession/Creative4">Olivia's github repo</a>
      </div>
    </div>
  );
}

export default App;

