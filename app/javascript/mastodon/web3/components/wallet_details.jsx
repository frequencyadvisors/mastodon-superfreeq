import React from 'react';

const WalletDetails = (account) => {

  console.log(account);

  if (!account.account) {
    return <><br /><p>Wallet not connected</p></>;
  } else {
    return (
      <div>
        <br />
        <p>
        Connected Wallet:
        </p>
        <p style={{
          color: '#darkgrey',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '250px',
          border: '1px solid #858afa',
          borderRadius: '15px',
          padding: '5px 15px',
          fontSize: '0,3rem',
        }}>
          {account.account}
        </p>
      </div>
    );
  }


};

export default WalletDetails;
