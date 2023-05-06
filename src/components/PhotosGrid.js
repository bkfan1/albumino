import { Box, Grid } from "@chakra-ui/react";
import PhotosGridItem from "./PhotosGridItem";

export default function PhotosGrid({ photos }) {
  return (
    <Box width={"100%"}>
      <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
        {photos.map((photo) => (
          <PhotosGridItem key={photo.id} data={photo} />
        ))}
      </Grid>
    </Box>
  );
}
