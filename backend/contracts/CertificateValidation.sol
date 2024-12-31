// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateValidation {
   address public owner;
    struct Certificate {
        string issuer;
        string recipient;
        uint256 timestamp;
        bytes32 certificateHash;
        string ipfsHash; 
        bool revoked; 
    }

    mapping(bytes32 => Certificate) public certificates;


    mapping(address => bool) public issuers;

    event CertificateIssued(bytes32 indexed certificateHash, string issuer, string recipient, uint256 timestamp, string ipfsHash);
    event CertificateRevoked(bytes32 indexed certificateHash);
    event IssuerAdded(address indexed issuer);
    event IssuerRemoved(address indexed issuer);

    modifier onlyIssuer() {
        require(issuers[msg.sender], "Only authorized issuers can perform this action");
        _;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
    constructor() {
        owner = msg.sender;
    }


    // Add an authorized issuer (only contract owner can do this)
    function addIssuer(address issuer) public onlyOwner {
        issuers[issuer] = true;
        emit IssuerAdded(issuer);
    }

    // Remove an authorized issuer
    function removeIssuer(address issuer) public onlyIssuer {
        issuers[issuer] = false;
        emit IssuerRemoved(issuer);
    }

    function issueCertificate(
        string memory issuer,
        string memory recipient,
        bytes32 certificateHash,
        string memory ipfsHash
    ) public onlyIssuer {
        require(certificates[certificateHash].timestamp == 0, "Certificate already exists");

        certificates[certificateHash] = Certificate({
            issuer: issuer,
            recipient: recipient,
            timestamp: block.timestamp,
            certificateHash: certificateHash,
            ipfsHash: ipfsHash,
            revoked: false
        });

        emit CertificateIssued(certificateHash, issuer, recipient, block.timestamp, ipfsHash);
    }

    // Issue multiple certificates in a batch
    function issueBatchCertificates(
        string[] memory issuersList,
        string[] memory recipients,
        bytes32[] memory certificateHashes,
        string[] memory ipfsHashes
    ) public onlyIssuer {
        require(
            issuersList.length == recipients.length &&
            recipients.length == certificateHashes.length &&
            certificateHashes.length == ipfsHashes.length,
            "Input arrays must have the same length"
        );

        for (uint256 i = 0; i < certificateHashes.length; i++) {
            require(certificates[certificateHashes[i]].timestamp == 0, "Certificate already exists");

            certificates[certificateHashes[i]] = Certificate({
                issuer: issuersList[i],
                recipient: recipients[i],
                timestamp: block.timestamp,
                certificateHash: certificateHashes[i],
                ipfsHash: ipfsHashes[i],
                revoked: false
            });

            emit CertificateIssued(certificateHashes[i], issuersList[i], recipients[i], block.timestamp, ipfsHashes[i]);
        }
    }

    // Verify a certificate
    function verifyCertificate(bytes32 certificateHash) public view returns (
        string memory issuer,
        string memory recipient,
        uint256 timestamp,
        string memory ipfsHash,
        bool revoked
    ) {
        Certificate memory cert = certificates[certificateHash];
        require(cert.timestamp != 0, "Certificate does not exist");
        return (cert.issuer, cert.recipient, cert.timestamp, cert.ipfsHash, cert.revoked);
    }

    // Revoke a certificate
    function revokeCertificate(bytes32 certificateHash) public onlyIssuer {
        require(certificates[certificateHash].timestamp != 0, "Certificate does not exist");
        require(!certificates[certificateHash].revoked, "Certificate is already revoked");

        certificates[certificateHash].revoked = true;
        emit CertificateRevoked(certificateHash);
    }
}