import React, { useState } from 'react';
import ShoppingCart from './ShoppingCart';
const FlowerCard = ({ flower, addToCart, isAddedToCart }) => {
  return (
    <div className="card">
      <img src={flower.image} alt={flower.name} />
      <p>{flower.name}</p>
      <p>Rs.{flower.price}</p>
      <button style={!isAddedToCart?{backgroundColor:'blue'}:{backgroundColor:'grey'}} onClick={() => addToCart(flower)} disabled={isAddedToCart}> {isAddedToCart ? 'Added to Cart' : 'Add to Cart'}</button>
    </div>
  );
};

const FlowerMarketplace = () => {
  const initialFlowers = [
    { id: 1, name: 'Rose', image: 'https://t4.ftcdn.net/jpg/05/57/29/25/360_F_557292539_2kXYz0frOcCGISoYEd2MNTmxyT0lYyOj.jpg',price:100 },
    { id: 2, name: 'Sunflower', image: 'https://cdn.pixabay.com/photo/2016/08/28/23/24/sunflower-1627193_640.jpg',price:200 },
    { id: 3, name: 'Lotus', image: 'https://hips.hearstapps.com/hmg-prod/images/water-lilies-lake-france-royalty-free-image-1699382596.jpg?crop=0.65995xw:1xh;center,top&resize=640:*',price:300 },
    { id: 4, name: 'Lily', image: 'https://cdn.pixabay.com/photo/2018/10/21/19/23/flower-3763573_640.jpg',price:400 },
    { id: 5, name: 'Marigold', image: 'https://images.unsplash.com/photo-1620005807545-2e08850d6591?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFyaWdvbGQlMjBmbG93ZXJ8ZW58MHx8MHx8fDA%3D',price:500 },
    { id: 6, name: 'Tulip', image: 'https://cdn.pixabay.com/photo/2018/04/29/12/48/tulips-3359902_640.jpg',price:600},
    { id: 7, name: 'Daisy', image: 'https://cdn.shopify.com/s/files/1/0065/4999/5573/files/white_daisies_1024x1024.jpg?v=1667886750',price:700 },
    { id: 8, name: 'Hibiscus', image: 'https://wildflowerplantstation.com/wp-content/uploads/2021/06/Desi-Hibiscus-Flower.jpg',price:800 }
  ];
  const [flowers, setFlowers] = useState(initialFlowers);
  const [cart, setCart] = useState([]);
  const [addedFlowerIds, setAddedFlowerIds] = useState([]);

  const addToCart = (flower) => {
    setCart([...cart, flower]);
    setAddedFlowerIds([...addedFlowerIds, flower.id]);
    alert("Add Success. See cart below.")
    window.scrollTo(0, document.body.scrollHeight);
  };

  const removeFromCart = (flowerToRemove) => {
    setCart(cart.filter((flower) => flower.id !== flowerToRemove.id));
    setAddedFlowerIds(addedFlowerIds.filter((id) => id !== flowerToRemove.id));
  };

  const checkout = () => {
    const updatedFlowers = flowers.filter((flower) => !cart.find((item) => item.id === flower.id));
    setFlowers(updatedFlowers);

    setCart([]);
  };

  return (
    <div>
      <h1>Flower Marketplace</h1>
      <div className="flower-cards">
        {flowers.map((flower) => (
          <FlowerCard key={flower.id} flower={flower} addToCart={addToCart} isAddedToCart={addedFlowerIds.includes(flower.id)} />
        ))}
      </div>
      <div className="card shopping-cart-container">
      <ShoppingCart cart={cart} removeFromCart={removeFromCart} checkout={checkout} />
      </div>
    </div>
  );
};

export default FlowerMarketplace;
