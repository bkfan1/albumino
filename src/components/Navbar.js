import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  IconButton,
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
import UploadPhotosForm from "./UploadPhotosForm";
import { useRouter } from "next/router";
import { BsArrowLeft, BsCheck, BsThreeDots } from "react-icons/bs";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const router = useRouter();
  const { pathname, query } = router;
  const {data: session, status} = useSession();


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
        borderBottom={pathname === "/album/[albumId]" ? "0px" : "1px"}
        borderBottomColor={"#edf2f7"}
      >
        <ButtonGroup className="navbar__brandContainer">
          {pathname === "/album/[albumId]" ? <IconButton onClick={()=>router.back()} icon={<BsArrowLeft/>} variant={"ghost"} /> : <NavbarBrand />} 
        </ButtonGroup>

        <Stack className="navbar__formArea">
          {pathname === "/album/[albumId]" ? "" : <SearchForm />}
        </Stack>

        <ButtonGroup spacing={6} className="navbar__menuArea">

          <Menu>
            <MenuButton>
              {pathname === "/album/[albumId]" ? (
                <BsThreeDots />
              ) : (
                <Avatar size="sm"/>
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
                    <MenuItem>Payments</MenuItem>
                  </MenuGroup>
                  <MenuDivider />
                  <MenuGroup title="Help">
                    <MenuItem onClick={()=>signOut({callbackUrl:"/signin"})}>Log Out</MenuItem>
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
