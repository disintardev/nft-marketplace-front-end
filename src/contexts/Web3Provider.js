import React, { createContext, useContext, useEffect, useState } from "react";

import {
  getWeb3Provider,
  getAccountSigner,
  getMetamaskProvider,
  addMetamaskListeners,
  connectToMetamask,
  getTokenContract,
  getERC1155Contract,
  getNFTMarketPlaceContract,
} from "../apis/blockchain";

export const Context = createContext();

const Web3Provider = ({ children }) => {
  const [currentAccountAddress, setCurrentAccountAddress] = useState("");
  const [web3, setWeb3] = useState({
    initialized: false,

    metamaskProvider: null,
    web3Provider: null,

    networkId: 1,

    tokenContract: null,
    erc1155Contract: null,
    nftMarketPlaceContract: null,
  });

  const metamaskSetup = async () => {
    try {
      let metamaskProvider = await getMetamaskProvider();

      await connectToMetamask(metamaskProvider);

      let web3Provider = await getWeb3Provider(metamaskProvider);
      console.log(web3Provider);
      let contract = await getTokenContract(web3Provider);
      console.log(contract);

      if (metamaskProvider && web3Provider) {
        addMetamaskListeners(
          metamaskProvider,
          async (chainId) => {
            setWeb3({
              ...web3,
              networkId: parseInt(chainId),
            });
          },
          (message) => {},
          async (accounts) => {
            if (accounts.length === 0) {
              setCurrentAccountAddress("");
            } else if (accounts[0] !== currentAccountAddress) {
              setCurrentAccountAddress(accounts[0]);
              console.log("account", accounts[0]);
            }
          }
        );

        let currentAccountAddress;
        try {
          currentAccountAddress = await (
            await getAccountSigner(web3Provider)
          ).getAddress();
        } catch (error) {
          currentAccountAddress = "";
        }

        setCurrentAccountAddress(currentAccountAddress);
        setWeb3({
          ...web3,
          initialized: true,
          metamaskProvider,
          web3Provider,
          networkId: 1,
          tokenContract: await getTokenContract(web3Provider),
          erc1155Contract: await getERC1155Contract(web3Provider),
          nftMarketPlaceContract: await getNFTMarketPlaceContract(web3Provider),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Context.Provider
      value={{
        web3,
        currentAccountAddress,
        metamaskSetup,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Web3Provider;
