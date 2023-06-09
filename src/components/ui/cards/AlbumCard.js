import { useIsMounted } from "@/hooks/useIsMounted";
import {
  Box,
  Flex,
  Heading,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Text,
  Tooltip,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlinePhotoAlbum } from "react-icons/md";

export default function AlbumCard({ data }) {

  const {data: session, status}= useSession();

  const { id, name, photos, cover } = data;
  const { isMounted } = useIsMounted();

  const router = useRouter();
  const { pathname } = router;

  const inSharedAlbumsPage = pathname === "/shared";

  const toast = useToast();

  const handleDeleteAlbum = async (albumId) => {
    try {
      const deletePromise = axios.delete(`/api/album/${albumId}`);
      toast.promise(deletePromise, {
        loading: { title: "Deleting album..." },
        success: { title: "Album deleted successfully" },
        error: { title: "Error while trying to delete album" },
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error ocurred while trying to delete album.",
        status: "error",
        isClosable: false,
      });
    }
  };

  const handleLeaveAlbum = async (albumId, accountId) => {
    try {
      const leavePromise = axios.delete(
        `/api/album/${albumId}/contributors/${accountId}`
      );

      toast.promise(leavePromise, {
        loading: { title: "Leaving album..." },
        success: { title: "You left the album successfully" },
        error: { title: "An error occurred while trying to leave the album" },
      });

      await leavePromise;

      if(pathname === "/album/[albumId]"){
        router.push("/");
      }

    } catch (error) {
      toast({
        status: "error",
        title: "An error occurred while trying to leave the album",
      });
    }
  };

  return (
    <>
      <VStack position={"relative"} width={"160px"}>
        <Menu>
          <Skeleton isLoaded={isMounted}>
            <Tooltip label="Album options">
              <MenuButton
                position={"absolute"}
                right={3}
                top={5}
                color={cover ? "white" : "black"}
              >
                <BsThreeDotsVertical />
              </MenuButton>
            </Tooltip>
          </Skeleton>

          <MenuList>
            {inSharedAlbumsPage ? (
              <MenuItem onClick={()=>handleLeaveAlbum(data.id, session.user.accountId)}>Leave album</MenuItem>
            ) : (
              <MenuItem onClick={() => handleDeleteAlbum(id)}>
                Delete this album
              </MenuItem>
            )}
          </MenuList>
        </Menu>

        <Link href={`album/${id}`} style={{ width: "100%" }}>
          <Skeleton isLoaded={isMounted} rounded={"md"}>
            <Flex
              width={"100%"}
              height={"160px"}
              backgroundColor={"lightgray"}
              borderRadius={"md"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {cover ? (
                <Image
                  src={cover}
                  alt={""}
                  rounded={"md"}
                  width={"100%"}
                  height={"100%"}
                  objectFit={"cover"}
                />
              ) : (
                <Icon as={MdOutlinePhotoAlbum} boxSize={6} />
              )}
            </Flex>
          </Skeleton>
        </Link>
        <Link href={`album/${id}`} style={{ width: "100%" }}>
          <Tooltip label="Album name">
            <Skeleton isLoaded={isMounted} rounded={"md"}>
              <Heading size={"sm"} width={"100%"}>
                {name}
              </Heading>
            </Skeleton>
          </Tooltip>
          <Skeleton isLoaded={isMounted}>
            <Heading
              size={"xs"}
              fontWeight={"normal"}
              width={"100%"}
              marginTop={1}
            >
              {photos.length} elements
            </Heading>
          </Skeleton>
        </Link>
      </VStack>
    </>
  );
}
