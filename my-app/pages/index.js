import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { Contract, providers, utils} from "ethers";
import { useEffect, useRef, useState } from "react";
import { BUY_ME_A_COFFEE_CONTRACT_ADDRESS, abi } from "../Constants";

export default function Home() {
  
   // Component state
   const [walletConnected, setWalletConnected] = useState(false);
   const [name, setName] = useState("");
   const [message, setMessage] = useState("");
   const [memos, setMemos] = useState([]);
 
   const onNameChange = (event) => {
     setName(event.target.value);
   }
 
   const onMessageChange = (event) => {
     setMessage(event.target.value);
   }
 

  console.log(memos);

  //Connect to Metamask
  
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };



  //Read-only functions
  const getMemos= async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // No need for the Signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
    
      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const buyMeAcoffeeContract = new Contract(
        BUY_ME_A_COFFEE_CONTRACT_ADDRESS,
        abi,
        provider
      );

      console.log("fetching memos from the blockchain..");
      // call the getMemos from the contract
      const _getMemos = await buyMeAcoffeeContract.getMemos(); 
      
      console.log("fetched!");
      //List of all array elements
      console.log("From contract ",_getMemos);
      //Storing the Newest 1st or Reverse order of the array
      setMemos(_getMemos.concat().reverse());
      console.log("From JSX ",memos);
    } 
    
    catch (err) {
      console.error(err);
    }
  };

 //Call the getMemos function 
 //console.log(getMemos);


  //Write-Only functions
  const buyCoffee = async () => {
    try {
      // We will need the signer later to get the user's address
      // Even though it is a read transaction, since Signers are just special kinds of Providers,
      // We can use it in it's place
      const signer = await getProviderOrSigner(true);
      const  buyMeAcoffeeContract = new Contract(
        BUY_ME_A_COFFEE_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // Get the address associated to the signer which is connected to  MetaMask
      const address = await signer.getAddress();
      // call the buyCoffee from the contract
      const _buyCoffee = await buyMeAcoffeeContract.buyCoffee(
        name ? name : "John Doe",
        message ? message : "Enjoy your coffee!",
        {value: utils.parseEther("0.001")}
      );
      
      await _buyCoffee.wait();

      console.log("mined ", _buyCoffee.hash);
      console.log("coffee purchased !");
      console.log(memos);
      // Clear the form fields.
      setName("");
      setMessage("");

    } catch (err) {
      console.error(err);
    }
  };


  //Check wallet is connected or not
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    console.log(walletConnected);
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
     // connectWallet();
    }
  },[walletConnected]);
  
  return (
    <div className={styles.container}>
    <Head>
      <title>Buy Rajendra a Coffee!</title>
      <meta name="description" content="Tipping site" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    
<main className={styles.main}>
  <h1 className={styles.title}>
        Buy Rajendra a Coffee!☕
  </h1>
  <br/>  
{ walletConnected ? (
<div>
  <form>
  <div className="row">
    <div className="col">
    <label>Name</label>
      <input type="text" className="form-control"  id="name" placeholder="John Doe" onChange={onNameChange}/>
    </div>
    <br/><br/><br/>
    <div>
      <label>Send Rajendra a message</label>
       <textarea rows={3} className="form-control" placeholder="Enjoy your coffee!" id="message" onChange={onMessageChange} required>
       </textarea>
    </div>
    <br/><br/><br/><br/><br/><br/>
        {/* type is button here(important) since not submitting the inputs */}
    <button type="button" className="btn btn-primary mb-2" onClick={buyCoffee}>Send 1 Coffee for 0.001ETH</button>
    <button type="button" className="btn btn-primary mb-2" onClick={getMemos}>Get Memos</button>
  </div>
</form>
</div>
) : 
(<button type="button" className="btn btn-primary mb-2" onClick={connectWallet}> Connect your wallet </button>)}
</main> 

{walletConnected && (<h1>Memos received</h1>)}

{/* This won't run untill you call getMemos() function (from "Get Memos" button) 
    since after each reload "memos" state becomes empty 
    so by calling getMemos() we  set the "setMemos" state
*/}

 {walletConnected && (memos.map((memo, idx) => {
  return(
   <div key={idx} style={{border:"2px solid", "borderRadius":"5px", padding: "5px", margin: "5px"}}> 
     <h1 style={{"fontWeight":"bold"}}>"{memo.message}"</h1>
     <p>From: {memo.name} at {new Intl.DateTimeFormat
     ('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
     .format(memo.timestamp)}</p>
   </div>)}))}

  <footer className={styles.footer}>
    <a href="https://alchemy.com/?a=roadtoweb3weektwo" target="_blank" rel="noopener noreferrer">
     Inspired from @thatguyintech for Alchemy's Road to Web3 lesson two!
    </a>
  </footer> 
  </div>
  )
}
