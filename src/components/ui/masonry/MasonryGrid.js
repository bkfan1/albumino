import {
  Box,
  Grid,
  Heading,
  Icon,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import MasonryGridItem from "./MasonryGridItem";
import { useContext } from "react";
import { MasonryGridContext } from "@/contexts/MasonryGridContext";
import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

export default function MasonryGrid({ masonryType }) {
  const { inAlbumPage } = useContext(AlbumPageContext);

  const { masonryPhotos } = useContext(MasonryGridContext);

  return (
    <>
      {inAlbumPage && masonryPhotos.length === 0 && !masonryType ? (
        <VStack width={"100%"}>
          <Image src="/empty_state_album.svg" alt="" />
          <Heading size={"md"} fontWeight={"normal"}>
            Album is empty
          </Heading>
          <Text maxW={"sm"} textAlign={"center"} fontWeight={"bold"}>
            Add or upload photos to album using{" "}
            <Icon as={MdOutlineAddPhotoAlternate} boxSize={6} mx={1} />
            at the navigation bar.
          </Text>
        </VStack>
      ) : (
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
      )}
    </>
  );
}
