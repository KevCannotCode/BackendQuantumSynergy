// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// We import this library to be able to use console.log

contract FileTransfer {
    // struct File {
    //     address sender;
    //     address receiver;
    //     string content;
    // }

    struct Metadata {
        string mlName;
        string mlHash;
        string modelType;
        string timestamp;
        uint blockTimestamp;
        address owner;
        address receiver;
        string contractHash;
    }

    // mapping(uint256 => File) private files;
    // uint256 public fileCounter;
    // event FileSent(uint256 fileId, address indexed sender, address indexed receiver, string content);


    uint256 public metadataCounter;
    mapping (uint256 => Metadata) private fileMetadata;
    event MetadataRecorded(uint256 metadataId, string mlName, string mlHash, string modelType, string timestamp, address owner, address receiver, string contractHash);

    // function sendFile(string memory content, address _receiver) public {
    //     fileCounter++;
    //     files[fileCounter] = File(msg.sender, _receiver, content);
    //     emit FileSent(fileCounter, msg.sender, _receiver, content);
    // }

    // function getFile(uint256 fileId) public view returns (string memory) {
    //     File memory file = files[fileId];
    //     require(msg.sender == file.receiver, "Only the specified receiver can access the file.");
    //     return file.content;
    // }

    // function getFileDetails(uint256 fileId) public view returns (address, address, string memory) {
    //     File memory file = files[fileId];
    //     return (file.sender, file.receiver, file.content);
    // }

    // function getFileCounter() public view returns (uint256) {
    //     return fileCounter;
    // }  

    function ping() public pure returns (string memory) {
        return "Pong Reset";
    }
 

    // New Method to record Metadata upload
    function recordMetadata(string memory mlName, string memory mlHash, string memory modelType, string memory timestamp, address receiver, string memory contractHash) public {
        // store metadata
        string memory test = "TESTING THAT THE LOG TAKE FROM THE CONTRACT";
        fileMetadata[metadataCounter] = Metadata(test, mlHash, modelType, timestamp, block.timestamp, msg.sender, receiver, contractHash);
        block.timestamp;
        // emit event for metadata recording
        emit MetadataRecorded(metadataCounter, mlName, mlHash, modelType, timestamp, msg.sender, receiver, contractHash);
        
    }
}