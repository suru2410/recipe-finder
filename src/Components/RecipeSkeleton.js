import React from "react";
import { Grid, Card, CardContent, Skeleton } from "@mui/material";

const RecipeSkeleton = () => {
  const skeletonArray = Array.from({ length: 8 });

  return (
    <Grid
      container
      spacing={3}
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 3,
      }}
    >
      {skeletonArray.map((_, index) => (
        <Card key={index} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Skeleton
            variant="rectangular"
            height={180}
            animation="wave"
            sx={{ bgcolor: "action.hover" }}
          />
          <CardContent>
            <Skeleton
              variant="text"
              height={28}
              width="80%"
              animation="wave"
            />
            <Skeleton
              variant="text"
              height={20}
              width="50%"
              animation="wave"
            />
          </CardContent>
        </Card>
      ))}
    </Grid>
  );
};

export default RecipeSkeleton;
