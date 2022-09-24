// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ERC20Interface {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address spender, address recipient, uint256 amount) external returns (bool);
    
    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Transfer(address indexed spender, address indexed from, address indexed to, uint256 amount);
}

contract GigScore is ERC20Interface, Ownable {
    mapping (address => uint256) private _balances;

    uint256 public _totalSupply;
    string public _name;
    string public _symbol;
    uint8 public _decimals;

    address private moderatorContract;
    address private governorContract;
    
    constructor(string memory getName, string memory getSymbol) {
        _name = getName;
        _symbol = getSymbol;
        _decimals = 18;
        _totalSupply = 100000000e18;
        _balances[msg.sender] = _totalSupply;
    }
    
    function name() public view returns (string memory) {
        return _name;
    }
    
    function symbol() public view returns (string memory) {
        return _symbol;
    }
    
    function decimals() public view returns (uint8) {
        return _decimals;
    }
    // Gig Score 총 발행량 확인
    function totalSupply() external view virtual override returns (uint256) {
        return _totalSupply;
    }
    // Gig Score 보유량 확인
    function balanceOf(address account) external view virtual override returns (uint256) {
        return _balances[account];
    }

    function transferFrom(address sender, address recipient, uint256 amount) external virtual override returns (bool) {
        require(msg.sender == owner() || msg.sender == moderatorContract || msg.sender == governorContract);
        _transfer(sender, recipient, amount);
        emit Transfer(msg.sender, sender, recipient, amount);
        return true;
    }
    
    function _transfer(address sender, address recipient, uint256 amount) internal virtual {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        uint256 senderBalance = _balances[sender];
        require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
        _balances[sender] = senderBalance - amount;
        _balances[recipient] += amount;
    }

    // 모더레이터 컨트랙트 주소 설정
    function setModeratorContractAddress(address _moderatorContract) external {
        require(msg.sender == owner() || msg.sender == moderatorContract || msg.sender == governorContract);
        moderatorContract = _moderatorContract;
    }

    // 거버너 컨트랙트 주소 설정
    function setGovernorContractAddress(address _governorContract) external {
        require(msg.sender == owner() || msg.sender == moderatorContract || msg.sender == governorContract);
        governorContract = _governorContract;
    }
}