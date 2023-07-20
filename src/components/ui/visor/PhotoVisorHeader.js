import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import { MasonryGridContext } from "@/contexts/MasonryGridContext";
import {
  ButtonGroup,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
  Tooltip,
  Icon,
  HStack,
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
    masonryPhotos,
    setMasonryPhotos,
    currentVisorPhoto,
    onClose,
    setShowAvailableAlbums,
    setAvailableAlbums,
    showCurrentVisorPhotoDetails,
    setShowCurrentVisorPhotoDetails,
  } = useContext(MasonryGridContext);

  const router = useRouter();
  const { pathname, query } = router;
  const { albumId } = query;

  const toast = useToast();

  const handleDeletePhoto = async () => {
    const deletePromise = axios.delete(`/api/photo/${currentVisorPhoto.id}`);
    toast.promise(deletePromise, {
      loading: {
        title: "Deleting photo...",
      },
      success: {
        title: "Photo deleted successfully",
      },
      error: {
        title: "Error while deleting Photo",
      },
    });

    const updatedMasonryPhotos = [
      ...masonryPhotos.filter((photo) => photo.id !== currentVisorPhoto.id),
    ];

    setMasonryPhotos(updatedMasonryPhotos);
    onClose();
  };

  const handleRemoveFromAlbum = async () => {
    const removePromise = axios.delete(
      `/api/album/${albumId}/photos/${currentVisorPhoto.id}`
    );

    toast.promise(removePromise, {
      loading: { title: "Removing photo from album..." },
      success: { title: "Photo removed from album successfully" },
      error: { title: "Error while removing photo from album" },
    });

    const updatedMasonryPhotos = [
      ...masonryPhotos.filter((photo) => photo.id !== currentVisorPhoto.id),
    ];

    setMasonryPhotos(updatedMasonryPhotos);
    onClose();
  };

  const handleShowAvailableAlbums = async () => {
    try {
      const res = await axios.get(`/api/albums`);

      setAvailableAlbums(res.data.albums);
      setShowAvailableAlbums(true);
    } catch (error) {
      toast({
        status: "error",
        title: "Error while fetching available albums.",
      });
    }
  };

  const isPhotoOwner =
    pathname === "/photos"
      ? true
      : session.user.accountId === currentVisorPhoto.author.id;

  return (
    <>
      <Flex
        as="header"
        position="fixed"
        justifyContent={"space-between"}
        zIndex={8}
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

        <HStack gap={5}>
          <ButtonGroup variant={"link"} size={"lg"}>
            <Tooltip label="Info">
              <IconButton
                onClick={() => setShowCurrentVisorPhotoDetails(true)}
                icon={<BsInfoCircle />}
                color={"white"}
              />
            </Tooltip>
            {!inAlbumPage ? (
              <Tooltip label="Delete permanently">
                <IconButton
                  onClick={handleDeletePhoto}
                  icon={<BsTrash />}
                  color={"white"}
                />
              </Tooltip>
            ) : (
              ""
            )}
          </ButtonGroup>

          <Menu>
            <MenuButton>
              <Icon as={BsThreeDots} color={"white"} />
            </MenuButton>

            <MenuList>
              {inAlbumPage ? (
                <>
                  {isPhotoOwner ? (
                    <>
                      <MenuItem onClick={handleShowAvailableAlbums}>
                        Add to album
                      </MenuItem>
                      <MenuItem onClick={handleDeletePhoto}>
                        Delete permanently
                      </MenuItem>
                    </>
                  ) : (
                    ""
                  )}
                  {isAlbumOwner || isPhotoOwner ? (
                    <MenuItem onClick={handleRemoveFromAlbum}>
                      Remove from album
                    </MenuItem>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                <>
                  <MenuItem onClick={handleShowAvailableAlbums}>
                    Add to album
                  </MenuItem>
                  <MenuItem>Download</MenuItem>
                </>
              )}
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </>
  );
}
