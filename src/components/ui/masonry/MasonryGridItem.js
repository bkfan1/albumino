import {
  Box,
  Checkbox,
  GridItem,
  Image,
  Skeleton,
  Tooltip,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useRouter } from "next/router";
import { MasonryGridContext } from "@/contexts/MasonryGridContext";

const getRandomSkeletonSize = () => {
  const skeletonSizes = ["xs", "sm", "md"];
  const index = Math.floor(Math.random() * 2);

  return skeletonSizes[index];
};

export default function MasonryGridItem({ data, masonryType }) {
  // const {data: session, status} = useSession();
  // const {inAlbumPage} = useContext(AlbumPageContext);

  const { isMounted } = useIsMounted();
  const { id, url, albums } = data;
  const router = useRouter();
  const { query } = router;

  const {
    onOpen,
    masonryPhotos,
    setCurrentVisorPhoto,
    selectedPhotos,
    setSelectedPhotos,
  } = useContext(MasonryGridContext);

  const [showCheckbox, setShowCheckbox] = useState(false);

  const handleToggleVisor = (photo) => {
    setCurrentVisorPhoto(photo);
    onOpen();
  };

  const handleOnSelect = (selectedPhotoId) => {
    const found = selectedPhotos.find((photo) => photo.id === selectedPhotoId);
    const updatedSelectedPhotos = [...selectedPhotos];

    if (found) {
      const index = selectedPhotos.findIndex(
        (photo) => photo.id === selectedPhotoId
      );
      updatedSelectedPhotos.splice(index, 1);
    } else {
      const photo = masonryPhotos.find((photo) => photo.id === selectedPhotoId);
      updatedSelectedPhotos.push(photo);
    }

    setSelectedPhotos(updatedSelectedPhotos);
  };

  const alreadyInAlbum = albums.includes(query.albumId);

  const selected = selectedPhotos.some((photo) => photo.id === id);

  if (!isMounted) {
    return (
      <>
        <Skeleton height={getRandomSkeletonSize()}></Skeleton>
      </>
    );
  }

  return (
    <>
      <GridItem>
        <Box
          position="relative"
          overflow={"hidden"}
          onMouseEnter={() => setShowCheckbox(true)}
          onMouseLeave={() => setShowCheckbox(false)}
          _hover={
            masonryType === "form" && alreadyInAlbum
              ? {}
              : {
                  cursor: "pointer",
                  opacity: "85%",
                  transition: "180ms ease-in-out",
                }
          }
          opacity={masonryType === "form" && alreadyInAlbum ? "70%" : ""}
        >
          <Checkbox
            onChange={() => handleOnSelect(id)}
            isChecked={selected}
            position={"absolute"}
            m={2}
            isDisabled={masonryType === "form" && alreadyInAlbum}
            display={showCheckbox || selected ? "flex" : "none"}
          />

          <Tooltip
            label={
              masonryType === "form" && alreadyInAlbum
                ? "Photo is already on album"
                : ""
            }
          >
            <Image
              src={url}
              alt={"Photo"}
              w="100%"
              h="auto"
              rounded="md"
              onClick={() => handleToggleVisor(data)}
            />
          </Tooltip>
        </Box>
      </GridItem>
    </>
  );
}
