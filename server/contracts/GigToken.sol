// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ERC20Interface {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function transferFrom(
        address spender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Transfer(
        address indexed spender,
        address indexed from,
        address indexed to,
        uint256 amount
    );
}

contract GigToken is ERC20Interface, Ownable {
    mapping(address => uint256) private _balances;

    uint256 public _totalSupply;
    string public _name;
    string public _symbol;
    uint8 public _decimals;

    // 관리자 계정이 가진 토큰 외, 실제 유통되는 총 토큰의 양과 누적 거래량
    uint256 private _totalCurrency = 0;
    uint256 private _totalCumulative = 0;

    // 거버너 등록
    address private _governor;

    // pending 수수료, welcomeReward, reviewReward
    uint256 private _pendingCommission = 1500;
    uint256 private _welcome = 3000;
    uint256 private _review = 500;

    // staking. 스테이킹 기능은 추후 구현.
    mapping(address => uint256) stakings;
    uint256 private totalStakingVolume;

    constructor(string memory getName, string memory getSymbol) {
        _name = getName;
        _symbol = getSymbol;
        _decimals = 18;
        _totalSupply = 100000000e18;
        _balances[msg.sender] = _totalSupply;
    }

    // 실제 유통되는 총 통화량 구하기
    function totalCurrency() public view returns (uint256) {
        return _totalCurrency;
    }

    // 총 누적 거래량 구하기
    function totalCumulative() public view returns (uint256) {
        return _totalCumulative;
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

    // ERC20 총 발행량 확인
    function totalSupply() external view virtual override returns (uint256) {
        return _totalSupply;
    }

    // 토큰 보유량 확인
    function balanceOf(address account)
        external
        view
        virtual
        override
        returns (uint256)
    {
        return _balances[account];
    }

    // 토큰 직접전송
    function transfer(address recipient, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        _transfer(msg.sender, recipient, amount);
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    // 제 3자에 의한 전송. 컨트랙트의 소유자만 실행 가능하다.
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external virtual override returns (bool) {
        require(msg.sender == owner() || msg.sender == _governor);
        _transfer(sender, recipient, amount);
        emit Transfer(msg.sender, sender, recipient, amount);
        return true;
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        uint256 senderBalance = _balances[sender];
        require(
            senderBalance >= amount,
            "ERC20: transfer amount exceeds balance"
        );
        if (sender == owner()) {
            _totalCurrency += amount;
        }
        _totalCumulative += amount;
        _balances[sender] = senderBalance - amount;
        _balances[recipient] += amount;
    }

    function setGovernor(address governor_) public returns (bool) {
        require(msg.sender == owner() || msg.sender == _governor);
        _governor = governor_;
        return true;
    }

    function getPendingCommission() public view returns (uint256) {
        return _pendingCommission;
    }

    function setPendingCommission(uint256 pendingCommission_)
        public
        returns (bool)
    {
        require(msg.sender == owner() || msg.sender == _governor);
        _pendingCommission = pendingCommission_;
        return true;
    }

    function getWelcome() public view returns (uint256) {
        return _welcome;
    }

    function setWelcome(uint256 welcome_) public returns (bool) {
        require(msg.sender == owner() || msg.sender == _governor);
        _welcome = welcome_;
        return true;
    }

    function getReview() public view returns (uint256) {
        return _review;
    }

    function setReview(uint256 review_) public returns (bool) {
        require(msg.sender == owner() || msg.sender == _governor);
        _review = review_;
        return true;
    }

    // 펜딩 전환 수수료 지불
    function transPending(address _user) external returns (bool) {
        require(msg.sender == owner() || msg.sender == _governor);
        _transfer(_user, msg.sender, _pendingCommission);
        return true;
    }

    // 신규가입 리워드 보상
    function rewardWelcome(address _user) external returns (bool) {
        require(msg.sender == owner() || msg.sender == _governor);
        _transfer(msg.sender, _user, _welcome);
        return true;
    }

    // 후기 작성 리워드 보상
    function rewardReview(address _user) external returns (bool) {
        require(msg.sender == owner() || msg.sender == _governor);
        _transfer(msg.sender, _user, _review);
        return true;
    }
}
