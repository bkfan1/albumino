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
import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";
import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import { useSession } from "next-auth/react";

export default function MasonryGridItem({ data, masonryType }) {
  const {data:session, status} = useSession();

  const {inAlbumPage} = useContext(AlbumPageContext);
  const { isMounted } = useIsMounted();
  const { id, url, albums } = data;

  const router = useRouter();
  const { query } = router;

  const { onOpen, setCurrentVisorPhoto } = useContext(PhotoVisorContext);

  const { masonryPhotos, selectedPhotos, setSelectedPhotos } =
    useContext(MasonryGridContext);

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
  const ownsPhoto = status === "authenticated" ?  (inAlbumPage ? (session.user.accountId === data.author.id) : true ) : false;
  return (
    <>
      {isMounted ? (
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
            {ownsPhoto ? <Checkbox
              onChange={() => handleOnSelect(id)}
              isChecked={selected}
              position={"absolute"}
              m={2}
              isDisabled={masonryType === "form" && alreadyInAlbum}
              display={showCheckbox || selected ? "flex" : "none"}
            /> : ""}

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
                onClick={() =>
                  masonryType === "form" || selected ? null : handleToggleVisor(data)
                }
              />
            </Tooltip>
          </Box>
        </GridItem>
      ) : (
        <Skeleton height={"sm"} />
      )}
    </>
  );
}
