import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import { MasonryGridContext } from "@/contexts/MasonryGridContext";
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
import { BsTrash, BsXLg } from "react-icons/bs";
import { HiMinusCircle } from "react-icons/hi";
import { MdUndo } from "react-icons/md";

export default function SelectedPhotosActionsMenu({}) {
  const { masonryPhotos, setMasonryPhotos, selectedPhotos, setSelectedPhotos } =
    useContext(MasonryGridContext);

  const { data: session, status } = useSession();

  const { inAlbumPage, isAlbumOwner } = useContext(AlbumPageContext);
  const { isMounted } = useIsMounted();
  const toast = useToast();
  const router = useRouter();

  const { query } = router;
  const { albumId } = query;

  const handleDeleteSelectedPhotos = async () => {
    const promises = selectedPhotos.map(async (photo) => {
      return axios.delete(`/api/photo/${photo.id}`);
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
      })
      .catch(() => {
        toast({
          status: "error",
          title:
            "An error occurred while trying to remove the selected photos from album",
        });
      });

    setSelectedPhotos([]);

    const updatedMasonryPhotos = masonryPhotos.filter(
      (photo) => !selectedPhotos.includes(photo)
    );

    setMasonryPhotos(updatedMasonryPhotos);
  };

  const handleRemoveSelectedPhotosFromAlbum = async () => {
    const promises = selectedPhotos.map(async (photo) => {
      return axios.delete(`/api/album/${albumId}/photos/${photo.id}`);
    });

    toast({
      status: "loading",
      title: "Removing photos from album...",
    });

    await Promise.all(promises)
      .then((res) => {
        toast({
          status: "success",
          title: "Photos removed succesfully from album",
        });

        setSelectedPhotos([]);

        const updatedMasonryPhotos = masonryPhotos.filter(
          (photo) => !selectedPhotos.includes(photo)
        );

        setMasonryPhotos(updatedMasonryPhotos);
      })
      .catch((error) => {
        toast({
          status: "error",
          title: "An error occurred while trying to remove photos from album",
        });
      });
  };

  return (
    <>
      <Skeleton isLoaded={isMounted}>
        <HStack>
          <ButtonGroup colorScheme="red" variant={"ghost"}>
          {!inAlbumPage ? (
            <>
              
                <Tooltip label="Delete selected photos">
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
