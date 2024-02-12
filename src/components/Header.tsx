import React from "react";
import { ConnectButton } from "web3uikit";

const Header = () => {
  return (
    <div className="z-20 relative flex justify-between items-center p-4">
      <div className="text-5xl font-extrabold">Decentralized Lottery</div>
      <div>
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
};

export default Header;
