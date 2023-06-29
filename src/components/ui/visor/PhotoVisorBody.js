// import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Image,
  ModalBody,
  ModalContent,
  ModalHeader,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useContext } from "react";
import {
  BsArrowLeft,
  BsArrowRight,
  BsChevronLeft,
  BsChevronRight,
  BsX,
} from "react-icons/bs";
import AvailableAlbumCard from "../cards/AvailableAlbumCard";

export default function PhotoVisorBody({}) {
  // const {
  //   visorPhotos,
  //   currentPhoto,
  //   showAvailableAlbums,
  //   setShowAvailableAlbums,
  //   availableAlbums,
  //   handleSetNextPhoto,
  //   handleSetPreviousPhoto,
  // } = useContext(PhotoVisorContext);

  // const photoIndex = visorPhotos.findIndex(
  //   (photo) => photo.id === currentPhoto.id
  // );

  // const isLastPhoto = photoIndex === visorPhotos.length - 1;

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
              icon={<BsChevronLeft />}
              rounded={"full"}
              position={"absolute"}
              left={0}
              size={"lg"}
              zIndex={3}
              marginLeft={4}
              variant={"link"}
              color={"white"}
            />
          </Tooltip>
        ) : (
          ""
        )}

        <Box position="relative">
          <Image src={currentPhoto.url} alt={"Photo"} objectFit={"contain"} maxW="100%" maxH="100%" />
        </Box>
        {showAvailableAlbums ? (
          <>
            <ModalContent>
              <ModalHeader>
                <IconButton
                  onClick={() => setShowAvailableAlbums(false)}
                  position={"absolute"}
                  right={0}
                  top={0}
                  margin={2}
                  icon={<BsX />}
                />

                <Heading size={"md"}>Add photo to</Heading>
              </ModalHeader>

              <ModalBody>
                <VStack width={"100%"}>
                <Text width={"100%"}>Available albums:</Text>
                <VStack marginTop={6} height={"72"} overflowY={"scroll"} width={"100%"}>
                  {availableAlbums.map((album) => (
                    <AvailableAlbumCard key={album.id} album={album} />
                  ))}
                </VStack>
                </VStack>
              </ModalBody>
            </ModalContent>
          </>
        ) : (
          ""
        )}

        {!isLastPhoto ? (
          <Tooltip label="Next photo">
            <IconButton
              onClick={handleSetNextPhoto}
              icon={<BsChevronRight />}
              rounded={"full"}
              position={"absolute"}
              right={0}
              size={"lg"}
              zIndex={3}
              marginRight={4}
              variant={"link"}
              color={"white"}
            />
          </Tooltip>
        ) : (
          ""
        )}
      </Flex>
    </>
  );
}
