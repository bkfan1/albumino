import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";
import {
  Box,
  Flex,
  HStack,
  Heading,
  IconButton,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext } from "react";
import { BsX } from "react-icons/bs";
import AvailableAlbumCard from "./AvailableAlbumCard";

export default function PhotoVisorBody({ children }) {
  const {
    photo,
    modal,
    showAvailableAlbums,
    setShowAvailableAlbums,
    availableAlbums,
  } = useContext(PhotoVisorContext);

  return (
    <>
      <Flex
        width={"100%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        className="photoVisor__body"
      >
        <Box position="relative">
          <Image
            src={photo.url}
            alt={"photo"}
            w="auto"
            h="auto"
            onClick={modal.onOpen}
          />
        </Box>
        {showAvailableAlbums ? (
          <>
            <Box
              position={"absolute"}
              padding={4}
              width={"300px"}
              height={"300px"}
              backgroundColor={"white"}
              borderRadius={"md"}
            >
              <IconButton
                onClick={() => setShowAvailableAlbums(false)}
                icon={<BsX />}
                position={"absolute"}
                right={0}
                marginRight={4}
              ></IconButton>
              <Heading size={"md"} marginY={2}>
                Add to:
              </Heading>
              <VStack>
              {availableAlbums.map((album) => (
                <AvailableAlbumCard key={album.id} album={album} />
              ))}
              </VStack>
            </Box>
          </>
        ) : (
          ""
        )}
      </Flex>
    </>
  );
}
