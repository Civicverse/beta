# CivicVerse Smart Contracts

Smart contracts for The Foyer - CRAIG DAO governance, Protocol Integrity Enforcement, and ecosystem token mechanics.

## Contracts

- **CRAIG_DAO.sol** - DAO governance token and voting
- **CraigProtocolIntegrityEnforcer.sol** - Protocol enforcement and validation
- **Smartcontract.sol** - Core ecosystem contracts

## Tech Stack

- Solidity, Hardhat, OpenZeppelin, Ethers.js

## Getting Started

```bash
npm install
```

### Compile

```bash
npm run compile
```

### Deploy (Local)

```bash
npm run deploy
npm run deploy-craig
npm run deploy-dao
```

### Test

```bash
npm test
```

## Environment Variables

```
ETHEREUM_NETWORK=localhost
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=optional
```

## Key Features

- Decentralized governance via DAO
- Protocol integrity verification
- NFT-based reputation tokens
- Soulbound identity tokens
- Transparent audit trails

## Network Support

- Ethereum Mainnet
- Sepolia Testnet
- Kaspa
- Monero (privacy)

See [CONTRIBUTING.md](../docs/CONTRIBUTING.md) for guidelines.
