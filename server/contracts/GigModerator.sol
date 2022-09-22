// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GigModerator is Context, ERC165, Ownable {
    using Address for address;
    using Strings for uint256;
    using Counters for Counters.Counter;

    string private _name;
    string private _symbol;

    // GigScore를 소비하여 Moderator가 되는데 지불하는 비용
    uint256 switchingPrice;
    IERC20 token;

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;

    mapping(address => mapping(uint256 => uint256)) private _ownedTokens;
    mapping(uint256 => uint256) private _ownedTokensIndex;

    uint256[] private _allTokens;
    mapping(uint256 => uint256) private _allTokensIndex;

    mapping(uint256 => string) private _tokenURIs;

    Counters.Counter private _tokenIds;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    constructor() {
        _name = "GigModerator";
        _symbol = "GTM";
        switchingPrice = 100000;
    }

    // ERC 인터페이스를 지원하는 녀석
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return
            interfaceId == type(IERC721Enumerable).interfaceId ||
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    // 모더레이터가 소유한 ERC721의 양을 반환한다. 모더레이터는 1개만 발급 받기 때문에 결과는 언제나 0, 1 이다.
    function balanceOf(address owner) public view virtual returns (uint256) {
        require(owner != address(0), "ERC721: address zero is not a valid owner");
        return _balances[owner];
    }

    function ownerOf(uint256 tokenId) public view virtual returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: invalid token ID");
        return owner;
    }

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    function _baseURI() internal view virtual returns (string memory) {
        return "";
    }

    // 모더레이터 권한은 실제 거래되지는 않지만, 추후 거버넌스에 의해 변경될 가능성도 있어 남겨둠
    function transferFrom(address from, address to, uint256 tokenId) public virtual onlyOwner {
        _transfer(from, to, tokenId);
    }
    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual onlyOwner {
        _transfer(from, to, tokenId);
    }

    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _owners[tokenId] != address(0);
    }

    // NFT 발행 함수. 모더레이터는 1개의 자격만 갖는다. 따라서 이미 발급된 주소에는 재발급되지 않는다.
    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");
        require(_balances[to] == 0, "Already Moderator");

        _beforeTokenTransfer(address(0), to, tokenId);

        require(!_exists(tokenId), "Token already minted");

        unchecked {
            _balances[to] += 1;
        }

        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);

        _afterTokenTransfer(address(0), to, tokenId);
    }

    // 모더레이터의 자격을 박탈한다.
    function _burn_(uint256 tokenId) internal virtual {
        address owner = ownerOf(tokenId);

        _beforeTokenTransfer(owner, address(0), tokenId);

        owner = ownerOf(tokenId);

        unchecked {
            _balances[owner] -= 1;
        }
        delete _owners[tokenId];

        emit Transfer(owner, address(0), tokenId);

        _afterTokenTransfer(owner, address(0), tokenId);
    }

    function _transfer(address from, address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: transfer to the zero address");

        _beforeTokenTransfer(from, to, tokenId);

        unchecked {
            _balances[from] -= 1;
            _balances[to] += 1;
        }
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);

        _afterTokenTransfer(from, to, tokenId);
    }

    function _requireMinted(uint256 tokenId) internal view virtual {
        require(_exists(tokenId), "ERC721: invalid token ID");
    }

    function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual returns (uint256) {
        require(index < balanceOf(owner), "ERC721Enumerable: owner index out of bounds");
        return _ownedTokens[owner][index];
    }

    // 발행된 총 NFT의 양을 반환한다. **** 모더레이터의 수와 같다 ****
    function totalSupply() public view virtual returns (uint256) {
        return _allTokens.length;
    }

    function tokenByIndex(uint256 index) public view virtual returns (uint256) {
        require(index < totalSupply(), "ERC721Enumerable: global index out of bounds");
        return _allTokens[index];
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual {
        if (from == address(0)) {
            _addTokenToAllTokensEnumeration(tokenId);
        } else if (from != to) {
            _removeTokenFromOwnerEnumeration(from, tokenId);
        }
        if (to == address(0)) {
            _removeTokenFromAllTokensEnumeration(tokenId);
        } else if (to != from) {
            _addTokenToOwnerEnumeration(to, tokenId);
        }
    }

    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        uint256 length = balanceOf(to);
        _ownedTokens[to][length] = tokenId;
        _ownedTokensIndex[tokenId] = length;
    }

    function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
        _allTokensIndex[tokenId] = _allTokens.length;
        _allTokens.push(tokenId);
    }

    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId) private {
        uint256 lastTokenIndex = balanceOf(from) - 1;
        uint256 tokenIndex = _ownedTokensIndex[tokenId];

        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];

            _ownedTokens[from][tokenIndex] = lastTokenId;
            _ownedTokensIndex[lastTokenId] = tokenIndex;
        }

        delete _ownedTokensIndex[tokenId];
        delete _ownedTokens[from][lastTokenIndex];
    }

    function _removeTokenFromAllTokensEnumeration(uint256 tokenId) private {
        uint256 lastTokenIndex = _allTokens.length - 1;
        uint256 tokenIndex = _allTokensIndex[tokenId];
        uint256 lastTokenId = _allTokens[lastTokenIndex];

        _allTokens[tokenIndex] = lastTokenId;
        _allTokensIndex[lastTokenId] = tokenIndex;

        delete _allTokensIndex[tokenId];
        _allTokens.pop();
    }

    function _afterTokenTransfer(address from, address to, uint256 tokenId) internal virtual {}

    function tokenURI(uint256 tokenId) public view virtual returns (string memory) {
        _requireMinted(tokenId);

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return bytes(base).length > 0 ? string(abi.encodePacked(base, tokenId.toString())) : "";
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function _burn(uint256 tokenId) internal virtual {
        _burn_(tokenId);

        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }

    function switchModerator(address _recipient, string memory _tokenURI) public onlyOwner returns (uint256) {
        require(token.balanceOf(_recipient) > switchingPrice);

        token.transferFrom(_recipient, msg.sender, switchingPrice);
        
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(_recipient, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        return newItemId;
    }

    // 연결된 ERC20 토큰, 즉 GigScore 토큰 컨트랙트의 주소를 재설정한다.
    function setToken (address _tokenAddress) public onlyOwner returns (bool) {
        require(_tokenAddress != address(0x0));
        token = IERC20(_tokenAddress);
        return true;
    }

    // 현재 모더레이터 전환하기 위한 Gig Score 조회
    function getSwitchingPrice () public view returns (uint) {
        return switchingPrice;
    }

    // 모더레이터로 전환하는 Gig Score Price 변경 함수
    function setSwitchingPrice (uint _price) public onlyOwner returns (bool) {
        switchingPrice = _price;
        return true;
    }
}