const hre = require("hardhat");

async function main() {
    // Deploy Mock Tokens first
    const MockToken = await hre.ethers.getContractFactory("MockERC20");
    const stakingToken = await MockToken.deploy("Staking Token", "STK");
    await stakingToken.deployed();
    console.log("Staking Token deployed to:", stakingToken.address);

    const rewardToken = await MockToken.deploy("Reward Token", "RWD");
    await rewardToken.deployed();
    console.log("Reward Token deployed to:", rewardToken.address);

    // Deploy YieldFarm
    const YieldFarm = await hre.ethers.getContractFactory("YieldFarm");
    const yieldFarm = await YieldFarm.deploy(stakingToken.address, rewardToken.address);
    await yieldFarm.deployed();
    console.log("YieldFarm deployed to:", yieldFarm.address);

    // Set initial reward rate (0.1 tokens per second)
    await yieldFarm.setRewardRate(ethers.utils.parseEther("0.1"));
    console.log("Reward rate set");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });