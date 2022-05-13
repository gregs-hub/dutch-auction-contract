const hre = require("hardhat");

async function main() {
  // Get accounts
  const accounts = await hre.ethers.getSigners();
  // for (const account of accounts) {
  //   console.log(account.address);
  // }

  // Deploy NFT contract
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  await nft.deployed();
  console.log("NFT deployed to:", nft.address);

  // Interact with NFT contract
  console.log("Mint NFT with id 666");
  await nft.mint(accounts[0].address, 666);

  // Deploy DutchAuction contract
  const DutchAuction = await hre.ethers.getContractFactory("DutchAuction");
  const dutchAuction = await DutchAuction.deploy(
    5, // 5 minutes auction duration
    1000000000000000, // Original price in wei
    10000000000, // Discount rate in wei (every 1 second)
    nft.address, // NFT contract address
    666 // NFT Id
  );
  await dutchAuction.deployed();
  console.log("DutchAuction deployed to:", dutchAuction.address);

  // Interact with DutchAuction contract
  console.log("Approve the NFT Dutch auction");
  await nft.approve(dutchAuction.address, 666);

  async function pause() {
    let weiValue = await dutchAuction.getPrice();
    console.log(ethers.utils.formatUnits(weiValue, "ether"));
    await sleep(10000); // wait 10 seconds
    weiValue = await dutchAuction.getPrice();
    console.log(ethers.utils.formatUnits(weiValue, "ether"));
    await sleep(10000); // wait 10 seconds
    weiValue = await dutchAuction.getPrice();
    console.log(ethers.utils.formatUnits(weiValue, "ether"));
  }

  pause();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  // .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
