import { Box, Grid, GridItem, Image, Modal, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import PhotosGridItem from "./PhotosGridItem";

export default function PhotosGrid({ photos }) {
  return (
    <Box>
      <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
        {photos.map((photo) => (
          <PhotosGridItem key={photo.id} data={photo} />
        ))}
      </Grid>
    </Box>
  );
}
