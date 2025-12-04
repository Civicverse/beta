// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MultisigTreasury {
    IERC20 public voteToken;
    
    address[] public signers;
    mapping(address => bool) public isSigner;
    uint256 public requiredSignatures = 2;

    struct Deposit {
        address depositor;
        uint256 amount;
        uint256 timestamp;
    }

    struct Proposal {
        uint256 id;
        address recipient;
        uint256 amount;
        string description;
        address[] confirmedBy;
        bool executed;
    }

    Deposit[] public deposits;
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount = 0;
    uint256 public totalDeposited = 0;

    event Deposit(address indexed depositor, uint256 amount);
    event ProposalCreated(uint256 indexed proposalId, address recipient, uint256 amount);
    event Confirmed(uint256 indexed proposalId, address signer);
    event Executed(uint256 indexed proposalId, address recipient, uint256 amount);

    constructor(address[] memory _signers, address _voteToken) {
        for (uint256 i = 0; i < _signers.length; i++) {
            signers.push(_signers[i]);
            isSigner[_signers[i]] = true;
        }
        voteToken = IERC20(_voteToken);
    }

    function deposit(uint256 amount) external {
        require(voteToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        deposits.push(Deposit(msg.sender, amount, block.timestamp));
        totalDeposited += amount;
        emit Deposit(msg.sender, amount);
    }

    function createProposal(address recipient, uint256 amount, string memory description) external {
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            recipient: recipient,
            amount: amount,
            description: description,
            confirmedBy: new address[](0),
            executed: false
        });
        emit ProposalCreated(proposalCount, recipient, amount);
        proposalCount++;
    }

    function confirmProposal(uint256 proposalId) external {
        require(isSigner[msg.sender], "Not a signer");
        require(proposalId < proposalCount, "Invalid proposal");
        require(!proposals[proposalId].executed, "Already executed");

        proposals[proposalId].confirmedBy.push(msg.sender);
        emit Confirmed(proposalId, msg.sender);

        if (proposals[proposalId].confirmedBy.length >= requiredSignatures) {
            executeProposal(proposalId);
        }
    }

    function executeProposal(uint256 proposalId) internal {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "Already executed");
        require(voteToken.transfer(proposal.recipient, proposal.amount), "Transfer failed");
        proposal.executed = true;
        emit Executed(proposalId, proposal.recipient, proposal.amount);
    }

    function getProposal(uint256 id) external view returns (Proposal memory) {
        return proposals[id];
    }

    function getBalance() external view returns (uint256) {
        return voteToken.balanceOf(address(this));
    }
}
