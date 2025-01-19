# Yield Farm Protocol

A decentralized yield farming protocol built on Ethereum that allows users to stake tokens and earn rewards.

## Features

- Token staking functionality
- Automated reward distribution
- Configurable reward rates
- Security features with OpenZeppelin contracts
- Comprehensive test suite

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/yield-farm-protocol.git

# Install dependencies
cd yield-farm-protocol
npm install
```

## Usage

### Compile Contracts
```bash
npx hardhat compile
```

### Run Tests
```bash
npx hardhat test
```

### Deploy
```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

## Smart Contracts

- `YieldFarm.sol`: Main staking and reward distribution contract
- `MockERC20.sol`: Test token implementation

## Development

### Prerequisites
- Node.js >= 14
- npm >= 6

### Local Development
1. Start local Hardhat node:
```bash
npx hardhat node
```

2. Deploy contracts:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

## Testing
The test suite includes unit tests for all core functionality:
- Staking mechanisms
- Reward calculations
- Emergency functions
- Access control

## Security
- Built with OpenZeppelin contracts
- Includes reentrancy protection
- Emergency withdrawal functionality

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.