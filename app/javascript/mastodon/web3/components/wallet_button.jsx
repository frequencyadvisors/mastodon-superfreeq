/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import { useWeb3 } from '../Web3Provider';

const berachainParams = {
  chainId: '0x138C5',
  chainName: 'Berachain Bepolia',
  nativeCurrency: {
    name: 'BERA',
    symbol: 'BERA',
    decimals: 18,
  },
  rpcUrls: ['https://bepolia.rpc.berachain.com/'],
  blockExplorerUrls: ['https://bepolia.beratrail.io/'],
};

const WalletButton = ({ account, setAccount }) => {
  const { connectWallet, handleSignMessage, checkIsSigned } = useWeb3();
  const [isBerachain, setIsBerachain] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  // Updating state when account changes or when disconnected
  useEffect(() => {
    const verifySignature = async () => {
      const signed = await checkIsSigned();
      setIsSigned(signed);
    };

    if (account) {
      verifySignature();
    }

    if (window.ethereum) {
      // Listening for account changes (disconnection or switch)
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setAccount(null); // Wallet disconnected
        } else {
          setAccount(accounts[0]); // Set new account
        }
      });

      // Checking current chain when component mounts
      window.ethereum.request({ method: 'eth_chainId' })
        .then((chainId) => {
          console.log('Current chain ID:', chainId);
          setIsBerachain(chainId.toLowerCase() === berachainParams.chainId.toLowerCase());
        })
        .catch((error) => {
          console.error('Error fetching chain ID:', error);
        });

      // Listening for chain changes
      window.ethereum.on('chainChanged', (chainId) => {
        setIsBerachain(chainId.toLowerCase() === berachainParams.chainId.toLowerCase());
      });
    }
  }, [account, checkIsSigned, setAccount]);

  const handleSwitchNetwork = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed.');
      return;
    }

    try {
      // If the wallet is not connected, connect it first
      if (!account) {
        await connectWallet();
      }

      // Switch network or add Berachain
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: berachainParams.chainId }],
        });
      } catch (error) {
        if (error.code === 4902) {
          // Chain not added, prompt user to add it
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [berachainParams],
          });
        } else {
          console.error('Error switching network:', error);
        }
      }
    } catch (error) {
      console.error('Error connecting wallet or switching network:', error);
    }
  };

  const getButtonLabel = () => {
    if (!account) {
      return 'Connect Wallet';
    }

    if (!isBerachain) {
      return 'Switch to Berachain Bepolia';
    }

    return 'Connected to Berachain Bepolia';
  };

  return (
    <div>
      <button onClick={handleSwitchNetwork} className='button button--block button-tertiary'>
        {getButtonLabel()}
      </button>
      {account && !isSigned && (
        <button onClick={handleSignMessage} className='button button--block button-tertiary'>
          Sign Message to Log In
        </button>
      )}
    </div>
  );
};

WalletButton.propTypes = {
  account: PropTypes.string,
  setAccount: PropTypes.func.isRequired,
};

export default WalletButton;
