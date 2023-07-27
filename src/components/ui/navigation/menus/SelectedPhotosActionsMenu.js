import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import { MasonryGridContext } from "@/contexts/MasonryGridContext";
import { useDisableButtons } from "@/hooks/useDisableButtons";
import { useIsMounted } from "@/hooks/useIsMounted";
import {
  ButtonGroup,
  HStack,
  IconButton,
  Skeleton,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { BsTrash } from "react-icons/bs";
import { HiMinusCircle } from "react-icons/hi";

export default function SelectedPhotosActionsMenu({}) {
  const {
    masonryPhotos,
    setMasonryPhotos,
    selectedPhotos,
    setSelectedPhotos,
    setDeletingSelectedPhotos,
  } = useContext(MasonryGridContext);

  const { data: session, status } = useSession();

  const { inAlbumPage, isAlbumOwner, fetchAlbumPhotos } =
    useContext(AlbumPageContext);

  const { disableButtons, toggleDisableButtons } = useDisableButtons();

  const { isMounted } = useIsMounted();

  const toast = useToast();
  const router = useRouter();

  const { query } = router;
  const { albumId } = query;

  const handleDeleteSelectedPhotos = async () => {
    setDeletingSelectedPhotos(true);
    toggleDisableButtons();

    const promises = selectedPhotos.map(async (photo) => {
      return axios.delete(`/api/photos/${photo.id}`);
    });

    toast({
      status: "loading",
      title: "Deleting selected photos...",
    });

    await Promise.all(promises)
      .then(() => {
        toast({
          status: "success",
          title: "Photos removed successfully",
        });
        toggleDisableButtons();
        setSelectedPhotos([]);
        setDeletingSelectedPhotos(false);
      })
      .catch((error) => {
        toast({
          status: "error",
          title:
            "An error occurred while trying to remove the selected photos from album",
        });
        toggleDisableButtons();
        setDeletingSelectedPhotos(false);
      });

    let updatedMasonryPhotos = masonryPhotos.filter(
      (photo) => !selectedPhotos.includes(photo)
    );

    if (inAlbumPage) {
      await fetchAlbumPhotos(albumId)
        .then((photos) => {
          updatedMasonryPhotos = photos;
        })
        .catch((error) => {
          toast({
            status: "warning",
            title: "An error occurred while fetching album photos",
          });
        });
    }

    setMasonryPhotos(updatedMasonryPhotos);
  };

  const handleRemoveSelectedPhotosFromAlbum = async () => {
    setDeletingSelectedPhotos(true);
    toggleDisableButtons();
    const promises = selectedPhotos.map(async (photo) => {
      return axios.delete(`/api/album/${albumId}/photos/${photo.id}`);
    });

    toast({
      status: "loading",
      title: "Removing photos from album...",
    });

    await Promise.all(promises)
      .then(async (res) => {
        toast({
          status: "success",
          title: "Photos removed succesfully from album",
        });
        toggleDisableButtons();
        setSelectedPhotos([]);
        setDeletingSelectedPhotos(false);
      })
      .catch((error) => {
        console.log(error);
        toast({
          status: "error",
          title: "An error occurred while trying to remove photos from album",
        });
        toggleDisableButtons();
        setDeletingSelectedPhotos(false);
      });

    let updatedMasonryPhotos = [];

    await fetchAlbumPhotos(albumId)
      .then((photos) => {
        updatedMasonryPhotos = photos;
      })
      .catch((error) => {
        toast({
          status: "error",
          title: "An error occurred while trying to remove photos from album",
        });
      });

    setMasonryPhotos(updatedMasonryPhotos);
  };

  return (
    <>
      <Skeleton isLoaded={isMounted}>
        <HStack>
          <ButtonGroup
            colorScheme="red"
            variant={"ghost"}
            isDisabled={disableButtons}
          >
            {!inAlbumPage ? (
              <>
                <Tooltip label={"Delete selected photos"}>
                  <IconButton
                    onClick={handleDeleteSelectedPhotos}
                    icon={<BsTrash />}
                  />
                </Tooltip>
              </>
            ) : (
              <>
                {selectedPhotos.every(
                  (photo) => photo.author.id === session.user.accountId
                ) ? (
                  <>
                    <Tooltip label="Remove selected photos">
                      <IconButton
                        onClick={handleRemoveSelectedPhotosFromAlbum}
                        icon={<HiMinusCircle />}
                      />
                    </Tooltip>

                    <Tooltip label="Delete selected photos">
                      <IconButton
                        onClick={handleDeleteSelectedPhotos}
                        icon={<BsTrash />}
                      />
                    </Tooltip>
                  </>
                ) : isAlbumOwner ? (
                  <Tooltip label="Remove selected photos">
                    <IconButton
                      onClick={handleRemoveSelectedPhotosFromAlbum}
                      icon={<HiMinusCircle />}
                    />
                  </Tooltip>
                ) : (
                  ""
                )}
              </>
            )}
          </ButtonGroup>
        </HStack>
      </Skeleton>
    </>
  );
}
