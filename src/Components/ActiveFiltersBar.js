import React from "react";
import { Box, Chip, Typography, Fade } from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import PublicIcon from "@mui/icons-material/Public";

const ActiveFiltersBar = ({ selectedSort, selectedArea, visible }) => {
  const getSortIcon = () => {
    switch (selectedSort) {
      case "popular":
        return <LocalFireDepartmentIcon sx={{ mr: 0.5 }} />;
      case "latest":
        return <NewReleasesIcon sx={{ mr: 0.5 }} />;
      case "random":
        return <ShuffleIcon sx={{ mr: 0.5 }} />;
      default:
        return null;
    }
  };

  return (
    <Fade in={visible}>
      <Box
        sx={{
          position: "fixed",
          top: 80,
          left: 0,
          right: 0,
          mx: "auto",
          width: "fit-content",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(6px)",
          borderRadius: "50px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          px: 3,
          py: 0.8,
          display: "flex",
          alignItems: "center",
          gap: 1,
          zIndex: 1200,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Filters:
        </Typography>

        <Chip
          icon={getSortIcon()}
          label={selectedSort.charAt(0).toUpperCase() + selectedSort.slice(1)}
          color="primary"
          size="small"
        />

        {selectedArea && selectedArea !== "All" && (
          <Chip
            icon={<PublicIcon />}
            label={selectedArea}
            color="secondary"
            size="small"
          />
        )}
      </Box>
    </Fade>
  );
};

export default ActiveFiltersBar;
