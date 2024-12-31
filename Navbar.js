// src/components/Navbar.js
import React from "react";

import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Certificate Validation System
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/issue">
          Issue Certificate
        </Button>
        <Button color="inherit" component={Link} to="/verify">
          Verify Certificate
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;