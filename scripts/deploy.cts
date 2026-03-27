const { ethers } = require("hardhat");

async function main() {
  const ProfileRegistry = await ethers.getContractFactory("ProfileRegistry");
  const registry = await ProfileRegistry.deploy();
  await registry.waitForDeployment();
  const address = await registry.getAddress();
  console.log(`ProfileRegistry deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
