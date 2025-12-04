// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract QuadraticVoting {
    IERC20 public voteToken;
    uint256 public costUnit = 1e18; // 1 token per vote unit

    struct Proposal {
        uint256 id;
        string title;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 createdAt;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => uint256)) public voterVotes;
    uint256 public proposalCount = 0;

    event ProposalCreated(uint256 indexed id, string title);
    event VoteCast(uint256 indexed proposalId, address indexed voter, uint256 votes, bool support);

    constructor(address _voteToken) {
        voteToken = IERC20(_voteToken);
    }

    function createProposal(string memory title) external {
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            title: title,
            votesFor: 0,
            votesAgainst: 0,
            createdAt: block.timestamp,
            executed: false
        });
        emit ProposalCreated(proposalCount, title);
        proposalCount++;
    }

    function vote(uint256 proposalId, uint256 votes, bool support) external {
        require(proposalId < proposalCount, "Invalid proposal");
        uint256 cost = votes * votes * costUnit;
        require(voteToken.transferFrom(msg.sender, address(this), cost), "Transfer failed");
        
        voterVotes[proposalId][msg.sender] += votes;
        if (support) {
            proposals[proposalId].votesFor += votes;
        } else {
            proposals[proposalId].votesAgainst += votes;
        }
        emit VoteCast(proposalId, msg.sender, votes, support);
    }

    function getProposal(uint256 id) external view returns (Proposal memory) {
        return proposals[id];
    }
}
