import { AlbumsContext } from "@/contexts/AlbumsContext";
import { useIsMounted } from "@/hooks/useIsMounted";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
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
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";

import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlinePhotoAlbum } from "react-icons/md";

export default function AlbumCard({ data }) {
  const { handleDeleteAlbum, handleLeaveAlbum } = useContext(AlbumsContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: session, status } = useSession();

  const { id, name, photos, cover } = data;
  const { isMounted } = useIsMounted();

  const router = useRouter();
  const { pathname } = router;

  const inSharedAlbumsPage = pathname === "/shared";

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
              <MenuItem
                onClick={() =>
                  handleLeaveAlbum(data.id, session.user.accountId)
                }
              >
                Leave album
              </MenuItem>
            ) : (
              <MenuItem onClick={() => onOpen()}>Delete this album</MenuItem>
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
              <Heading size={"sm"} width={"100%"} noOfLines={1}>
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

      <AlertDialog isOpen={isOpen} isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Delete album</AlertDialogHeader>
          <AlertDialogBody>
            <Text>
              Deleted albums cannot be recovered. Photos and videos in deleted
              albums are kept in Google Photos.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup>
              <Button onClick={() => onClose()}>Cancel</Button>

              <Button
                onClick={() => handleDeleteAlbum(data.id, onClose)}
                colorScheme="red"
              >
                Delete
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
