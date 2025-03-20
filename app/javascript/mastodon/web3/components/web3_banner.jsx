import React, { useState, useEffect, useCallback } from 'react';

import { useWeb3 } from '../Web3Provider';

import WalletButton from './wallet_button';
import WalletDetails from './wallet_details';

const Web3BannerComponent = () => {
  const { account: accountFromWeb3 } = useWeb3();
  const [account, setAccount] = useState(accountFromWeb3);
  const [isActionsVisible, setIsActionsVisible] = useState(false);

  useEffect(() => {
    setAccount(accountFromWeb3);
  }, [accountFromWeb3]);

  const toggleActionsVisibility = useCallback(() => {
    setIsActionsVisible(prevState => !prevState);
  }, []);

  return (
    <div className='sign-in-banner'>
      {/* Show button to connect wallet or display status */}
      <WalletButton account={account} setAccount={setAccount} />
      <br />

      <button
        onClick={toggleActionsVisibility}
        style={{
          width: '130px',
          display: 'flex',
          justifyContent: 'space-between',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#858afa',
        }}
      >
        {isActionsVisible ? "Hide Details ⌃" : "More..."}
      </button>

      {/* Display wallet details only if connected */}
      {isActionsVisible && (
        account ? 
          <>
            <WalletDetails account={account} />
            <p>A place for additional info and/or other Web3 features.</p>
          </>
          :
          <p style={{ color: 'gray', marginTop: '20px' }}>Please connect your wallet to continue.</p>
      )}
    </div>
  );
};

export default Web3BannerComponent;
