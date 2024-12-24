const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FileTransfer", function () {
  let FileTransfer;
  let fileTransfer;
  let owner;
  let receiver;

  beforeEach(async function () {
    [owner, receiver] = await ethers.getSigners();
    FileTransfer = await ethers.getContractFactory("FileTransfer");
    fileTransfer = await FileTransfer.deploy();
    // await fileTransfer.deployed();
    console.log("Ping Test %s \n------ INIT DONE-----------\n", await fileTransfer.ping());
  });

  it("Should allow the owner to send a file and assign it an ID", async function () {
    const fileContent = "This is a test file.";
    await fileTransfer.sendFile(fileContent, receiver.address);

    // Retrieve the file using its ID (file ID should be 1 as it's the first file)
    // console.log('owner = %s\nreceiver %s\n', owner.address, receiver.address);
    // console.log(await fileTransfer.getFileDetails(1));
    const retrievedContent = await fileTransfer.connect(receiver).getFile(1);
    expect(retrievedContent).to.equal(fileContent);
  });

  it("Should restrict access to the receiver only", async function () {
    const fileContent = "Restricted access test.";
    await fileTransfer.sendFile(fileContent, receiver.address);

    // Attempt to retrieve the file with the wrong user (owner, in this case)
    await expect(
      fileTransfer.connect(owner).getFile(1)
    ).to.be.revertedWith("Only the specified receiver can access the file.");
  });

  it("Should store and retrieve the file details correctly", async function () {
    const fileContent = "Check file details.";
    await fileTransfer.sendFile(fileContent, receiver.address);

    // Get the file details
    const [sender, fileReceiver, content] = await fileTransfer.getFileDetails(1);
    expect(sender).to.equal(owner.address);
    expect(fileReceiver).to.equal(receiver.address);
    expect(content).to.equal(fileContent);
  });
});
