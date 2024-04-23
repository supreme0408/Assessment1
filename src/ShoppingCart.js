import { useState } from "react";

export default function ShoppingCart({ cart, removeFromCart, checkout, web3,currentAddress,contract}) {
    const totalPrice = cart.reduce((total, flower) => total + flower.price, 0).toFixed(4);
    const [inProcess,setInProcess] = useState(0);

    const MY_ACCOUNT='0xC18365cE7f23Ff0088f5639142D330A2787AdE23';
    const payToAccount=async()=>{
      try{
        setInProcess(1);
        if(currentAddress!==''){
        
        const amountToSend = web3.utils.toWei(totalPrice.toString(), 'ether');
        // console.log(amountToSend.toString());
  
        await contract.methods.transferTo(MY_ACCOUNT, amountToSend).send({ from: currentAddress, value: amountToSend})
        .on('transactionHash', function (hash) {
          console.log("Confirm transaction with hash ", hash);
        });
        console.log("Payment Successful");
        checkout();
        }
      }catch(error){
        console.error('Payment failed:', error);
      }
      setInProcess(0);
    }

    return (
      <div className="shopping-cart">
        <h2>Shopping Cart</h2>
        <ul className="flower-cart-list">
          {cart.map((flower) => (
            <li key={flower.id}>
              {flower.name} - {flower.price} SepoliaETH{' '}
              <button onClick={() => removeFromCart(flower)}>❌</button>
            </li>
          ))}
        </ul>
        <hr></hr>
        <p>Total Price: {totalPrice} SepoliaETH</p>
        <div  style={{display:'flex', flexDirection:'column',alignItems:'center'}}>
        {inProcess?<div id="loading"></div>:<span></span>}
        <button onClick={payToAccount} disabled={inProcess}>Pay</button>
        </div>
      </div>
    );
  };