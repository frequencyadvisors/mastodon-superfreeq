/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react';

import { useWeb3 } from '../Web3Provider';


import WalletButton from './wallet_button';
import WalletDetails from './wallet_details';

const Web3BannerComponent = () => {

  const {
    account: accountFromWeb3,
  } = useWeb3();

  const [isActionsVisible, setIsActionsVisible] = useState(false);
  const [account, setAccount] = useState(accountFromWeb3);

  useEffect(() => {
    setAccount(accountFromWeb3);
  }, [accountFromWeb3]);

  const toggleActionsVisibility = () => {
    setIsActionsVisible(prevState => !prevState);
  };

  return (
    <div className='sign-in-banner'>
      <WalletButton {...{ account, setAccount }} />
      <br />

      <button onClick={toggleActionsVisibility}
        style={{ width: '130px', display: 'flex', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', color: '#858afa' }}>
        {isActionsVisible ? "Hide Details ⌃" : "More..."}
      </button>

      {isActionsVisible && (
        <>
          <WalletDetails account={account} />
          <p>A place for additional info and/or other Web3 features.</p>
        </>
      )}

    </div>
  );
};

export default Web3BannerComponent;
