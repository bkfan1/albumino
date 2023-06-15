import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";
import {
  Box,
  Checkbox,
  GridItem,
  Image,
  Skeleton,
  Tooltip,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import PhotoVisor from "../visor/PhotoVisor";
import { useIsMounted } from "@/hooks/useIsMounted";

export default function MasonryGridItem({ data }) {
  const {
    onOpen,
    setCurrentPhoto,
    visorPhotos,
    selectedPhotos,
    setSelectedPhotos,
  } = useContext(PhotoVisorContext);
  const { isMounted } = useIsMounted();

  const { url } = data;

  const selected = selectedPhotos.find((photo) => photo.id === data.id);

  const handleClickSelectPhoto = (e) => {
    let found = selectedPhotos.find((photo) => photo.id === data.id);

    if (!found) {
      found = visorPhotos.find((photo) => photo.id === data.id);
      setSelectedPhotos([...selectedPhotos, found]);
      return;
    }

    const index = selectedPhotos.findIndex((photo) => photo.id === data.id);
    const updatedSelectedPhotos = [...selectedPhotos];
    updatedSelectedPhotos.splice(index, 1);

    setSelectedPhotos(updatedSelectedPhotos);
    return;
  };

  return (
    <>
      <GridItem>
        <Box
          position="relative"
          overflow={"hidden"}
          _hover={{
            opacity: !selected ? "90%" : "",
            transition: "100ms ease-in-out",
            cursor: "pointer",
          }}
          opacity={selected ? "80%" : ""}
        >
          <Skeleton isLoaded={isMounted} rounded={"md"}>
            <Tooltip label={selected ? "Unselect this photo" : "Select this photo"}>
              <Checkbox
                onChange={(e) => handleClickSelectPhoto(e)}
                isChecked={selected ? true : false}
                position={"absolute"}
                size={"md"}
                margin={2}
              />
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
