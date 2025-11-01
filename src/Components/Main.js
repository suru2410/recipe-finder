import React, { useState } from "react";
import NavBar from "./NavBar";
import Home from "./Home";
import Favourite from "./Favourite";
import RecipeInstruction from "./RecipeInstruction";
import { Routes, Route } from "react-router-dom";

const Main = () => {
  // 🔹 Centralized states shared with NavBar & Home
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");

  return (
    <>
      {/* 🔸 Zomato-like NavBar */}
      <NavBar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onRegionChange={setSelectedRegion}
      />

      {/* 🔹 Routes */}
      <Routes>
        {/* 🏠 Home Page */}
        <Route
          path="/"
          element={
            <Home
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              selectedRegion={selectedRegion}
            />
          }
        />

        {/* 🍲 Recipe Details */}
        <Route
          path="/RecipeInstruction/:id"
          element={<RecipeInstruction />}
        />

        {/* ❤️ Favourite Recipes */}
        <Route path="/Favourite" element={<Favourite />} />
      </Routes>
    </>
  );
};

export default Main;
