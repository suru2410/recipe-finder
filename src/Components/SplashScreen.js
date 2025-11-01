import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

const SplashScreen = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(120deg, #ff6f61, #ff9966)",
        color: "white",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          letterSpacing: "1px",
          mb: 3,
        }}
      >
        🍳 Recipe Finder
      </Typography>
      <CircularProgress sx={{ color: "white" }} thickness={4} />
      <Typography variant="subtitle1" sx={{ mt: 2, opacity: 0.9 }}>
        Discover delicious meals...
      </Typography>
    </Box>
  );
};

export default SplashScreen;
