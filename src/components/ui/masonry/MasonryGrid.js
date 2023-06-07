import { Box, Grid } from "@chakra-ui/react";
import MasonryGridItem from "./MasonryGridItem";
import { PhotoVisorProvider } from "@/contexts/PhotoVisorContext";

export default function MasonryGrid({ photos }) {
  return (
    <>
      <Box width={"100%"}>
        <Grid
          templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          gap={4}
          paddingBottom={4}
        >
          <PhotoVisorProvider photos={photos}>
            {photos.map((photo) => (
              <MasonryGridItem key={photo.id} data={photo} />
            ))}
          </PhotoVisorProvider>
        </Grid>
      </Box>
    </>
  );
}
