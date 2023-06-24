import {
  Avatar,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import SearchForm from "../forms/SearchForm";
import NavbarBrand from "./NavbarBrand";
import { useRouter } from "next/router";
import {
  BsArrowLeft,
  BsDashCircle,
  BsDownload,
  BsGearFill,
  BsPlusLg,
  BsThreeDots,
  BsTrash,
  BsTrashFill,
  BsXLg,
} from "react-icons/bs";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { MdLogout } from "react-icons/md";
import { useIsMounted } from "@/hooks/useIsMounted";
import UploadPhotosForm from "../forms/UploadPhotosForm";
import { useContext } from "react";
import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { inAlbumPage, isAlbumOwner, showAlbumSettings, setShowAlbumSettings } =
    useContext(AlbumPageContext);
  const {
    // onClose,
    visorPhotos,
    setVisorPhotos,
    selectedPhotos,
    setSelectedPhotos,
  } = useContext(PhotoVisorContext);
  const { isMounted } = useIsMounted();

  const router = useRouter();
  const { pathname, query } = router;
  const { albumId } = query;

  const toast = useToast();

  const hideNavbarBrand = pathname === "/album/create";

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

  const handleDeleteSelectedPhotos = async () => {
    try {
      const promises = selectedPhotos.map(async (selectedPhoto) => {
        return axios.delete(`/api/photo/${selectedPhoto.id}`);
      });

      toast({
        status: "loading",
        title: `Deleting selected photo${
          selectedPhotos.length > 1 ? "s" : ""
        }...`,
      });

      await Promise.all(promises)
        .then(() => {
          toast({
            status: "success",
            title: "Photos deleted successfully",
          });
        })
        .catch(() => {
          toast({
            status: "error",
            title:
              "An error occurred while trying to delete the selected photos",
          });
        });

      const updatedVisorPhotos = visorPhotos.filter(
        (photo) => !selectedPhotos.includes(photo)
      );

      setVisorPhotos(updatedVisorPhotos);

      setSelectedPhotos([]);

      // onClose();
    } catch (error) {
      toast({
        status: "error",
        title: "An error occurred while trying to delete photos",
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

      const updatedVisorPhotos = visorPhotos.filter(
        (photo) => !selectedPhotos.includes(photo)
      );

      setVisorPhotos(updatedVisorPhotos);

      setSelectedPhotos([]);

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

  return (
    <>
      <Flex
        as={"nav"}
        width={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
        paddingX={4}
        paddingY={2}
        borderBottom={!inAlbumPage && !hideNavbarBrand ? "1px" : ""}
        borderBottomColor={"#edf2f7"}
      >
        <ButtonGroup className="navbar__brandContainer">
          {selectedPhotos.length === 0 ? (
            <>
              {inAlbumPage || hideNavbarBrand ? (
                <IconButton
                  rounded={"full"}
                  onClick={() => router.back()}
                  icon={<BsArrowLeft />}
                  variant={"ghost"}
                />
              ) : (
                <NavbarBrand />
              )}
            </>
          ) : (
            <>
              <HStack>
                <Tooltip label="Undo selection">
                  <IconButton
                    onClick={() => setSelectedPhotos([])}
                    icon={<BsXLg />}
                    variant={"ghost"}
                    rounded={"full"}
                  />
                </Tooltip>
                <Text>{selectedPhotos.length} selected</Text>
              </HStack>
            </>
          )}
        </ButtonGroup>

        <ButtonGroup gap={6} className="navbar__menuArea">
          {selectedPhotos.length > 0 ? (
            <>
              <ButtonGroup gap={2} variant={"ghost"} colorScheme="blue">
                {selectedPhotos.every(
                  (photo) => photo.author_account_id === session.user.accountId
                ) ? (
                  <>
                    <Tooltip label="Add selected photos to...">
                      <IconButton icon={<BsPlusLg />} rounded={"full"} />
                    </Tooltip>
                    {inAlbumPage ? (
                      <Tooltip label="Remove selected photos">
                        <IconButton
                          onClick={handleRemoveSelectedPhotosFromAlbum}
                          icon={<BsDashCircle />}
                          rounded={"full"}
                        />
                      </Tooltip>
                    ) : (
                      ""
                    )}
                    <Tooltip label="Delete selected photos">
                      <IconButton
                        icon={<BsTrash />}
                        onClick={handleDeleteSelectedPhotos}
                        rounded={"full"}
                      />
                    </Tooltip>
                  </>
                ) : (
                  <>
                    {isAlbumOwner ? (
                      <>
                        <Tooltip label="Remove selected photos">
                          <IconButton
                            onClick={handleRemoveSelectedPhotosFromAlbum}
                            icon={<BsDashCircle />}
                            rounded={"full"}
                          />
                        </Tooltip>
                      </>
                    ) : (
                      ""
                    )}
                  </>
                )}
                <Tooltip label="Download selected photos">
                  <IconButton icon={<BsDownload />} rounded={"full"} />
                </Tooltip>
              </ButtonGroup>
            </>
          ) : (
            <>{!hideNavbarBrand ? <UploadPhotosForm /> : ""}</>
          )}

          {!hideNavbarBrand ? (
            <Menu>
              <Tooltip label="More options">
                <MenuButton>
                  <Skeleton isLoaded={isMounted} rounded={"full"}>
                    {inAlbumPage ? (
                      <>{selectedPhotos.length === 0 ? <BsThreeDots /> : ""}</>
                    ) : (
                      <Avatar
                        size="sm"
                        name={
                          status === "authenticated" ? session.user.name : ""
                        }
                      />
                    )}
                  </Skeleton>
                </MenuButton>
              </Tooltip>
              <MenuList>
                {inAlbumPage ? (
                  <>
                    {isAlbumOwner ? (
                      <>
                        <MenuItem
                          icon={<BsGearFill />}
                          onClick={() =>
                            setShowAlbumSettings(!showAlbumSettings)
                          }
                        >
                          Settings
                        </MenuItem>
                        <MenuItem
                          onClick={handleDeleteAlbum}
                          icon={<BsTrashFill />}
                        >
                          Delete this album
                        </MenuItem>
                      </>
                    ) : (
                      <MenuItem onClick={handleLeaveAlbum}>
                        Leave album
                      </MenuItem>
                    )}
                  </>
                ) : (
                  <>
                    <MenuGroup>
                      <Link href={"/account/settings"}>
                        <MenuItem icon={<BsGearFill />}>Settings</MenuItem>
                      </Link>
                      <MenuItem
                        icon={<MdLogout />}
                        onClick={() => signOut({ callbackUrl: "/" })}
                      >
                        Log Out
                      </MenuItem>
                    </MenuGroup>
                  </>
                )}
              </MenuList>
            </Menu>
          ) : (
            ""
          )}
        </ButtonGroup>
      </Flex>
    </>
  );
}
