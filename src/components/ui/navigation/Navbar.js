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
  Skeleton,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import SearchForm from "../forms/SearchForm";
import NavbarBrand from "./NavbarBrand";
import { useRouter } from "next/router";
import {
  BsArrowLeft,
  BsGearFill,
  BsThreeDots,
  BsTrashFill,
} from "react-icons/bs";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { MdLogout } from "react-icons/md";
import { useIsMounted } from "@/hooks/useIsMounted";
import UploadPhotosForm from "../forms/UploadPhotosForm";

export default function Navbar() {
  const router = useRouter();
  const { pathname, query } = router;
  const { data: session, status } = useSession();
  const { isMounted } = useIsMounted();

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
            <Tooltip label="More options">
              <MenuButton>
                <Skeleton isLoaded={isMounted} rounded={"full"}>
                  {pathname === "/album/[albumId]" ? (
                    <BsThreeDots />
                  ) : (
                    <Avatar
                      size="sm"
                      name={status === "authenticated" ? session.user.name : ""}
                    />
                  )}
                </Skeleton>
              </MenuButton>
            </Tooltip>
            <MenuList>
              {pathname === "/album/[albumId]" ? (
                <>
                  <MenuItem icon={<BsGearFill />}>Settings</MenuItem>
                  <MenuItem onClick={handleDeleteAlbum} icon={<BsTrashFill />}>
                    Delete this album
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuGroup>
                    <Link href={"settings"}>
                      <MenuItem icon={<BsGearFill />}>Settings</MenuItem>
                    </Link>
                    <MenuItem
                      icon={<MdLogout />}
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
