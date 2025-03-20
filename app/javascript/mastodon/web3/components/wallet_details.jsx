import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import { useWeb3 } from '../Web3Provider';

const WalletDetails = ({ account }) => {
  const { checkIsSigned } = useWeb3();
  const [isSigned, setIsSigned] = useState(false);

  useEffect(() => {
    const verifySignature = async () => {
      const signed = await checkIsSigned();
      setIsSigned(signed);
    };
    if (account) {
      verifySignature();
    }
  }, [account, checkIsSigned]);

  if (!account) {
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
        }}>
          {account}
        </p>
        {isSigned ? <p style={{ color: 'green' }}><b>Signed</b></p> : <p style={{ color: 'red' }}><b>Not signed</b></p>}
        {/* <p>Network: {network ? network.name : 'Unknown'}</p> */}
      </div>
    );
  }
};

WalletDetails.propTypes = {
  account: PropTypes.string,
};

export default WalletDetails;
