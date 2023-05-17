import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Image,
  Tooltip,
  VStack,
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
          <Tooltip label="Previous photo">
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
          </Tooltip>
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
              overflowY={"scroll"}
            >
              <IconButton
                onClick={() => setShowAvailableAlbums(false)}
                position={"absolute"}
                right={0}
                top={0}
                margin={2}
                icon={<BsX />}
              />

              <Flex>
                <Heading size={"md"}>Add to:</Heading>
              </Flex>

              <VStack marginTop={6}>
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
          <Tooltip label="Next photo">
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
          </Tooltip>
        ) : (
          ""
        )}
      </Flex>
    </>
  );
}
