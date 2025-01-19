const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("YieldFarm", function () {
    let YieldFarm;
    let yieldFarm;
    let stakingToken;
    let rewardToken;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        // Get test accounts
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy mock ERC20 tokens for staking and rewards
        const MockToken = await ethers.getContractFactory("MockERC20");
        stakingToken = await MockToken.deploy("Staking Token", "STK");
        rewardToken = await MockToken.deploy("Reward Token", "RWD");

        // Deploy YieldFarm contract
        YieldFarm = await ethers.getContractFactory("YieldFarm");
        yieldFarm = await YieldFarm.deploy(stakingToken.address, rewardToken.address);

        // Mint some tokens to test accounts
        await stakingToken.mint(addr1.address, ethers.utils.parseEther("1000"));
        await stakingToken.mint(addr2.address, ethers.utils.parseEther("1000"));
        await rewardToken.mint(yieldFarm.address, ethers.utils.parseEther("10000"));

        // Set reward rate
        await yieldFarm.setRewardRate(ethers.utils.parseEther("0.1")); // 0.1 tokens per second
    });

    describe("Staking", function () {
        it("Should allow users to stake tokens", async function () {
            const stakeAmount = ethers.utils.parseEther("100");
            
            // Approve spending
            await stakingToken.connect(addr1).approve(yieldFarm.address, stakeAmount);
            
            // Stake tokens
            await yieldFarm.connect(addr1).stake(stakeAmount);
            
            expect(await yieldFarm.balances(addr1.address)).to.equal(stakeAmount);
            expect(await yieldFarm.totalSupply()).to.equal(stakeAmount);
        });

        it("Should allow users to withdraw staked tokens", async function () {
            const stakeAmount = ethers.utils.parseEther("100");
            
            // Stake tokens
            await stakingToken.connect(addr1).approve(yieldFarm.address, stakeAmount);
            await yieldFarm.connect(addr1).stake(stakeAmount);
            
            // Withdraw tokens
            await yieldFarm.connect(addr1).withdraw(stakeAmount);
            
            expect(await yieldFarm.balances(addr1.address)).to.equal(0);
            expect(await yieldFarm.totalSupply()).to.equal(0);
        });

        it("Should distribute rewards correctly", async function () {
            const stakeAmount = ethers.utils.parseEther("100");
            
            // Stake tokens
            await stakingToken.connect(addr1).approve(yieldFarm.address, stakeAmount);
            await yieldFarm.connect(addr1).stake(stakeAmount);
            
            // Advance time by 100 seconds
            await ethers.provider.send("evm_increaseTime", [100]);
            await ethers.provider.send("evm_mine");
            
            // Check earned rewards
            const earned = await yieldFarm.earned(addr1.address);
            expect(earned).to.be.gt(0);
            
            // Claim rewards
            await yieldFarm.connect(addr1).getReward();
            
            const rewardBalance = await rewardToken.balanceOf(addr1.address);
            expect(rewardBalance).to.equal(earned);
        });
    });
});