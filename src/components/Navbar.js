import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import { AiOutlineSearch, AiOutlineUpload } from "react-icons/ai";
import SearchForm from "./SearchForm";
import { HiOutlinePhotograph } from "react-icons/hi";
import Link from "next/link";
import NavbarBrand from "./NavbarBrand";
import UploadPhotoForm from "./UploadPhotoForm";
import { useRouter } from "next/router";
import { BsThreeDots } from "react-icons/bs";
import axios from "axios";

export default function Navbar() {
  const router = useRouter();
  const { pathname, query } = router;
  const handleDeleteAlbum = async () => {
    const { albumId } = query;
    try {
      const res = await axios.delete(`/api/album/${albumId}`);
      console.log("album deleted successfully");
      router.push("/albums/")
    } catch (error) {
      console.log("error");
    }
  };
  return (
    <>
      <Flex
        width={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
        paddingX={4}
        paddingY={2}
      >
        <ButtonGroup>
          <NavbarBrand />
        </ButtonGroup>

        <Stack>
          <SearchForm />
        </Stack>

        <ButtonGroup spacing={6}>
          <UploadPhotoForm />

          <Menu>
            <MenuButton>
              {pathname === "/album/[albumId]" ? (
                <BsThreeDots />
              ) : (
                <Avatar size="sm" />
              )}
            </MenuButton>
            <MenuList>
              {pathname === "/album/[albumId]" ? (
                <>
                  <MenuItem onClick={handleDeleteAlbum}>
                    Delete this album
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuGroup title="Profile">
                    <MenuItem>Settings</MenuItem>
                    <MenuItem>Payments </MenuItem>
                  </MenuGroup>
                  <MenuDivider />
                  <MenuGroup title="Help">
                    <MenuItem>Docs</MenuItem>
                    <MenuItem>FAQ</MenuItem>
                  </MenuGroup>
                </>
              )}
            </MenuList>
          </Menu>
        </ButtonGroup>
      </Flex>
    </>
  );
}
