import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  GridItem,
  HStack,
  IconButton,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  BsInfo,
  BsInfoCircle,
  BsThreeDots,
  BsTrash,
  BsX,
} from "react-icons/bs";

export default function PhotosGridItem({ data }) {
  const router = useRouter();
  const { pathname } = router;
  const toast = useToast();

  const { id, url } = data;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleRemoveFromAlbum = async () => {
    try {
      const data = { album_id: null };
      const res = await axios.put(`/api/photo/${id}`, data);
      onClose();

      console.log("removed from album successfully");
    } catch (error) {
      console.log(error);
      console.log("error while attempting to remove from album");
    }
  };

  const [showAddToAlbumModal, setShowAddToAlbumModal] = useState(false);
  const [availableAlbums, setAvailableAlbums] = useState([]);

  const handleClickAvailableAlbums = async () => {
    try {
      const res = await axios.get("/api/albums");
      const { data } = res;
      const { albums } = data;
      setAvailableAlbums(albums);
      setShowAddToAlbumModal(true);
    } catch (error) {
      console.log("error handle click");
    }
  };

  const handleAddToAlbum = async (albumId) => {
    try {
      const data = { album_id: albumId };
      const res = await axios.put(`/api/photo/${id}`, data);
      toast({
        title: "Added to album",
        description: "Added the photo to the album.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setShowAddToAlbumModal(false);
      setAvailableAlbums([]);
    } catch (error) {
      console.log("error");
      toast({
        title: "An error occurred",
        description:
          "An error ocurred while attempting to add the photo to album.",
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    }
  };

  return (
    <>
      <GridItem>
        <Box position="relative" overflow={"hidden"}>
          <Checkbox position={"absolute"} size={"md"} margin={2} />
          <Image
            src={url}
            alt={"photo"}
            w="100%"
            h="auto"
            borderRadius="md"
            onClick={() => onOpen()}
          />
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay>
            <Flex
              as="header"
              position="fixed"
              justifyContent={"space-between"}
              zIndex={3}
              top={0}
              left={0}
              right={0}
            >
              <ButtonGroup>
                <IconButton icon={<BsX />} onClick={onClose} />
              </ButtonGroup>

              <ButtonGroup variant={"link"}>
                <IconButton
                  icon={
                    <BsInfoCircle
                      fontSize={"24px"}
                      color="white"
                      borderRadius={"full"}
                    />
                  }
                />
                <IconButton
                  icon={<BsTrash />}
                  fontSize={"24px"}
                  color="white"
                  borderRadius={"full"}
                />

                <Menu>
                  <MenuButton
                    as={Button}
                    fontSize={"24px"}
                    color="white"
                    borderRadius={"full"}
                  >
                    <BsThreeDots />
                  </MenuButton>

                  <MenuList>
                    <MenuItem>Download</MenuItem>
                    <MenuItem onClick={handleClickAvailableAlbums}>
                      Add to album
                    </MenuItem>
                    {pathname === "/album/[albumId]" ? (
                      <MenuItem onClick={handleRemoveFromAlbum}>
                        Remove from this album
                      </MenuItem>
                    ) : (
                      ""
                    )}
                  </MenuList>
                </Menu>
              </ButtonGroup>
            </Flex>

            <Flex
              width={"100%"}
              height={"100%"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Box position="relative">
                <Image
                  src={url}
                  alt={"photo"}
                  w="auto"
                  h="auto"
                  onClick={onOpen}
                />
              </Box>

              {showAddToAlbumModal ? (
                <Box position={"absolute"} zIndex={2} backgroundColor={"white"}>
                  <Text>Add to</Text>
                  <VStack>
                    {availableAlbums.map((album) => (
                      <HStack
                        key={album._id}
                        onClick={() => handleAddToAlbum(album._id)}
                        _hover={{
                          cursor: "pointer",
                          backgroundColor: "blackAlpha.100",
                        }}
                      >
                        <Box
                          width={"80px"}
                          height={"80px"}
                          backgroundColor={"lightgray"}
                          borderRadius={"md"}
                        ></Box>
                        <Text>{album.name}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              ) : (
                ""
              )}
            </Flex>
          </ModalOverlay>
        </Modal>
      </GridItem>
    </>
  );
}
