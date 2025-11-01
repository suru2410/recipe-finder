import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActionArea,
  CardActions,
  Fab,
  Zoom,
  Modal,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { addToFavourite, removeFromFavourite } from "../Redux/RecipeActions";
import axios from "axios";
import "./Home.css";
import localStreetFoods from "../data/streetFoods.json";


// 🌈 Optional: Rainbow pulse animation (if you kept it)
const RainbowPulse = ({ active }) => {
  return (
    <motion.div
      initial={false}
      animate={
        active
          ? {
              scale: [1, 1.6, 1],
              opacity: [0.8, 0.4, 0],
              boxShadow: [
                "0 0 0px rgba(255,0,0,0.5)",
                "0 0 30px 10px rgba(255,255,0,0.6)",
                "0 0 0px rgba(255,0,0,0)",
              ],
            }
          : {}
      }
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        width: 60,
        height: 60,
        zIndex: 1,
        background:
          "radial-gradient(circle, rgba(255,0,150,0.6) 0%, rgba(255,255,0,0.3) 40%, rgba(0,255,255,0) 70%)",
      }}
    />
  );
};

const Home = ({ searchTerm, selectedCategory, selectedRegion }) => {
  const dispatch = useDispatch();
  const favouriteRecipe = useSelector((state) => state.favouriteRecipe);

  // ✅ Define all required states (fixes your ESLint errors)
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showFavourites, setShowFavourites] = useState(false);
  const [heartBursts, setHeartBursts] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [showVideo, setShowVideo] = useState(false);


  const loadedIds = useRef(new Set()); // avoid duplicates

  // 🔹 Fetch recipes dynamically
  const fetchRecipes = async (loadMore = false) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      let url = "";
      let meals = [];

      // 🔍 Search by name
     if (searchTerm) {
  // 1️⃣ Search online API
  url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;
  const res = await axios.get(url);
  meals = res.data.meals || [];

  // 2️⃣ Search locally in Street Foods JSON
  const localMatches = localStreetFoods.filter((item) =>
    item.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3️⃣ Merge both (avoiding duplicates)
  meals = [
    ...meals,
    ...localMatches.filter(
      (lm) => !meals.some((m) => m.strMeal === lm.strMeal)
    ),
  ];
}


    // 🍗 Filter by category (handle custom ones)
else if (selectedCategory && selectedCategory !== "All") {
  if (selectedCategory === "Street Food") {
    // use your local JSON
    meals = localStreetFoods;
  } else if (selectedCategory === "Indian Food") {
    // fetch only Indian cuisine
    const res = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/filter.php?a=Indian"
    );
    meals = res.data.meals || [];
  } else {
    // default category fetch
    url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;
    const res = await axios.get(url);
    meals = res.data.meals || [];
  }

  meals = meals.sort(() => 0.5 - Math.random()); // shuffle
}
      // 🌍 Filter by region
      else if (selectedRegion && selectedRegion !== "All") {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedRegion}`;
        const res = await axios.get(url);
        meals = res.data.meals || [];
      }

      // 🎲 Default: random recipes
      else {
        const randoms = await Promise.all(
          Array.from({ length: 6 }, () =>
            axios.get("https://www.themealdb.com/api/json/v1/1/random.php")
          )
        );
        meals = randoms.map((r) => r.data.meals[0]);
      }

      // 🧩 Avoid duplicates
      const uniqueMeals = meals.filter(
        (m) => !recipes.some((r) => r.idMeal === m.idMeal)
      );

      setRecipes((prev) => (loadMore ? [...prev, ...uniqueMeals] : uniqueMeals));
    } catch (err) {
      console.error("Error fetching recipes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 🌀 Fetch when filters/search change
  useEffect(() => {
    loadedIds.current.clear();
    fetchRecipes(false);
  }, [searchTerm, selectedCategory, selectedRegion]);


  // 🔄 Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        !isLoading
      ) {
        fetchRecipes(true);
      }
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, recipes]);

  // ❤️ Add or remove favourite
// Toggle favourite and spawn burst at the clicked button
const toggleFavourite = (recipe, e) => {
  const exists = favouriteRecipe.some((r) => r.idMeal === recipe.idMeal);

  // Toggle favourite in redux
  if (exists) {
    dispatch(removeFromFavourite(recipe.idMeal));
  } else {
    dispatch(addToFavourite(recipe));
  }
};
  // 🔍 Open recipe detail
const openRecipeDetails = async (id) => {
  try {
    // 🧠 First check if it's a local Street Food item
    const localItem = localStreetFoods.find((f) => f.idMeal === id);
    if (localItem) {
      setSelectedRecipe(localItem);
      return;
    }

    // 🧾 Otherwise fetch from API
    const res = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    setSelectedRecipe(res.data.meals?.[0]);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, minHeight: "100vh" }}>
     <Typography
  variant="h4"
  align="center"
  sx={{ mb: 3, fontWeight: 600 }}
>
  🍽️{" "}
  {searchTerm
    ? `Results for "${searchTerm}"`
    : selectedCategory !== "All"
    ? `${selectedCategory} Recipes`
    : selectedRegion !== "All"
    ? `${selectedRegion} Recipes`
    : "Popular Dishes"}
</Typography>
      {/* 🧁 Recipes Grid */}
      {isLoading && recipes.length === 0 ? (
        <Typography align="center">Loading recipes...</Typography>
      ) : recipes.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography>No recipes found 😕</Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => fetchRecipes(false)}
          >
            Reload Recipes 🔄
          </Button>
        </Box>
      ) : (
        <Grid
          container
          spacing={3}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(auto-fill, minmax(260px, 1fr))",
              sm: "repeat(auto-fill, minmax(300px, 1fr))",
              md: "repeat(auto-fill, minmax(320px, 1fr))",
            },
            gap: 3,
          }}
        >
          {recipes.map((recipe) => {
  const isFav = favouriteRecipe.some(
    (r) => r.idMeal === recipe.idMeal
  );
  return (
<motion.div key={recipe.idMeal}>
  <Card
    sx={{
      borderRadius: 3,
      overflow: "hidden",
      boxShadow: isFav
        ? "0 0 20px rgba(255, 0, 0, 0.5)"
        : "0 2px 8px rgba(0,0,0,0.15)",
      backgroundColor: isFav ? "#fff5f5" : "#fff",
      transition: "all 0.4s ease",
      position: "relative",
    }}
  >
    
    <CardActionArea onClick={() => openRecipeDetails(recipe.idMeal)}>
      <CardMedia
        component="img"
        height="200"
     image={
  recipe.strMealThumb ||
  recipe.image ||
  "https://via.placeholder.com/400x250?text=No+Image"
}

        alt={recipe.strMeal}
        sx={{
          filter: isFav ? "brightness(1.05)" : "none",
          transition: "0.3s",
        }}
      />
      <CardContent>
        <Typography variant="h6" noWrap>
          {recipe.strMeal}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {recipe.strArea}
        </Typography>
      </CardContent>
    </CardActionArea>

    {/* ❤️ Animated Favourite Button */}
 <CardActions sx={{ justifyContent: "flex-end" }}>
  <Button
  size="small"
  onClick={(e) => toggleFavourite(recipe, e)}
  sx={{ minWidth: 0, position: "relative" }}
>
  {isFav ? (
    <motion.div /* filled heart animation */>
      <FavoriteIcon sx={{ color: "red", fontSize: 32 }} />
    </motion.div>
  ) : (
    <motion.div /* outline heart animation */>
      <FavoriteBorderIcon sx={{ fontSize: 30, color: "#555" }} />
    </motion.div>
  )}
</Button>

</CardActions>

  </Card>
</motion.div>
  );
})}
        </Grid>
      )}

      {/* ❤️ Favourite Popup */}

<Modal open={showFavourites} onClose={() => setShowFavourites(false)}>
  <Box
    sx={{
      background: "#fff",
      borderRadius: 3,
      p: 3,
      maxWidth: 500,
      mx: "auto",
      mt: "8%",
      maxHeight: "80vh",
      overflowY: "auto",
      boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
    }}
  >
    <Typography
      variant="h5"
      sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
    >
      ❤️ Your Liked Recipes
    </Typography>

    {favouriteRecipe.length === 0 ? (
      <Typography align="center" color="text.secondary">
        You haven’t liked any recipes yet.
      </Typography>
    ) : (
      favouriteRecipe.map((r) => (
        <Box
          key={r.idMeal}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            p: 1.2,
            borderRadius: 2,
            background: "#fff8f8",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "#ffeaea",
              transform: "scale(1.02)",
            },
          }}
        >
          {/* Left side: Image + Name */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flex: 1,
              cursor: "pointer",
            }}
            onClick={() => openRecipeDetails(r.idMeal)}
          >
            <img
              src={r.strMealThumb}
              alt={r.strMeal}
              width="60"
              style={{
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, color: "#333" }}
              noWrap
            >
              {r.strMeal}
            </Typography>
          </Box>

          {/* Right side: Animated Remove Button */}
          <motion.div
            key={r.idMeal}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              whileHover={{
                scale: [1, 1.2, 1],
                filter: [
                  "drop-shadow(0 0 0 rgba(255,0,0,0))",
                  "drop-shadow(0 0 10px rgba(255,0,0,0.9))",
                  "drop-shadow(0 0 0 rgba(255,0,0,0))",
                ],
              }}
              whileTap={{
                scale: [1, 0.6, 0],
                opacity: [1, 0.5, 0],
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onClick={() => {
                // Animate heart shrink then remove
                setTimeout(() => dispatch(removeFromFavourite(r.idMeal)), 200);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <FavoriteIcon sx={{ color: "red", fontSize: 30 }} />
            </motion.div>
          </motion.div>
        </Box>
      ))
    )}

    {/* Close button */}
    <Box textAlign="center" mt={3}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowFavourites(false)}
      >
        Close
      </Button>
    </Box>
  </Box>
</Modal>

      {/* 🔝 Scroll-To-Top */}
      <Zoom in={showScrollTop}>
        <Fab
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          color="primary"
          sx={{ position: "fixed", bottom: 20, right: 20 }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>

      {/* ❤️ Floating Favourite Button */}
      <Zoom in={true}>
        <Fab
          color="secondary"
          onClick={() => setShowFavourites(true)}
          sx={{ position: "fixed", bottom: 20, left: 20 }}
        >
          <FavoriteIcon />
        </Fab>
      </Zoom>
<AnimatePresence>
  {selectedRecipe && (
    <>
      {/* Recipe Detail Panel */}
      <motion.div
        className="recipe-detail-popup"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 90, damping: 20 }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "90%",
          maxWidth: "520px",
          height: "100vh",
          background: "#fff",
          boxShadow: "-5px 0 25px rgba(0,0,0,0.25)",
          zIndex: 3000,
          display: "flex",
          flexDirection: "column",
          borderTopLeftRadius: "16px",
          borderBottomLeftRadius: "16px",
        }}
      >
        {/* Scrollable content */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            {selectedRecipe.strMeal}
          </Typography>
          <img
  src={
    selectedRecipe.strMealThumb ||
    selectedRecipe.image || // 👈 local street food image
    "https://via.placeholder.com/400x250?text=No+Image"
  }
  alt={selectedRecipe.strMeal}
  width="100%"
  style={{
    borderRadius: "12px",
    marginBottom: "16px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    objectFit: "cover",
  }}
/>


{/* 🧂 Ingredients Section */}
<Box sx={{ mt: 3 }}>
  <Typography variant="h6" sx={{ mb: 1 }}>
    🧂 Ingredients
  </Typography>

  {selectedRecipe.ingredients ? (
    <ul style={{ marginLeft: "20px" }}>
      {selectedRecipe.ingredients.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  ) : (
    <ul style={{ marginLeft: "20px" }}>
      {Object.keys(selectedRecipe)
        .filter(
          (key) => key.startsWith("strIngredient") && selectedRecipe[key]
        )
        .map((key, i) => (
          <li key={i}>
            {selectedRecipe[key]}{" "}
            {selectedRecipe[
              `strMeasure${key.replace("strIngredient", "")}`
            ] || ""}
          </li>
        ))}
    </ul>
  )}
</Box>



{/* 🎥 YouTube Video (if available) */}
{selectedRecipe.strYoutube && (
  <Box sx={{ mt: 3 }}>

  </Box>
)}
                    {/* 📖 Instructions */}
         {/* 📖 Instructions */}
<Typography sx={{ mt: 2, whiteSpace: "pre-line" }}>
  <strong>Instructions:</strong>
  <br />
  {selectedRecipe.strInstructions}
</Typography>

{/* 🎥 YouTube Video Button */}
{selectedRecipe.strYoutube && (
  <Box sx={{ mt: 3, textAlign: "center" }}>
    <Typography variant="h6" sx={{ mb: 1 }}>
      🎥 Watch Recipe Video
    </Typography>
    <Button
      variant="contained"
      color="error"
      onClick={() => window.open(selectedRecipe.strYoutube, "_blank")}
      sx={{
        textTransform: "none",
        borderRadius: "12px",
        px: 4,
        py: 1,
        fontWeight: 600,
        background: "linear-gradient(90deg, #ff1744, #ff9100)",
      }}
    >
      ▶️ Watch on YouTube
    </Button>
  </Box>
)}

      

        </Box>

        {/* Bottom buttons */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #ddd",
            background: "#fafafa",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
        

          {/* 🌐 View Full Recipe */}
          {selectedRecipe.strSource && (
            <Button
              variant="outlined"
              color="primary"
              href={selectedRecipe.strSource}
              target="_blank"
              rel="noopener noreferrer"
            >
              🌐 Full Recipe
            </Button>
          )}

          {/* ❌ Close */}
          <Button
            variant="contained"
            color="error"
            onClick={() => setSelectedRecipe(null)}
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
        </Box>
      </motion.div>

      {/* 🎬 YouTube Modal */}
      <Modal open={showVideo} onClose={() => setShowVideo(false)}>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "black",
            p: 2,
            borderRadius: 2,
            boxShadow: "0 0 30px rgba(0,0,0,0.5)",
            width: "90%",
            maxWidth: 720,
            aspectRatio: "16/9",
          }}
        >
          <iframe
            width="100%"
            height="100%"
            src={selectedRecipe.strYoutube.replace("watch?v=", "embed/")}
            title={selectedRecipe.strMeal}
            allowFullScreen
            style={{ border: "none", borderRadius: "8px" }}
          />
        </Box>
      </Modal>
    </>
  )}
</AnimatePresence>

    </Box>
  );
};

export default Home;
