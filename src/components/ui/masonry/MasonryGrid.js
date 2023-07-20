import { Box, Grid } from "@chakra-ui/react";
import MasonryGridItem from "./MasonryGridItem";
import { useContext, useEffect, useState } from "react";
import { MasonryGridContext } from "@/contexts/MasonryGridContext";

export default function MasonryGrid({ masonryType }) {
  const {masonryPhotos} = useContext(MasonryGridContext);

  return (
    <>
      <Box width={"100%"}>
        <Grid
          templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          gap={4}
          paddingBottom={4}
        >
            {masonryPhotos.map((photo) => (
              <MasonryGridItem
                key={photo.id}
                data={photo}
                masonryType={masonryType}
              />
            ))}
        </Grid>
      </Box>
    </>
  );
}
