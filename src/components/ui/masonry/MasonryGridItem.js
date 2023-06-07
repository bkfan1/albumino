import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";
import {
  Box,
  Checkbox,
  GridItem,
  Image,
  Skeleton,
  Tooltip,
} from "@chakra-ui/react";
import { useContext } from "react";
import PhotoVisor from "../visor/PhotoVisor";
import { useIsMounted } from "@/hooks/useIsMounted";

export default function MasonryGridItem({ data }) {
  const { onOpen, setCurrentPhoto } = useContext(PhotoVisorContext);
  const { url } = data;

  const { isMounted } = useIsMounted();

  return (
    <>
      <GridItem>
        <Box
          position="relative"
          overflow={"hidden"}
          _hover={{
            opacity: "90%",
            transition: "100ms ease-in-out",
            cursor: "pointer",
          }}
        >
          <Skeleton isLoaded={isMounted} rounded={"md"}>
            <Tooltip label="Select this photo">
              <Checkbox position={"absolute"} size={"md"} margin={2} />
            </Tooltip>
            <Image
              src={url}
              alt={"Photo"}
              w="100%"
              h="auto"
              rounded="md"
              onClick={() => {
                setCurrentPhoto(data);
                onOpen();
              }}
            />
          </Skeleton>
        </Box>
      </GridItem>
      <PhotoVisor />
    </>
  );
}
