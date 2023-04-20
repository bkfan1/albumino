import {
  Box,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";

import { BsThreeDotsVertical } from "react-icons/bs";

export default function AlbumCard({data}) {
  const {id, name, elements} = data;
  return (
    <>
      <VStack position={"relative"} width={"160px"}>
        <Menu>
          <MenuButton position={"absolute"} right={3} top={5}>
            <BsThreeDotsVertical />
          </MenuButton>
          <MenuList>
            <MenuItem>Share this album</MenuItem>
            <MenuItem>Delete this album</MenuItem>
          </MenuList>
        </Menu>

        <Box
          width={"100%"}
          height={"160px"}
          backgroundColor={"lightgray"}
          borderRadius={"md"}
        ></Box>
        <Link href={`album/${id}`} style={{width:"100%"}}>
        <Heading size={"sm"} width={"100%"}>
          {name}
        </Heading>
        </Link>
        <Heading size={"xs"} fontWeight={"normal"} width={"100%"}>
          {elements} elements
        </Heading>
      </VStack>
    </>
  );
}
