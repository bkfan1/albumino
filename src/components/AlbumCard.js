import {
  Box,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";

import { BsThreeDotsVertical } from "react-icons/bs";

export default function AlbumCard({ data }) {
  const { id, name, length } = data;
  const toast = useToast();

  const handleDeleteAlbum = async (albumId) => {
    try {
      const res = await axios.delete(`/api/album/${albumId}`);
      toast({
        title: "Album deleted",
        description: "Album deleted succesfully.",
        status: "success",
        duration: 5000,
        isClosable: false,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error ocurred while attempting to delete album.",
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    }
  };

  return (
    <>
      <VStack position={"relative"} width={"160px"}>
        <Menu>
          <MenuButton position={"absolute"} right={3} top={5}>
            <BsThreeDotsVertical />
          </MenuButton>
          <MenuList>
            <MenuItem>Share this album</MenuItem>
            <MenuItem onClick={() => handleDeleteAlbum(id)}>
              Delete this album
            </MenuItem>
          </MenuList>
        </Menu>

        <Link href={`album/${id}`} style={{ width: "100%" }}>
          <Box
            width={"100%"}
            height={"160px"}
            backgroundColor={"lightgray"}
            borderRadius={"md"}
          ></Box>
        </Link>
        <Link href={`album/${id}`} style={{ width: "100%" }}>
          <Heading size={"sm"} width={"100%"}>
            {name}
          </Heading>
          <Heading
            size={"xs"}
            fontWeight={"normal"}
            width={"100%"}
            marginTop={1}
          >
            {length} elements
          </Heading>
        </Link>
      </VStack>
    </>
  );
}
