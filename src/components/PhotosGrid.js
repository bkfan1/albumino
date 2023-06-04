import { Box, Grid } from "@chakra-ui/react";
import PhotosGridItem from "./PhotosGridItem";
import { PhotoVisorProvider } from "@/contexts/PhotoVisorContext";

export default function PhotosGrid({ photos }) {
  return (
    <>
    <Box width={"100%"}>
      <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4} paddingBottom={4}>
      
      <PhotoVisorProvider photos={photos}>
        {photos.map((photo) => (
          <PhotosGridItem key={photo.id} data={photo} />
        ))}
        </PhotoVisorProvider>
      </Grid>
    
    </Box>
    </>
  );
}
