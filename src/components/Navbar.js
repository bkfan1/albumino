import {
  Avatar,
  ButtonGroup,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import SearchForm from "./SearchForm";
import NavbarBrand from "./NavbarBrand";
import UploadPhotosForm from "./UploadPhotosForm";
import { useRouter } from "next/router";
import { BsArrowLeft, BsThreeDots } from "react-icons/bs";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const router = useRouter();
  const { pathname, query } = router;
  const { data: session, status } = useSession();

  const handleDeleteAlbum = async () => {
    const { albumId } = query;
    try {
      const res = await axios.delete(`/api/album/${albumId}`);
      console.log("album deleted successfully");
      router.push("/albums/");
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
          {pathname === "/album/[albumId]" ? (
            <IconButton
              rounded={"full"}
              onClick={() => router.back()}
              icon={<BsArrowLeft />}
              variant={"ghost"}
            />
          ) : (
            <NavbarBrand />
          )}
        </ButtonGroup>

        <Stack className="navbar__formArea">
          {pathname === "/album/[albumId]" ? "" : <SearchForm />}
        </Stack>

        <ButtonGroup gap={6} className="navbar__menuArea">
          <UploadPhotosForm />

          <Menu>
            <MenuButton>
              {pathname === "/album/[albumId]" ? (
                <BsThreeDots />
              ) : (
                <Avatar
                  size="sm"
                  name={status === "authenticated" ? session.user.name : ""}
                />
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
                    <MenuItem
                      onClick={() => signOut({ callbackUrl: "/signin" })}
                    >
                      Log Out
                    </MenuItem>
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
