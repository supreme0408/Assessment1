import React, { useState, useEffect } from 'react';
import ShoppingCart from './ShoppingCart';
import abi from './contract/abi.json';
const {Web3} = require('web3');
const { ethereum } = window;
const FlowerCard = ({ flower, addToCart, isAddedToCart }) => {
  return (
    <div className="card">
      <img src={flower.image} alt={flower.name} />
      <p>{flower.name}</p>
      <p>{flower.price} SepoliaETH</p>
      <button style={!isAddedToCart?{backgroundColor:'blue'}:{backgroundColor:'grey'}} onClick={() => addToCart(flower)} disabled={isAddedToCart}> {isAddedToCart ? 'Added to Cart' : 'Add to Cart'}</button>
    </div>
  );
};

const FlowerMarketplace = () => {
  const initialFlowers = [
    { id: 1, name: 'Rose', image: 'https://t4.ftcdn.net/jpg/05/57/29/25/360_F_557292539_2kXYz0frOcCGISoYEd2MNTmxyT0lYyOj.jpg',price:0.001 },
    { id: 2, name: 'Sunflower', image: 'https://cdn.pixabay.com/photo/2016/08/28/23/24/sunflower-1627193_640.jpg',price:0.002 },
    { id: 3, name: 'Lotus', image: 'https://hips.hearstapps.com/hmg-prod/images/water-lilies-lake-france-royalty-free-image-1699382596.jpg?crop=0.65995xw:1xh;center,top&resize=640:*',price:0.003 },
    { id: 4, name: 'Lily', image: 'https://cdn.pixabay.com/photo/2018/10/21/19/23/flower-3763573_640.jpg',price:0.004 },
    { id: 5, name: 'Marigold', image: 'https://images.unsplash.com/photo-1620005807545-2e08850d6591?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFyaWdvbGQlMjBmbG93ZXJ8ZW58MHx8MHx8fDA%3D',price:0.005 },
    { id: 6, name: 'Tulip', image: 'https://cdn.pixabay.com/photo/2018/04/29/12/48/tulips-3359902_640.jpg',price:0.006},
    { id: 7, name: 'Daisy', image: 'https://cdn.shopify.com/s/files/1/0065/4999/5573/files/white_daisies_1024x1024.jpg?v=1667886750',price:0.007 },
    { id: 8, name: 'Hibiscus', image: 'https://wildflowerplantstation.com/wp-content/uploads/2021/06/Desi-Hibiscus-Flower.jpg',price:0.008 }
  ];
  const [flowers, setFlowers] = useState(initialFlowers);
  const [cart, setCart] = useState([]);
  const [addedFlowerIds, setAddedFlowerIds] = useState([]);

  // const web3 = new Web3('https://sepolia.infura.io/v3/12c141ce9c4a43789a8af8d20cb26e78');
  const web3 = new Web3(window.ethereum)
  const [currentAddress, setCurrentAddress] = useState('');
  const [isConnect, setConnected] = useState(0);
  const [contract, setContract] = useState({});

  const addToCart = (flower) => {
    setCart([...cart, flower]);
    setAddedFlowerIds([...addedFlowerIds, flower.id]);
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

  const checkConnection = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${Number(11155111).toString(16)}` }],
        jsonrpc: '2.0',
      });
    } catch (error) {
      console.log(error);
      if (error.code === -32002) {
        alert("Open Metamask");
      }
    }
  };

  const handleChainChanged = (chainId) => {
    // If the chain is changed to goerli network, don<t do anything.
    if (chainId === `0x${Number(11155111).toString(16)}`) return; // chain id is received in hexadecimal

    // chain is changed to any other network, reload the page.
    // On reload, checkConnection will run due to useEffect.
    // Inside of that function, we are asking user to switch to goerli network.
    window.location.reload();
  };

  const handleDisconnect = (accounts) => {
    if (accounts.length === 0) {
      setCurrentAddress("");
      setConnected(0);
    } else {
      setCurrentAddress(accounts[0]);
      setConnected(1);
    }
    window.location.reload();
  };

  const walletConnect = async () => {
    try {
      if (ethereum) {

        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setCurrentAddress(accounts[0]);
        setConnected(1);
      }
    } catch (error) {
      console.log(error);
    }
    console.log("Current Address: ", currentAddress);
  }

  function trimAddr(addr) {
    if (addr != null) {
      let addr1 = addr.toUpperCase();
      return ("✅" + addr1.substring(0, 4) + "xxxx" + addr1.substring(37));
    }
  }

  const getContract = async() =>{
    if(web3 != null){
      const contractAddress = '0x992f11179fd262dbef162d3d872349c3799b48de';
      const contractABI = abi;
      const cs = new web3.eth.Contract(contractABI,contractAddress);
      setContract(cs);
      
      // console.log(cs);
    }
    else{
      console.error("error fetching contract");
    }
  };


  useEffect(() => {
    if (!window.ethereum) {
      console.log("*****ERROR*****");
      return;
    }
    checkConnection();
    if(web3!=null){
     getContract();
    }

    // After connecting wallet
    // In metamask, you can either change the active account(user), or change the active network (goerli, mumbai, kovan, etc.)
    ethereum.on("chainChanged", handleChainChanged);
    ethereum.on("accountsChanged", handleDisconnect);
    // Cleanup of listener on unmount
    return () => {
      ethereum.removeListener("chainChanged", handleChainChanged);
      ethereum.removeListener("accountsChanged", handleDisconnect);
    };

  }, [isConnect]);
  return (
    <div>
      <div className="navbar">
      <div className="navbar-title">Flower Marketplace</div>
      {!isConnect?<button className="navbar-button" onClick={walletConnect}>Connect Wallet</button>: <p>{trimAddr(currentAddress)}</p>}
      
    </div>
      <h1>Flower Marketplace</h1>
      <div className='container1'>
      <div className="flower-cards">
        {flowers.map((flower) => (
          <FlowerCard key={flower.id} flower={flower} addToCart={addToCart} isAddedToCart={addedFlowerIds.includes(flower.id)} />
        ))}
      </div>
      <div className="card shopping-cart-container">
      <ShoppingCart cart={cart} removeFromCart={removeFromCart} checkout={checkout} web3={web3} currentAddress={currentAddress} contract={contract} />
      </div>
      </div>
    </div>
  );
};

export default FlowerMarketplace;
