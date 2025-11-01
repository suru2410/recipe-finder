import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { removeFromFavourite } from "../Redux/RecipeActions";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, when: "beforeChildren" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const Favourite = () => {
  const dispatch = useDispatch();
  const favouriteRecipe = useSelector((state) => state.favouriteRecipe);

  const handleRemove = (id) => {
    dispatch(removeFromFavourite(id));
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, minHeight: "100vh" }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ mb: 4, fontWeight: 600, color: "#ff6f61" }}
      >
        ❤️ Your Favourite Recipes
      </Typography>

      {favouriteRecipe.length === 0 ? (
        <Typography
          align="center"
          sx={{ mt: 5, color: "text.secondary", fontSize: "1.2rem" }}
        >
          You haven’t added any favourites yet.  
          <Link to="/" style={{ color: "#ff6f61", textDecoration: "none" }}>
            Explore Recipes 🍳
          </Link>
        </Typography>
      ) : (
        <AnimatePresence>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Grid
              container
              spacing={3}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(auto-fill, minmax(280px, 1fr))",
                  sm: "repeat(auto-fill, minmax(300px, 1fr))",
                  md: "repeat(auto-fill, minmax(320px, 1fr))",
                },
                gap: 3,
                alignItems: "stretch",
              }}
            >
              {favouriteRecipe.map((recipe) => (
                <motion.div key={recipe.id} variants={cardVariants}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: "0px 10px 25px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={recipe.image_url}
                      alt={recipe.title}
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h6"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {recipe.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {recipe.publisher}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "space-between" }}>
                      <Button
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleRemove(recipe.id)}
                      >
                        Remove
                      </Button>
                      <Button
                        component={Link}
                        to={`/RecipeInstruction/${recipe.id}`}
                        variant="contained"
                        color="primary"
                      >
                        View
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              ))}
            </Grid>
          </motion.div>
        </AnimatePresence>
      )}
    </Box>
  );
};

export default Favourite;
