import React, { useContext, useEffect, useState } from "react";
import styles from "./styles.css";
import { Box, Button, Modal, Fade } from "@material-ui/core";
import { Context as _web3Context } from "../contexts/Web3Provider";
import { ethers } from "ethers";

const Home = () => {
  let web3Context = useContext(_web3Context);
  console.log("web3Context", web3Context);

  const [state, setState] = useState({
    balance: "0",
    currentNFTID: "0",
    numListings: "0",
    listingData: [],
    nftBalances: [],
  });

  // setting up states
  const setupStates = async () => {
    try {
      const balance = await web3Context.web3.tokenContract.balanceOf(
        web3Context.currentAccountAddress
      );

      let currentNFTID = await web3Context.web3.erc1155Contract.nextTokenId();
      currentNFTID = currentNFTID - 1;

      let nftBalances = [];

      for (let i = 0; i <= currentNFTID; i++) {
        const nftBalance = await web3Context.web3.erc1155Contract.balanceOf(
          web3Context.currentAccountAddress,
          i
        );
        let balanceData = {
          id: i,
          balance: nftBalance
        }
        nftBalances.push(balanceData);
      }

      const numListings = await web3Context.web3.nftMarketPlaceContract.getNumListings();

      let listingData = [];

      for (let i = 0; i < numListings; i++) {
        let listingInfo = await web3Context.web3.nftMarketPlaceContract.listings(
          i
        );
        let listing = {
          seller: listingInfo.seller,
          label: listingInfo.label,
          description: listingInfo.description,
          tokenAddress: listingInfo.tokenAddress,
          tokenId: listingInfo.tokenId,
          numTokens: listingInfo.numTokens,
          price: listingInfo.price,
          id: i,
        };
        listingData.push(listing);
      }

      setState({
        ...state,
        balance,
        currentNFTID,
        numListings,
        listingData,
        nftBalances,
      });
      console.log(state);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (web3Context.web3.tokenContract != null) {
      setupStates();
    }
  }, [web3Context]);

  const [currentListing, setCurrentListing] = useState(0);

  const handleMint = async () => {
    if (web3Context.web3.tokenContract == null) {
      alert("You are not connected. Connect and try again.");
      return;
    }
    try {
      let mintTx = await web3Context.web3.tokenContract.mint(
        ethers.utils.parseEther("1000")
      );
      await mintTx.wait();
    } catch (error) {
      console.log(error);
      return;
    }
    alert("Successfully minted 1000 Mok");
  };

  const handleNFTMint = async () => {
    if (web3Context.web3.tokenContract == null) {
      alert("You are not connected. Connect and try again.");
      return;
    }
    try {
      let NFTMintTx = await web3Context.web3.erc1155Contract.mintToken(
        web3Context.currentAccountAddress,
        1,
        [],
        "testURI"
      );
      await NFTMintTx.wait();
    } catch (error) {
      console.log(error);
      return;
    }
    alert("Successfully minted 1 NFT.");
  };

  const handleSell = async () => {
    if (web3Context.web3.tokenContract == null) {
      alert("You are not connected. Connect and try again.");
      return;
    }
    try {
      let approved = await web3Context.web3.erc1155Contract.isApprovedForAll(
        web3Context.currentAccountAddress,
        web3Context.web3.nftMarketPlaceContract.address
      );

      if (!approved) {
        let approveTx = await web3Context.web3.erc1155Contract.setApprovalForAll(
          web3Context.web3.nftMarketPlaceContract.address,
          true
        );
        await approveTx.wait();
      }
      let listTx = await web3Context.web3.nftMarketPlaceContract.listTokens(
        "Mok NFT",
        "Our Mok NFT",
        web3Context.web3.erc1155Contract.address,
        state.currentNFTID,
        1,
        ethers.utils.parseEther("1000"),
        true
      );
      await listTx.wait();
    } catch (error) {
      console.log(error);
      return;
    }
    alert("Successfully Listed NFT.");
  };

  const handleBuy = async (id) => {
    if (web3Context.web3.tokenContract == null) {
      alert("You are not connected. Connect and try again.");
      return;
    }
    try {
      let allowance = await web3Context.web3.tokenContract.allowance(
        web3Context.currentAccountAddress,
        web3Context.web3.nftMarketPlaceContract.address
      );

      if (allowance < ethers.utils.parseEther("1000")) {
        let approveTx = await web3Context.web3.tokenContract.approve(
          web3Context.web3.nftMarketPlaceContract.address,
          ethers.utils.parseEther("10000000000000000000")
        );
        await approveTx.wait();
      }
      let listingId = await web3Context.web3.nftMarketPlaceContract.getListingIds(
        currentListing
      );
      let buyTx = await web3Context.web3.nftMarketPlaceContract.buyTokens(
        listingId,
        1
      );
      await buyTx.wait();
    } catch (error) {
      console.log(error);
      return;
    }
    alert("Successfully Bought NFT.");
  };

  const handleMetamaskConnect = async () => {
    await web3Context.metamaskSetup();
  };

  let listingData = state.listingData;
  let nftBalances = state.nftBalances;

  return (
    <Box className="container">
      <button onClick={handleMetamaskConnect}>
        {web3Context.currentAccountAddress !== "" &&
        web3Context.currentAccountAddress !== undefined
          ? web3Context.currentAccountAddress.slice(0, 10) + "..."
          : "Connect Wallet"}
      </button>
      <button onClick={handleMint}>Mint 1000 MOK Tokens</button>
      <button onClick={handleNFTMint}>Mint 1 NFT</button>
      <button onClick={handleSell}>List most recent NFT for 1000 Mok</button>
      <span>Token Balance: {ethers.utils.formatEther(state.balance)}</span>
      {nftBalances.map((nftBalance) => {
          return (
            <Box>
              <span> NFT Balance {nftBalance.id}: {nftBalance.balance.toString()}</span>
            </Box>
          );
        })}

      <h1>Listings</h1>
      <Box className="listingContainer">
        {listingData.map((listing) => {
          return (
            <Box className="listing">
              <h2>NFT {listing.id}</h2>
              <p>Seller: {listing.seller}</p>
              <p>Label: {listing.label}</p>
              <p>Description: {listing.description}</p>
              <p>Token Address: {listing.tokenAddress}</p>
              <p>Token Id: {listing.tokenId.toString()}</p>
              <p>
                Price: {ethers.utils.formatEther(listing.price).toString()} Mok
              </p>
              <button
                onClick={() => {
                  setCurrentListing(listing.id);
                  handleBuy();
                }}
              >
                Buy
              </button>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Home;
