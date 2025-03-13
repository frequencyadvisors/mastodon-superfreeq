import PropTypes from 'prop-types';
import React, { createContext, useContext, useState, useEffect } from 'react';

import { ethers } from 'ethers';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(ethProvider);

      // Check for the user's account
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts) => {
          if (accounts[0]) setAccount(accounts[0]);
        })
        .catch((error) => {
          console.error('Error fetching accounts:', error);
        });

      // Check network
      ethProvider.getNetwork()
        .then((net) => setNetwork(net))
        .catch((error) => {
          console.error('Error fetching network:', error);
        });
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = async () => {
    try {


      if (window.ethereum) {
        // Attempt to disconnect using MetaMask's remove method if supported (not widely available)
        if (window.ethereum.request) {
          await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }],
          });
        }

        // Listen for account changes and check if there are no accounts left
        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length === 0) {
            setAccount(null);
            setNetwork(null);
            alert("Disconnected from MetaMask.");
          }
        });
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };



  return (
    <Web3Context.Provider value={{ provider, account, network, connectWallet, disconnectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};
Web3Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useWeb3 = () => useContext(Web3Context);
