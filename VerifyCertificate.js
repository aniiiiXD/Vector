// src/components/VerifyCertificate.js
import React, { useState } from "react";
import { ethers } from "ethers"; // Ensure ethers.js v6 is installed
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material";

const contractAddress = "0x38a6422A9223e3A248a380191fbed94C3AE28d94";
const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "certificateHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "issuer",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "recipient",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "CertificateIssued",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "certificateHash",
        "type": "bytes32"
      }
    ],
    "name": "CertificateRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      }
    ],
    "name": "IssuerAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      }
    ],
    "name": "IssuerRemoved",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      }
    ],
    "name": "addIssuer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "certificates",
    "outputs": [
      {
        "internalType": "string",
        "name": "issuer",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "recipient",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "certificateHash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "revoked",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "issuersList",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "recipients",
        "type": "string[]"
      },
      {
        "internalType": "bytes32[]",
        "name": "certificateHashes",
        "type": "bytes32[]"
      },
      {
        "internalType": "string[]",
        "name": "ipfsHashes",
        "type": "string[]"
      }
    ],
    "name": "issueBatchCertificates",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "issuer",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "recipient",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "certificateHash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "issueCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "issuers",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      }
    ],
    "name": "removeIssuer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "certificateHash",
        "type": "bytes32"
      }
    ],
    "name": "revokeCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "certificateHash",
        "type": "bytes32"
      }
    ],
    "name": "verifyCertificate",
    "outputs": [
      {
        "internalType": "string",
        "name": "issuer",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "recipient",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "revoked",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

function VerifyCertificate() {
  const [certificateHash, setCertificateHash] = useState("");
  const [verificationResult, setVerificationResult] = useState("");
  const [error, setError] = useState("");

  const verifyCertificate = async () => {
    if (!certificateHash) {
      setError("Please enter a certificate hash");
      return;
    }

    try {
      // Connect to the Ethereum provider (e.g., MetaMask)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);

      // Call the verifyCertificate function from the smart contract
      const result = await contract.verifyCertificate(certificateHash);

      // Format and display the result
      setVerificationResult(
        `Issuer: ${result.issuer}, Recipient: ${result.recipient}, Timestamp: ${new Date(result.timestamp * 1000).toLocaleString()}, IPFS Hash: ${result.ipfsHash}, Revoked: ${result.revoked ? "Yes" : "No"}`
      );
      setError("");
    } catch (err) {
      console.error("Error verifying certificate:", err);
      setError("Failed to verify certificate. Please check the hash and try again.");
      setVerificationResult("");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Verify Certificate
      </Typography>
      <Box sx={{ maxWidth: 500, margin: "auto" }}>
        <TextField
          label="Certificate Hash"
          value={certificateHash}
          onChange={(e) => setCertificateHash(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={verifyCertificate}
        >
          Verify
        </Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {verificationResult && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {verificationResult}
          </Alert>
        )}
      </Box>
    </Container>
  );
}

export default VerifyCertificate;