// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/draft-ERC721Votes.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GigModerator is ERC721, ERC721Enumerable, ERC721Burnable, Ownable, EIP712, ERC721Votes {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // 거버넌스
    address private _governor;

    // GigScore를 소비하여 Moderator가 되는데 지불하는 비용
    uint256 switchingPrice;
    IERC20 token;

    constructor() ERC721("GigModerator", "GSM") EIP712("GigModerator", "1") {
        switchingPrice = 100000;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/bafybeifanfpb7iwdhjveyccm4vv2bsj2omhjqhcwrv5kunxbfnozirzduy";
    }

    function safeMint(address to) public {
        require(msg.sender == owner() || msg.sender == _governor);
        require(balanceOf(to) == 0, "Already Moderator");
        require(token.balanceOf(to) > switchingPrice);

        if(to != msg.sender){
            token.transferFrom(to, msg.sender, switchingPrice);
        }

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        delegate(to);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _afterTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Votes)
    {
        super._afterTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function delegate(address to) public override {
        _delegate(to, to);
    }

    // 연결된 ERC20 토큰, 즉 GigScore 토큰 컨트랙트의 주소를 재설정한다.
    function setToken (address _tokenAddress) public returns (bool) {
        require(msg.sender == owner() || msg.sender == _governor);
        require(_tokenAddress != address(0x0));
        token = IERC20(_tokenAddress);
        return true;
    }

    // 현재 모더레이터 전환하기 위한 Gig Score 조회
    function getSwitchingPrice () public view returns (uint) {
        return switchingPrice;
    }

    // 모더레이터로 전환하는 Gig Score Price 변경 함수
    function setSwitchingPrice (uint _price) public returns (bool) {
        require(msg.sender == owner() || msg.sender == _governor);
        switchingPrice = _price;
        return true;
    }

    // 거버너 주소 변경
    function setGovernor (address governor_) public returns (bool) {
        require(msg.sender == owner() || msg.sender == _governor);
        _governor = governor_;
        return true;
    }
}