import React, { useEffect, useState } from "react";
import { abi, contractAddresses, networkNames } from "../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ethers, ContractTransaction } from "ethers";
import { useNotification } from "web3uikit";

interface contractAddressesInterface {
  [key: string]: string[];
}

interface networkNameInterface {
  [key: string]: string[];
}

const LotteryEntrance = () => {
  const addresses: contractAddressesInterface = contractAddresses;
  const networkName: networkNameInterface = networkNames;
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex!).toString();
  const raffleAddress =
    chainId in addresses
      ? addresses[chainId][0]
      : "0x99d393894600fd4869613FFD97b68d8380e85787";
  const currentNetworkName = chainId in networkName ? networkName[chainId][0] : "Sepolia";
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");

  const dispatch = useNotification();

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  async function updateUI() {
    const entranceFeeFromCall = ((await getEntranceFee()) as BigInt).toString();
    const numPlayersFromCall = ((await getNumberOfPlayers()) as BigInt).toString();
    const recentWinnerFromCall = (await getRecentWinner()) as string;

    setEntranceFee(entranceFeeFromCall);
    setNumPlayers(numPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async (tx: ContractTransaction) => {
    await tx.wait(1);
    handleNewNotification();
    updateUI();
  };

  const handleConnectWallet = () => {
    dispatch({
      type: "error",
      message: "Connect Metamask!",
      title: "Error",
      position: "topR",
      icon: "bell",
    });
  };

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    });
  };

  return (
    <div className={`py-5 px-4 ${isWeb3Enabled && "relative z-20"}`}>
      <div>
        <div className="flex">
          <button
            className="p-2 rounded font-medium text-lg text-white bg-orange-500 hover:bg-orange-400 duration-300"
            onClick={async () => {
              if (!isWeb3Enabled) {
                handleConnectWallet();
              }
              await enterRaffle({
                onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                onError: (error) => console.log(error),
              });
            }}
          >
            Enter Raffle
          </button>
          {currentNetworkName === "Sepolia" && (
            <a
              href="https://sepolia.etherscan.io/address/0x99d393894600fd4869613ffd97b68d8380e85787#events"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 p-2 rounded font-medium text-lg text-white bg-orange-500 hover:bg-orange-400 duration-300"
            >
              Show Events
            </a>
          )}
        </div>
        <div className="pt-4 text-lg">
          <div className="border border-orange-300 p-2 w-max rounded-md shadow-[0_10px_10px_-6px_rgba(255,255,255,0.25)] bg-[rgba(0,0,100,0.4)]">
            <div>EntranceFee: {ethers.utils.formatEther(entranceFee)} ETH</div>
            <div>Number Of Players: {numPlayers}</div>
            <div>Recent Winner: {recentWinner}</div>
          </div>
        </div>
        <div className="pt-4 text-lg">
          <div className="border border-orange-300 p-2 w-max rounded-md shadow-[0_10px_10px_-6px_rgba(255,255,255,0.25)] bg-[rgba(0,0,100,0.4)]">
            {currentNetworkName && <div>Testnet: {currentNetworkName}</div>}
            <div>Contract Address: {raffleAddress}</div>
          </div>
        </div>
      </div>

      {!raffleAddress && <div>Please Connect with Metamask!</div>}
    </div>
  );
};

export default LotteryEntrance;
