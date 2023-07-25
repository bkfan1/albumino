import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import { MasonryGridContext } from "@/contexts/MasonryGridContext";
import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";
import { useDisableButtons } from "@/hooks/useDisableButtons";
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

  const { inAlbumPage, isAlbumOwner, fetchAlbumPhotos } =
    useContext(AlbumPageContext);
  const {
    currentVisorPhoto,
    onClose,
    setShowAvailableAlbums,
    setAvailableAlbums,
    setShowCurrentVisorPhotoDetails,
  } = useContext(PhotoVisorContext);

  const { masonryPhotos, setMasonryPhotos } = useContext(MasonryGridContext);

  const { disableButtons, toggleDisableButtons } = useDisableButtons();

  const router = useRouter();
  const { pathname, query } = router;
  const { albumId } = query;

  const toast = useToast();

  const handleDeleteCurrentVisorPhoto = async () => {
    toggleDisableButtons();
    const res = axios.delete(`/api/photos/${currentVisorPhoto.id}`);
    toast.promise(res, {
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

    await res;

    let updatedMasonryPhotos = masonryPhotos.filter(
      (photo) => photo.id !== currentVisorPhoto.id
    );
    if (inAlbumPage) {
      await fetchAlbumPhotos(albumId)
        .then((photos) => {
          updatedMasonryPhotos = photos;
        })
        .catch((error) => {
          toast({
            status: "error",
            title: "An error occurred while fetching album photos",
          });
        });
    }

    setMasonryPhotos(updatedMasonryPhotos);
    onClose();
    toggleDisableButtons();
  };

  const handleRemoveCurrentVisorPhotoFromAlbum = async () => {
    toggleDisableButtons();
    const res = axios.delete(
      `/api/album/${albumId}/photos/${currentVisorPhoto.id}`
    );

    toast.promise(res, {
      loading: { title: "Removing photo from album..." },
      success: { title: "Photo removed from album successfully" },
      error: { title: "Error while removing photo from album" },
    });

    await res;

    let updatedMasonryPhotos = masonryPhotos.filter(
      (photo) => photo.id !== currentVisorPhoto.id
    );

    await fetchAlbumPhotos(albumId)
      .then((photos) => {
        updatedMasonryPhotos = photos;
      })
      .catch((error) => {
        toast({
          status: "error",
          title: "An error occurred while fetching album photos",
        });
      });

    setMasonryPhotos(updatedMasonryPhotos);
    onClose();
    toggleDisableButtons();
  };

  const handleShowAvailableAlbums = async () => {
    try {
      const res = await axios.get(`/api/albums`);
      const albums = res.data.albums;

      setAvailableAlbums(albums);
      setShowAvailableAlbums(true);
    } catch (error) {
      toast({
        status: "error",
        title: "Error while getting available albums.",
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
                  onClick={handleDeleteCurrentVisorPhoto}
                  icon={<BsTrash />}
                  color={"white"}
                  isDisabled={disableButtons}
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
                      <MenuItem
                        onClick={handleShowAvailableAlbums}
                        isDisabled={disableButtons}
                      >
                        Add to album
                      </MenuItem>
                      <MenuItem
                        onClick={handleDeleteCurrentVisorPhoto}
                        isDisabled={disableButtons}
                      >
                        Delete permanently
                      </MenuItem>
                    </>
                  ) : (
                    ""
                  )}
                  {isAlbumOwner || isPhotoOwner ? (
                    <MenuItem
                      onClick={handleRemoveCurrentVisorPhotoFromAlbum}
                      isDisabled={disableButtons}
                    >
                      Remove from album
                    </MenuItem>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                <>
                  <MenuItem
                    onClick={handleShowAvailableAlbums}
                    isDisabled={disableButtons}
                  >
                    Add to album
                  </MenuItem>
                </>
              )}
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </>
  );
}
