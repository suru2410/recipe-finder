import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Fab,
  Zoom,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addToFavourite, removeFromFavourite } from "../Redux/RecipeActions";
import { Link } from "react-router-dom";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavouriteDrawer from "./FavouriteDrawer";

const Home = ({ searchTerm, selectedCategory, selectedRegion }) => {
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favouriteRecipe || []);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showFavDrawer, setShowFavDrawer] = useState(false);
  const [regions, setRegions] = useState([]);

  // fetch regions dynamically
  const fetchRegions = async () => {
    try {
      const res = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
      );
      setRegions(res.data.meals || []);
    } catch (err) {
      console.error("Error loading regions", err);
    }
  };

  // fetch recipes
  const fetchRecipes = async (reset = false) => {
    setLoading(true);
    try {
      let url = "";
      if (searchTerm) {
        url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;
      } else if (selectedCategory && selectedCategory !== "All") {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;
      } else if (selectedRegion && selectedRegion !== "All") {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedRegion}`;
      } else {
        url = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;
      }

      const res = await axios.get(url);
      const data = res.data.meals || [];
      setRecipes((prev) => (reset ? data : [...prev, ...data]));
    } catch (error) {
      console.error("Error fetching recipes", error);
    }
    setLoading(false);
  };

  // infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !loading
      ) {
        setPage((p) => p + 1);
      }
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    fetchRecipes(true);
    // eslint-disable-next-line
  }, [searchTerm, selectedCategory, selectedRegion]);

  useEffect(() => {
    if (page > 1 && !searchTerm) {
      fetchRecipes();
    }
    // eslint-disable-next-line
  }, [page]);

  const handleFavouriteToggle = (recipe) => {
    const exists = favourites.some((f) => f.idMeal === recipe.idMeal);
    if (exists) {
      dispatch(removeFromFavourite(recipe.idMeal));
    } else {
      dispatch(
        addToFavourite({
          id: recipe.idMeal,
          title: recipe.strMeal,
          image_url: recipe.strMealThumb,
        })
      );
    }
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Dynamic Region Filter */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ width: "100%", textAlign: "center" }}>
          🌍 Explore by Region
        </Typography>
        {regions.map((r) => (
          <Box
            key={r.strArea}
            onClick={() => fetchRecipes(true, r.strArea)}
            sx={{
              cursor: "pointer",
              px: 2,
              py: 1,
              borderRadius: 2,
              background:
                selectedRegion === r.strArea ? "#ff7043" : "#f5f5f5",
              color: selectedRegion === r.strArea ? "white" : "black",
              transition: "0.3s",
              "&:hover": { background: "#ffe0b2" },
            }}
          >
            {r.strArea}
          </Box>
        ))}
      </Box>

      {/* Recipe Grid */}
      {loading && recipes.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : recipes.length === 0 ? (
        <Typography textAlign="center" sx={{ mt: 5 }}>
          No recipes found 🍽️
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {recipes.map((recipe, idx) => {
            const isFav = favourites.some((f) => f.id === recipe.idMeal);
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={`${recipe.idMeal}-${idx}`}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                    position: "relative",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.03)" },
                    border: isFav ? "2px solid #ff7043" : "none",
                  }}
                >
                  <Link
                    to={`/RecipeInstruction/${recipe.idMeal}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <CardMedia
                      component="img"
                      image={recipe.strMealThumb}
                      alt={recipe.strMeal}
                      height="200"
                    />
                    <CardContent>
                      <Typography variant="subtitle1" noWrap>
                        {recipe.strMeal}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                      >
                        {recipe.strCategory}
                      </Typography>
                    </CardContent>
                  </Link>
                  <IconButton
                    onClick={() => handleFavouriteToggle(recipe)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: isFav ? "red" : "grey",
                      background: "white",
                      "&:hover": { background: "#ffe0b2" },
                    }}
                  >
                    {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Loader while fetching more */}
      {loading && recipes.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Back to Top Button */}
      <Zoom in={showScrollTop}>
        <Fab
          color="primary"
          size="small"
          onClick={handleScrollTop}
          sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1200 }}
        >
          <ArrowUpwardIcon />
        </Fab>
      </Zoom>

      {/* Favourites Drawer */}
      <Zoom in={true}>
        <Fab
          color="secondary"
          onClick={() => setShowFavDrawer(true)}
          sx={{ position: "fixed", bottom: 80, right: 16, zIndex: 1200 }}
        >
          <FavoriteIcon />
        </Fab>
      </Zoom>

      <FavouriteDrawer
        open={showFavDrawer}
        onClose={() => setShowFavDrawer(false)}
      />
    </Box>
  );
};

export default Home;
