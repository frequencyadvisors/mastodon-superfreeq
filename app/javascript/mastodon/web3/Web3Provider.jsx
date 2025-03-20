import PropTypes from 'prop-types';
import React, { createContext, useContext, useState, useEffect } from 'react';

import { ethers } from 'ethers';

const MESSAGE = 'Sign in to verify ownership';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [signature, setSignature] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(ethProvider);

      // Check for the user's account
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts) => {
          if (accounts[0]) setAccount(accounts[0]);
        })
        .catch((error) => console.error('Error fetching accounts:', error));

      // Check network
      ethProvider.getNetwork()
        .then((net) => setNetwork(net))
        .catch((error) => console.error('Error fetching network:', error));

      // Handle account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });
    }

    // Restore signature for the session
    const savedSignature = localStorage.getItem('signature');
    if (savedSignature) {
      setSignature(savedSignature);
      verifySignature(savedSignature);
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
    setAccount(null);
    setNetwork(null);
    setSignature(null);
    localStorage.removeItem('signature');
    console.log("Disconnected from MetaMask.");
  };

  const handleSignMessage = async () => {
    if (!provider || !account) {
      alert('Please connect your wallet first.');
      return null;
    }
    try {
      const signer = provider.getSigner();
      const userSignature = await signer.signMessage(MESSAGE);
      setSignature(userSignature);
      localStorage.setItem('signature', userSignature);
      verifySignature(userSignature);
      return userSignature;
    } catch (error) {
      console.error('Error signing message:', error);
      return null;
    }
  };

  const verifySignature = async (sig) => {
    if (!account || !sig) return;
    try {
      const recoveredAddress = ethers.utils.verifyMessage(MESSAGE, sig);
      if (recoveredAddress.toLowerCase() !== account.toLowerCase()) {
        setSignature(null);
        localStorage.removeItem('signature');
      }
    } catch (error) {
      console.error('Error verifying signature:', error);
      setSignature(null);
      localStorage.removeItem('signature');
    }
  };

  const checkIsSigned = async () => {
    if (!account || !signature) return false;
    try {
      const recoveredAddress = ethers.utils.verifyMessage(MESSAGE, signature);
      return recoveredAddress.toLowerCase() === account.toLowerCase();
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  };

  return (
    <Web3Context.Provider value={{ provider, account, network, signature, connectWallet, disconnectWallet, handleSignMessage, checkIsSigned }}>
      {children}
    </Web3Context.Provider>
  );
};

Web3Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useWeb3 = () => useContext(Web3Context);
