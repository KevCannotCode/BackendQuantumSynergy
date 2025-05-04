// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// Original Code from : https://github.com/dappuniversity/nft_marketplace/blob/main/src/backend/contracts/NFT.sol
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFT is ERC721URIStorage {
    address public _hospital = address(0); // Default hospital address;
    uint256 public _tokenId = 0;
    bool public _isMinted = false; // Flag to check if the NFT is minted

    event NFTCreated(address indexed patient, uint256 tokenId);
    event NFTMinted(uint256 indexed tokenId, address indexed owner, string uri);
    event HospitalSet(address indexed hospital);

    constructor() ERC721("PatientAccessToken", "NFT") {}

    function mintNFT(uint256 tokenId, address patient, string memory dataURL) public {
        _mint(patient, tokenId);
        _setTokenURI(tokenId, dataURL);
        _tokenId = tokenId; // Update the latest tokenId
        _isMinted = true; // Set the minted flag to true
        emit NFTMinted(tokenId, patient, dataURL);
    }

    function getNFTDetails(uint256 tokenId) public view returns (uint256 id, address patient, address requestor, string memory url) {
        require(_isMinted, "Token was not minted properly");
        require(_ownerOf(tokenId) != address(0), "ERC721: URI query for nonexistent token");
 
        patient = ownerOf(tokenId); 
        url = tokenURI(tokenId);
        requestor = _hospital;
        return (tokenId, patient, requestor, url);
    }

    function getTokenId() public view returns (uint256) {
       return _tokenId; // assuming it's public or internal
    }

    function setHospital(address hospital) public returns (string memory){
        _hospital = hospital;
        emit HospitalSet(hospital);
        return "Hospital address set successfully";
    }

    function getHospital() public view returns (address) {
        return _hospital;
    }
}
