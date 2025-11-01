import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  Stack,
  Avatar,
} from "@mui/material";
import axios from "axios";

const CategoryCarousel = ({ selectedCategory, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch categories from TheMealDB API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://www.themealdb.com/api/json/v1/1/categories.php"
        );
        setCategories(res.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 3,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: 2,
        mb: 3,
        overflowX: "auto",
        whiteSpace: "nowrap",
        display: "flex",
        gap: 2,
        px: 2,
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {/* Show “All” option */}
      <Chip
        label="All"
        color={selectedCategory === "All" ? "primary" : "default"}
        onClick={() => onCategorySelect("All")}
        sx={{
          px: 2,
          fontWeight: 600,
          cursor: "pointer",
          borderRadius: 2,
        }}
      />

      {/* Category chips */}
      {categories.map((cat) => (
        <Chip
          key={cat.idCategory}
          label={cat.strCategory}
          onClick={() => onCategorySelect(cat.strCategory)}
          avatar={<Avatar src={cat.strCategoryThumb} alt={cat.strCategory} />}
          color={selectedCategory === cat.strCategory ? "primary" : "default"}
          sx={{
            px: 2,
            fontWeight: 600,
            cursor: "pointer",
            borderRadius: 2,
            "&:hover": { backgroundColor: "rgba(255,112,67,0.2)" },
          }}
        />
      ))}
    </Box>
  );
};

export default CategoryCarousel;
