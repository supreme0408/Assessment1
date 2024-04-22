export default function ShoppingCart({ cart, removeFromCart, checkout }) {
    const totalPrice = cart.reduce((total, flower) => total + flower.price, 0);
  
    return (
      <div className="shopping-cart">
        <h2>Shopping Cart</h2>
        <ul>
          {cart.map((flower) => (
            <li key={flower.id}>
              {flower.name} - ${flower.price}{' '}
              <button onClick={() => removeFromCart(flower)}>Remove</button>
            </li>
          ))}
        </ul>
        <p>Total Price: Rs.{totalPrice}</p>
        <button onClick={checkout}>Pay</button>
      </div>
    );
  };