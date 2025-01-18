// src/components/IssueCertificate.js
import React, { useState } from "react";
import { ethers } from "ethers";
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material";
import axios from "axios";

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

function IssueCertificate() {
  const [issuer, setIssuer] = useState("");
  const [recipient, setRecipient] = useState("");
  const [file, setFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToIPFS = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: {
          "pinata_api_key": "3caad919809f3d3f7ee0",
          "pinata_secret_api_key": "f5606fce8fa809ac439a916b4fc39e568c3a5cec17d90b2042e69005e59901e9",
        },
      });
      return response.data.IpfsHash;
    } catch (err) {
      setError("Failed to upload file to IPFS");
      throw err;
    }
  };

  const issueCertificate = async () => {
    if (!issuer || !recipient || !file) {
      setError("Please fill all fields and upload a file");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const ipfsHash = await uploadToIPFS();
      setIpfsHash(ipfsHash);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const certificateHash = ethers.id(ipfsHash);

      const tx = await contract.issueCertificate(issuer, recipient, certificateHash, ipfsHash);
      await tx.wait();

      setSuccess("Certificate issued successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Issue Certificate
      </Typography>
      <Box sx={{ maxWidth: 500, margin: "auto" }}>
        <TextField
          label="Issuer"
          value={issuer}
          onChange={(e) => setIssuer(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          fullWidth
          margin="normal"
        />
        <input type="file" onChange={handleFileChange} style={{ margin: "20px 0" }} />
        <Button
          variant="contained"
          color="primary"
          onClick={issueCertificate}
          disabled={loading}
        >
          {loading ? "Issuing..." : "Issue Certificate"}
        </Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      </Box>
    </Container>
  );
}

export default IssueCertificate;