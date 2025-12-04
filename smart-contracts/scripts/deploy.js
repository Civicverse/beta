const hre = require("hardhat");

async function main() {
  const [deployer, signer1, signer2] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);

  // Deploy VoteToken
  const VoteToken = await hre.ethers.getContractFactory("VoteToken");
  const voteToken = await VoteToken.deploy();
  await voteToken.deployed();
  console.log("VoteToken deployed to:", voteToken.address);

  // Mint some tokens to deployer for testing
  await voteToken.mint(deployer.address, hre.ethers.utils.parseEther("10000"));
  await voteToken.mint(signer1.address, hre.ethers.utils.parseEther("5000"));
  await voteToken.mint(signer2.address, hre.ethers.utils.parseEther("5000"));

  // Deploy MultisigTreasury
  const MultisigTreasury = await hre.ethers.getContractFactory("MultisigTreasury");
  const multisig = await MultisigTreasury.deploy(
    [deployer.address, signer1.address, signer2.address],
    voteToken.address
  );
  await multisig.deployed();
  console.log("MultisigTreasury deployed to:", multisig.address);

  // Deploy QuadraticVoting
  const QuadraticVoting = await hre.ethers.getContractFactory("QuadraticVoting");
  const voting = await QuadraticVoting.deploy(voteToken.address);
  await voting.deployed();
  console.log("QuadraticVoting deployed to:", voting.address);

  // Save addresses for frontend
  const addresses = {
    voteToken: voteToken.address,
    multisig: multisig.address,
    quadraticVoting: voting.address,
    network: "localhost"
  };

  console.log("\nDeployed Addresses:");
  console.log(JSON.stringify(addresses, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
