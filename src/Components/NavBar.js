import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  MenuItem,
  Select,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import RoomIcon from "@mui/icons-material/Room";
import axios from "axios";

const NavBar = ({ onSearch, onCategoryChange, onRegionChange }) => {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");

  // 🧩 Fetch categories (and merge custom ones)
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
      );

      // ✨ Add your own special categories
      const customCategories = [
        { strCategory: "All" },
        { strCategory: "Street Food" },
        { strCategory: "Indian Food" },
        { strCategory: "Chinese" },
        { strCategory: "Italian" },
        { strCategory: "Mexican" },
       
      ];

      // 🔍 Avoid duplicates from API list
      const apiCategories = res.data.meals.filter(
        (cat) =>
          !customCategories.some(
            (custom) => custom.strCategory === cat.strCategory
          )
      );

      // 🧠 Merge both sets
      setCategories([...customCategories, ...apiCategories]);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // 🌍 Fetch regions dynamically from API
  const fetchRegions = async () => {
    try {
      const res = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
      );
      setRegions([{ strArea: "All" }, ...res.data.meals]);
    } catch (err) {
      console.error("Error fetching regions:", err);
    }
  };

  // 🚀 Initial fetch
  useEffect(() => {
    fetchCategories();
    fetchRegions();
  }, []);

  // 🔍 Handle search bar
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(search);
  };

  // 🍽️ Handle category change
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    onCategoryChange(cat);
  };

  // 🌎 Handle region change
  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    onRegionChange(e.target.value);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "white",
        color: "black",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        zIndex: 1100,
      }}
    >
      <Toolbar
        sx={{
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* 🍴 Brand / Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <RestaurantMenuIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Food Finder
          </Typography>
        </Box>

        {/* 🔍 Search Bar */}
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            display: "flex",
            alignItems: "center",
            borderRadius: "50px",
            background: "#f5f5f5",
            px: 2,
            py: 0.5,
            width: { xs: "100%", sm: "50%", md: "40%" },
          }}
        >
          <SearchIcon color="action" />
          <InputBase
            placeholder="Search recipes, dishes..."
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ ml: 1 }}
          />
        </Box>

        {/* 🌍 Region Selector */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <RoomIcon color="primary" />
          <Select
            value={selectedRegion}
            onChange={handleRegionChange}
            sx={{
              minWidth: 120,
              borderRadius: "25px",
              background: "#f5f5f5",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          >
            {regions.map((r) => (
              <MenuItem key={r.strArea} value={r.strArea}>
                {r.strArea}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Toolbar>

      {/* 🍽️ Category Buttons */}
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          whiteSpace: "nowrap",
          px: 2,
          py: 1,
          bgcolor: "#fff8f0",
          borderTop: "1px solid #eee",
        }}
      >
        {categories.map((cat) => (
          <Typography
            key={cat.strCategory}
            onClick={() => handleCategoryChange(cat.strCategory)}
            sx={{
              px: 2,
              py: 0.8,
              mx: 1,
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight:
                selectedCategory === cat.strCategory ? "bold" : "normal",
              backgroundColor:
                selectedCategory === cat.strCategory ? "#ff7043" : "#fff",
              color:
                selectedCategory === cat.strCategory ? "#fff" : "#333",
              border: "1px solid #ddd",
              transition: "0.3s",
              "&:hover": {
                backgroundColor: "#ffe0b2",
              },
            }}
          >
            {cat.strCategory}
          </Typography>
        ))}
      </Box>
    </AppBar>
  );
};

export default NavBar;
