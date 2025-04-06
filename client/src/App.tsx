/* eslint-disable @typescript-eslint/no-explicit-any */

import { ethers } from "ethers";
import { useState } from "react";
import { GREETER_ABI, GREETER_ADDRESS } from "./greeter";

function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string>("");
  const [newGreeting, setNewGreeting] = useState<string>("");
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const connectWallet = async () => {
    if (!(window as any).ethereum) {
      alert("MetaMask not found");
      return;
    }

    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(
      GREETER_ADDRESS,
      GREETER_ABI,
      signer,
    );

    setWalletAddress(accounts[0]);
    setContract(contractInstance);
    console.log("Wallet connected:", accounts[0]);
  };

  const fetchGreeting = async () => {
    if (!contract) return;
    const currentGreeting = await contract.getGreeting();
    setGreeting(currentGreeting);
    console.log("Current greeting:", currentGreeting);
  };

  const updateGreeting = async () => {
    if (!contract || !newGreeting) return;
    const tx = await contract.setGreeting(newGreeting);
    await tx.wait();
    setNewGreeting("");
    fetchGreeting(); // update after transaction confirms
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Greeter dApp</h1>

      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Wallet: {walletAddress}</p>
      )}

      <hr style={{ margin: "1rem 0" }} />

      <button onClick={fetchGreeting} disabled={!contract}>
        Fetch Greeting
      </button>
      <p>Current Greeting: {greeting || "(not loaded)"}</p>

      <div style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="New greeting"
          value={newGreeting}
          onChange={(e) => setNewGreeting(e.target.value)}
        />
        <button onClick={updateGreeting} disabled={!newGreeting || !contract}>
          Update Greeting
        </button>
      </div>
    </div>
  );
}

export default App;
