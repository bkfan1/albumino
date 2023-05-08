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
import { useContext } from "react";
import { BsArrowLeft, BsArrowRight, BsX } from "react-icons/bs";
import AvailableAlbumCard from "./AvailableAlbumCard";

export default function PhotoVisorBody({ children }) {
  const {
    photos,
    currentPhoto,
    showAvailableAlbums,
    setShowAvailableAlbums,
    availableAlbums,
    handleSetNextPhoto,
    handleSetPreviousPhoto,
  } = useContext(PhotoVisorContext);

  const photoIndex = photos.findIndex((photo) => photo.id === currentPhoto.id);
  const isLastPhoto = photoIndex === photos.length - 1;

  return (
    <>
      <Flex
        width={"100%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        className="photoVisor__body"
      >
        {!(photoIndex === 0) ? (
          <IconButton
            onClick={handleSetPreviousPhoto}
            icon={<BsArrowLeft />}
            rounded={"full"}
            position={"absolute"}
            left={0}
            size={"lg"}
            zIndex={3}
            marginLeft={4}
          />
        ) : (
          ""
        )}

        <Box position="relative">
          <Image src={currentPhoto.url} alt={"photo"} w="auto" h="auto" />
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
        {!isLastPhoto ? (
          <IconButton
            onClick={handleSetNextPhoto}
            icon={<BsArrowRight />}
            rounded={"full"}
            position={"absolute"}
            right={0}
            size={"lg"}
            zIndex={3}
            marginRight={4}
          />
        ) : (
          ""
        )}
      </Flex>
    </>
  );
}
