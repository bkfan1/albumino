import { Flex, HStack, IconButton, useToast } from "@chakra-ui/react";
import NavbarBrand from "./NavbarBrand";
import { useRouter } from "next/router";
import { BsArrowLeft } from "react-icons/bs";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useContext } from "react";
import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import UserNavbarMenu from "./UserNavbarMenu";
import AlbumNavbarMenu from "./AlbumNavbarMenu";
import UploadPhotosHomeForm from "../forms/UploadPhotosHomeForm";
import AlbumUploadPhotosNavbarMenu from "./AlbumUploadPhotosNavbarMenu";

export default function Navbar() {
  const { data: session, status } = useSession();

  const { inAlbumPage } = useContext(AlbumPageContext);

  const router = useRouter();
  const { pathname, query } = router;
  const { albumId } = query;

  const toast = useToast();

  const handleDeleteAlbum = async () => {
    try {
      const deletePromise = axios.delete(`/api/album/${albumId}`);

      toast.promise(deletePromise, {
        loading: { title: "Deleting album..." },
        success: { title: "Album deleted successfully" },

        error: { title: "An error occurred while trying to delete album" },
      });

      await deletePromise;

      router.push("/albums/");
    } catch (error) {
      toast({
        status: "error",
        title: "Error",
        description: "An error occurred while trying to delete album",
      });
    }
  };

  const handleRemoveSelectedPhotosFromAlbum = async () => {
    try {
      const promises = selectedPhotos.map(async (selectedPhoto) => {
        return axios.delete(`/api/album/${albumId}/photos/${selectedPhoto.id}`);
      });

      toast({
        status: "loading",
        title: `Removing selected photo${
          selectedPhotos.length > 1 ? "s" : ""
        } from album...`,
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

      const updatedMasonryPhotos = masonryPhotos.filter(
        (photo) => !selectedPhotos.includes(photo)
      );

      updateMasonryPhotos(updatedMasonryPhotos);

      updateSelectedPhotos([]);

      // onClose();
    } catch (error) {
      toast({
        status: "error",
        title: "An error occurred while trying to delete photos",
      });
    }
  };

  const handleLeaveAlbum = async () => {
    try {
      const leavePromise = axios.delete(
        `/api/album/${albumId}/contributors/${session.user.accountId}`
      );

      toast.promise(leavePromise, {
        loading: { title: "Leaving album..." },
        success: { title: "You left the album successfully" },
        error: { title: "An error occurred while trying to leave the album" },
      });

      await leavePromise;

      router.push("/");
    } catch (error) {
      toast({
        status: "error",
        title: "An error occurred while trying to leave the album",
      });
    }
  };

  const hideNavbarItems = pathname === "/album/create";

  return (
    <>
      <Flex
        as={"nav"}
        width={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
        paddingX={4}
        paddingY={2}
        borderBottom={inAlbumPage || hideNavbarItems ? "0" : "1px"}
        borderBottomColor={"#edf2f7"}
      >
        <HStack className="navbar__brandArea">
          {inAlbumPage || hideNavbarItems ? (
            <IconButton
              onClick={() => {
                router.back();
              }}
              icon={<BsArrowLeft />}
              rounded={"full"}
              variant={"ghost"}
            />
          ) : (
            <NavbarBrand />
          )}
        </HStack>

        {!hideNavbarItems ? (
          <HStack gap={6}>
            {inAlbumPage ? (
              <>
                <AlbumUploadPhotosNavbarMenu />
                <AlbumNavbarMenu />
              </>
            ) : (
              <>
                <UploadPhotosHomeForm />

                <UserNavbarMenu />
              </>
            )}
          </HStack>
        ) : (
          ""
        )}
      </Flex>
    </>
  );
}
