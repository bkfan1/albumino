import { useIsMounted } from "@/hooks/useIsMounted";
import {
  Box,
  Flex,
  Heading,
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
import Link from "next/link";

import { BsThreeDotsVertical } from "react-icons/bs";

export default function AlbumCard({ data }) {
  const { id, name, photos, cover } = data;
  const { isMounted } = useIsMounted();
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

  return (
    <>
      <VStack position={"relative"} width={"160px"}>
        <Menu>
          <Tooltip label="Album options">
            <Skeleton isLoaded={isMounted}>
            <MenuButton position={"absolute"} right={3} top={5} color={"white"}>
              <BsThreeDotsVertical />
            </MenuButton>
            </Skeleton>
          </Tooltip>
          <MenuList>
            <MenuItem onClick={() => handleDeleteAlbum(id)}>
              Delete this album
            </MenuItem>
          </MenuList>
        </Menu>

        <Link href={`album/${id}`} style={{ width: "100%" }}>
          <Skeleton isLoaded={isMounted} rounded={"md"}>
          {cover !== "" ? <Image src={cover} alt="Album cover" rounded={"md"}/> : <Box
            width={"100%"}
            height={"160px"}
            backgroundColor={"lightgray"}
            borderRadius={"md"}
          ></Box>}
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
