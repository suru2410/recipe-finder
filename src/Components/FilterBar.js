import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";

const FilterBar = ({ selectedSort, onSortChange, selectedArea, onAreaChange }) => {
  const [areas, setAreas] = useState([]);

  // 🧭 Fetch available areas dynamically
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await axios.get("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
        setAreas(res.data.meals.map((area) => area.strArea));
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    };
    fetchAreas();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 2,
        mb: 4,
      }}
    >
      {/* Sort Filter */}
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={selectedSort}
          label="Sort By"
          onChange={(e) => onSortChange(e.target.value)}
        >
          <MenuItem value="popular">Popular</MenuItem>
          <MenuItem value="latest">Latest</MenuItem>
          <MenuItem value="random">Random</MenuItem>
        </Select>
      </FormControl>

      {/* Area Filter */}
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Filter by Area</InputLabel>
        <Select
          value={selectedArea}
          label="Filter by Area"
          onChange={(e) => onAreaChange(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          {areas.map((area) => (
            <MenuItem key={area} value={area}>
              {area}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterBar;
