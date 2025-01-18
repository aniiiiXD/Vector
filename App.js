// src/App.js
import React from "react";
import {Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import IssueCertificate from "./components/IssueCertificate";
import VerifyCertificate from "./components/VerifyCertificate";
import { Container, Typography } from "@mui/material";

function Home() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome to the Certificate Validation System
      </Typography>
      <Typography variant="body1">
        This system allows you to issue and verify certificates on the blockchain.
      </Typography>
    </Container>
  );
}

function App() {
  console.log("App component rendered"); // Debug log
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/issue" element={<IssueCertificate />} />
        <Route path="/verify" element={<VerifyCertificate />} />
      </Routes>
    </>
  );
}

export default App;
