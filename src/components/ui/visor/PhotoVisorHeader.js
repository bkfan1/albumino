import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";
import {
  ButtonGroup,
  Flex,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { BsInfoCircle, BsThreeDots, BsTrash, BsX } from "react-icons/bs";

export default function PhotoVisorHeader({}) {
  const { data: session, status } = useSession();

  const { inAlbumPage, isAlbumOwner } = useContext(AlbumPageContext);

  const {
    visorPhotos,
    setVisorPhotos,
    onClose,
    currentPhoto,
    setCurrentPhoto,
    showAvailableAlbums,
    setShowAvailableAlbums,
    setAvailableAlbums,
  } = useContext(PhotoVisorContext);

  const router = useRouter();
  const { query } = router;
  const { albumId } = query;

  const toast = useToast();

  const handleDeletePhoto = async () => {
    try {
      const deletePromise = axios.delete(`/api/photo/${currentPhoto.id}`);
      toast.promise(deletePromise, {
        loading: {
          title: "Deleting Photo...",
        },
        success: {
          title: "Photo deleted successfully",
        },
        error: {
          title: "Error while deleting Photo",
        },
      });

      await deletePromise;

      const updatedVisorPhotos = visorPhotos.filter(
        (photo) => photo.id !== currentPhoto.id
      );
      setVisorPhotos(updatedVisorPhotos);
      onClose();
    } catch (error) {
      toast({
        status: "error",
        title: "Error",
        description: "An error occurred while attempting to delete photo.",
        duration: 5000,
      });
    }
  };

  const handleRemoveFromAlbum = async () => {
    try {
      const removePromise = axios.delete(
        `/api/album/${albumId}/photos/${currentPhoto.id}`
      );

      toast.promise(removePromise, {
        loading: { title: "Removing photo from album..." },
        success: { title: "Photo removed from album successfully" },
        error: { title: "Error while removing photo from album" },
      });

      await removePromise;

      const updatedVisorPhotos = [
        ...visorPhotos.filter((photo) => photo.id !== currentPhoto.id),
      ];
      setVisorPhotos(updatedVisorPhotos);
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        status: "error",
        title: "Error while removing photo from album",
      });
    }
  };

  const handleClickAddToAlbum = async () => {
    try {
      const res = await axios.get(`/api/albums`);

      setShowAvailableAlbums(true);
      setAvailableAlbums(res.data.albums);
    } catch (error) {
      toast({
        status: "error",
        title: "Error while fetching available albums.",
      });
    }
  };

  const isCurrentPhotoOwner =
    currentPhoto.author_account_id === session.user.accountId;

  return (
    <>
      <Flex
        as="header"
        position="fixed"
        justifyContent={"space-between"}
        zIndex={6}
        top={0}
        left={0}
        right={0}
        padding={4}
        className="photoVisor__header"
      >
        <ButtonGroup variant={"link"}>
          <Tooltip label="Close Visor">
            <IconButton
              icon={<BsX />}
              fontSize={"24px"}
              color="white"
              rounded={"full"}
              onClick={onClose}
            />
          </Tooltip>
        </ButtonGroup>

        <ButtonGroup variant={"link"} spacing={4}>
          <Tooltip label="Details">
            <IconButton
              icon={
                <BsInfoCircle
                  fontSize={"24px"}
                  color="white"
                  rounded={"full"}
                />
              }
            />
          </Tooltip>
          {!inAlbumPage ? (
            <Tooltip label="Delete this photo">
              <IconButton
                icon={<BsTrash />}
                fontSize={"24px"}
                color="white"
                rounded={"full"}
                title="Delete this photo permanently"
                onClick={handleDeletePhoto}
              />
            </Tooltip>
          ) : (
            ""
          )}

          <Menu>
            <Tooltip label="More options">
              <MenuButton
                as={Button}
                fontSize={"24px"}
                color="white"
                rounded={"full"}
              >
                <BsThreeDots />
              </MenuButton>
            </Tooltip>

            <MenuList>
              <MenuItem>Download</MenuItem>

              {isCurrentPhotoOwner ? (
                <>
                  <MenuItem onClick={handleClickAddToAlbum}>
                    Add to album
                  </MenuItem>

                  <MenuItem onClick={handleDeletePhoto}>
                    Delete permanently
                  </MenuItem>
                </>
              ) : (
                ""
              )}

              {inAlbumPage ? (
                <>
                  {isAlbumOwner || isCurrentPhotoOwner ? (
                    <MenuItem onClick={handleRemoveFromAlbum}>
                      Remove from album
                    </MenuItem>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}
            </MenuList>
          </Menu>
        </ButtonGroup>
      </Flex>
    </>
  );
}
