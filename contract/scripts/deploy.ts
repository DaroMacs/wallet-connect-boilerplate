import fs from "fs";
import hre, { ethers } from "hardhat";
import path from "path";

async function main() {
  const initialGreeting = "Hello from SepoliaHardhat";

  // Deploy the contract
  const Greeter = await ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy(initialGreeting);
  await greeter.waitForDeployment();

  const contractAddress = greeter.target;
  console.log("✅ Contract deployed at:", contractAddress);

  // Save ABI and address to a JSON file for the frontend
  const frontendData = {
    address: contractAddress,
    abi: (await hre.artifacts.readArtifact("Greeter")).abi,
  };

  const filePath = path.join(
    __dirname,
    "..",
    "artifacts-frontend",
    "Greeter.json",
  );
  fs.writeFileSync(filePath, JSON.stringify(frontendData, null, 2));
  console.log("📁 ABI and address saved to:", filePath);
}

main().catch((error) => {
  console.error("❌ Deployment error:", error);
  process.exitCode = 1;
});
