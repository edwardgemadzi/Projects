import React, {useState, useEffect} from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(()=>{
    fetch(`http://localhost:3001`)
    .then(response => response.json())
    .then(data => setProducts(data))
  },[])
  return (
    <div className="App">
      <h1>Product List</h1>
      <ul>
        {products.map(product=>(
          <li key={product.id}>
            ${product.name} - ${product.price}
          </li>
        ))
        }
      </ul>
    </div>
  );
}

export default App;
