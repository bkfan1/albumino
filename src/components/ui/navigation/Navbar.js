import {
  Avatar,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import SearchForm from "../forms/SearchForm";
import NavbarBrand from "./NavbarBrand";
import { useRouter } from "next/router";
import {
  BsArrowLeft,
  BsGearFill,
  BsThreeDots,
  BsTrash,
  BsTrashFill,
  BsX,
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
  const {inAlbumPage, isAlbumOwner} = useContext(AlbumPageContext);
  const {selectedPhotos, setSelectedPhotos} = useContext(PhotoVisorContext);
  const { isMounted } = useIsMounted();

  const router = useRouter();
  const { query } = router;


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
        borderBottom={!inAlbumPage && "1px"}
        borderBottomColor={"#edf2f7"}
      >
        <ButtonGroup className="navbar__brandContainer">
          {inAlbumPage  ? (
            <>
            {selectedPhotos.length === 0 ? <IconButton
              rounded={"full"}
              onClick={() => router.back()}
              icon={<BsArrowLeft />}
              variant={"ghost"}
            /> : (
              <HStack>
                <Tooltip label="Undo"><IconButton onClick={()=>setSelectedPhotos([])} icon={<BsXLg/>} variant={"ghost"} rounded={"full"} /></Tooltip>
                <Text>{selectedPhotos.length} selected</Text>
              </HStack>
            )}
            </>
          ) : (
            <NavbarBrand />
          )}
        </ButtonGroup>

        <Stack className="navbar__formArea">
          {!inAlbumPage &&  <SearchForm />}
        </Stack>

        <ButtonGroup gap={6} className="navbar__menuArea">
          {inAlbumPage ? (
            <>
            {selectedPhotos.length > 0 && isAlbumOwner ? <Tooltip label="Delete selected photos"><IconButton icon={<BsTrash  />} rounded={"full"} variant={"ghost"} colorScheme="blue"  fontSize={"xl"} /></Tooltip> :  <UploadPhotosForm/>}
            </>
          ) : <UploadPhotosForm/>}

          <Menu>
            <Tooltip label="More options">
              <MenuButton>
                <Skeleton isLoaded={isMounted} rounded={"full"}>
                  {inAlbumPage ? (
                    <>
                    {selectedPhotos.length === 0 ? <BsThreeDots /> : ""}
                    </>
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
              {inAlbumPage ? (
                <>
                {isAlbumOwner ? (
                  <>
                  <MenuItem icon={<BsGearFill />}>Settings</MenuItem>
                  <MenuItem onClick={handleDeleteAlbum} icon={<BsTrashFill />}>
                    Delete this album
                  </MenuItem>
                  </>
                ): <MenuItem>Leave album</MenuItem>}
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
