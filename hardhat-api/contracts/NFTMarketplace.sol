// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./NFT.sol";
// Link to original code
// https://chain.link/tutorials/how-to-build-an-nft-marketplace-with-hardhat-and-solidity

contract NFTMarketplace is ReentrancyGuard {
    // using Strings for uint256; // Use the Strings library for uint256
    // using Strings for address; // Use the Strings library for address

    // State Variables
    mapping(uint256 => NFT) private nftList;
    uint256 private tokenCounter = 0;
    NFT public testNFT;

    /**
     * @dev Creates a new NFT (Non-Fungible Token) and assigns it to the specified patient address.
     * @param patient The address that will own the newly created NFT.
     * @param uri The metadata URI for the NFT to be created.
     * 
     * Requirements:
     * - `patient` cannot be the zero address.
     * - The NFT must not already exist for the patient.
     */
    // function createNFT(address patient, string memory uri) public returns (address owner, string memory url) {
    function createNFT(address patient, string memory uri) public {
        require(patient != address(0), "Invalid patient address");

        NFT nft = new NFT();

        try nft.mintNFT(tokenCounter, patient, uri){
            testNFT = nft; // Return the latest token   
            nftList[tokenCounter] = nft; // Store the NFT instance in the mapping
            tokenCounter++; // Increment the token counter
        } catch {
            revert("Failed to mint NFT. Maybe check the string parsing in NFT.sol");
        }
    }

    function grantAccess(uint256 tokenId, address hospital) public returns (string memory) {
        require(tokenCounter > 0 && tokenId < tokenCounter, "Invalid token ID");
        require(hospital != address(0), "Invalid hospital address");

        NFT nft = nftList[tokenId];
        require(address(nft) != address(0), "No NFT found for the given address");

        try nft.setHospital(hospital) returns (string memory message) {
            return message; 
        } catch {
            revert("Failed to set hospital address.");
        }
    }

    function getLastCreatedNFT() public view returns (uint256 id, address owner, address hospital, string memory url) {
        require(tokenCounter > 0, "No NFTs created yet");
        NFT nft = nftList[tokenCounter - 1]; // Get the last created NFT
        try nft.getTokenId() returns (uint256 tokenId) {
            return nft.getNFTDetails(tokenId); // Return a tuple of owner address and URL
        } catch {
            revert("Failed to get NFT details. Maybe check the string parsing in NFT.sol");
        }
    }

    function accessPatientData(uint tokenId, address requestor) public view returns (uint256 id, address owner, address req, string memory url) {
        require(tokenCounter > 0 && tokenId < tokenCounter, "Invalid token ID");
        require(requestor != address(0), "Invalid patient address");

        NFT nft = nftList[tokenId];

        require(nft != NFT(address(0)), "No NFT found for the given address");   
        require(tokenId == nft.getTokenId(), "Invalid token ID for the patient");     
        require(nft.getHospital() == requestor, "Requestor is not authorized to access the data");

        return (nft.getNFTDetails(tokenId));
    }

    function getTokenCounter() public view returns(uint256) {
        return tokenCounter;
    }

    function ping() external pure returns (string memory) {
        return "Pong Reset from NFT Marketplace";
    }
}