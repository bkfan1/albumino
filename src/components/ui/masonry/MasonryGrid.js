import { Box, Grid } from "@chakra-ui/react";
import MasonryGridItem from "./MasonryGridItem";
import { useContext } from "react";
import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";

export default function MasonryGrid({}) {
  const { visorPhotos } = useContext(PhotoVisorContext);

  return (
    <>
      <Box width={"100%"}>
        <Grid
          templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          gap={4}
          paddingBottom={4}
        >
          {visorPhotos.map((photo) => (
            <MasonryGridItem key={photo.id} data={photo} />
          ))}
        </Grid>
      </Box>
    </>
  );
}
