import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";
import { Box, Checkbox, GridItem, Image, Tooltip } from "@chakra-ui/react";
import { useContext } from "react";
import PhotoVisor from "./PhotoVisor";

export default function PhotosGridItem({ data }) {
  const { onOpen, setCurrentPhoto } = useContext(PhotoVisorContext);
  const { url } = data;
  return (
    <>
      <GridItem>
        <Box
          position="relative"
          overflow={"hidden"}
          _hover={{
            opacity: "90%",
            transition: "ease-in-out all",
            cursor: "pointer",
          }}
        >
          <Tooltip label="Select this photo">
            <Checkbox position={"absolute"} size={"md"} margin={2} />
          </Tooltip>
          <Image
            src={url}
            alt={"Photo"}
            w="100%"
            h="auto"
            borderRadius="md"
            onClick={() => {
              setCurrentPhoto(data);
              onOpen();
            }}
          />
        </Box>
      </GridItem>
      <PhotoVisor />
    </>
  );
}
