import {
  Flex,
  IconButton,
  Image,
  ModalBody,
  ModalContent,
  ModalHeader,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useContext } from "react";
import { BsChevronLeft, BsChevronRight, BsX } from "react-icons/bs";
import AvailableAlbumCard from "../cards/AvailableAlbumCard";
import { MasonryGridContext } from "@/contexts/MasonryGridContext";
import PhotoVisorDrawer from "./PhotoVisorDrawer";
import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";
export default function PhotoVisorBody({}) {
  const {
    currentVisorPhoto,
    setCurrentVisorPhoto,
    showAvailableAlbums,
    setShowAvailableAlbums,
    availableAlbums,
    setAvailableAlbums,
  } = useContext(PhotoVisorContext);

  const { masonryPhotos } = useContext(MasonryGridContext);

  const photoIndex = masonryPhotos.findIndex(
    (photo) => photo.id === currentVisorPhoto.id
  );

  const isLastPhoto = photoIndex === masonryPhotos.length - 1;

  const handleSetNextPhoto = () => {
    if (!isLastPhoto) {
      const updatedCurrentVisorPhoto = masonryPhotos[photoIndex + 1];
      setCurrentVisorPhoto(updatedCurrentVisorPhoto);
    }
  };

  const handleSetPrevPhoto = () => {
    if (photoIndex !== 0) {
      const updatedCurrentVisorPhoto = masonryPhotos[photoIndex - 1];
      setCurrentVisorPhoto(updatedCurrentVisorPhoto);
    }
  };

  return (
    <>
      <Flex
        width={"100%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        className="photoVisor__body"
      >
        {photoIndex !== 0 ? (
          <>
            <Flex
              onClick={handleSetPrevPhoto}
              _hover={{ cursor: "pointer" }}
              height={"100%"}
              position={"absolute"}
              left={0}
              paddingX={4}
            >
              <IconButton
                as={BsChevronLeft}
                rounded={"full"}
                variant={"link"}
                color={"white"}
              />
            </Flex>
          </>
        ) : (
          ""
        )}

        <Flex height={"100%"}>
          <Image
            src={currentVisorPhoto.url}
            alt={"Photo"}
            objectFit={"contain"}
            maxW="100%"
            maxH="100%"
          />
        </Flex>

        {showAvailableAlbums ? (
          <>
            <ModalContent>
              <ModalHeader>
                <Text>Available albums</Text>
                <IconButton
                  onClick={() => {
                    setShowAvailableAlbums(false);
                    setAvailableAlbums([]);
                  }}
                  _hover={{ cursor: "pointer" }}
                  as={BsX}
                  position={"absolute"}
                  right={0}
                  top={0}
                  margin={4}
                  size={"sm"}
                  variant={"ghost"}
                />
              </ModalHeader>

              <ModalBody>
                <VStack height={"290px"} overflowY={"scroll"}>
                  {availableAlbums.map((album) => (
                    <AvailableAlbumCard key={album.id} album={album} />
                  ))}
                </VStack>
              </ModalBody>
            </ModalContent>
          </>
        ) : (
          ""
        )}

        {!isLastPhoto ? (
          <Flex
            onClick={handleSetNextPhoto}
            _hover={{ cursor: "pointer" }}
            height={"100%"}
            position={"absolute"}
            right={0}
            paddingX={4}
          >
            <IconButton
              as={BsChevronRight}
              rounded={"full"}
              variant={"link"}
              color={"white"}
            />
          </Flex>
        ) : (
          ""
        )}
      </Flex>

      {/* To display details about the current visor photo*/}
      <PhotoVisorDrawer />
    </>
  );
}
