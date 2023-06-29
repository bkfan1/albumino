// import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";
import { Box, HStack, Icon, Image, Text, VStack } from "@chakra-ui/react";
// import { useContext } from "react";
import { MdOutlinePhotoAlbum } from "react-icons/md";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

export default function AvailableAlbumCard({ album }) {
  // const {
  //   currentPhoto,
  //   updateCurrentPhoto,
  //   setShowAvailableAlbums,
  //   setAvailableAlbums,
  // } = useContext(PhotoVisorContext);

  // const isPhotoAlreadyOnAlbum =
  //   currentPhoto.albums.includes(album.id) ||
  //   album.photos.find((albumPhoto) => albumPhoto.id === currentPhoto.id)
  //     ? true
  //     : false;

  // const toast = useToast();

  // const handleAddToAlbum = async (albumId) => {
  //   try {
  //     const addPromise = axios.put(
  //       `/api/album/${albumId}/photos/${currentPhoto.id}`
  //     );

  //     toast.promise(addPromise, {
  //       loading: { title: "Adding photo to album..." },
  //       success: { title: "Photo added to album succesfully" },
  //       error: { title: "Error while trying to add photo to album" },
  //     });

  //     await addPromise;

  //     const updatedCurrentPhoto = {
  //       ...currentPhoto,
  //       albums: [...currentPhoto.albums, { id: albumId }],
  //     }

  //     updateCurrentPhoto(updatedCurrentPhoto);

  //     setShowAvailableAlbums(false);
  //     setAvailableAlbums([]);
  //   } catch (error) {
  //     console.log(error);
  //     toast({
  //       status: "error",
  //       title: "Error",
  //       description: "An error occurred while trying to add photo to album.",
  //       duration: 5000,
  //       isClosable: false,
  //     });
  //   }
  // };

  return (
    <>
      <HStack
        key={album.id}
        onClick={() =>
          isPhotoAlreadyOnAlbum ? null : handleAddToAlbum(album.id)
        }
        _hover={{
          cursor: isPhotoAlreadyOnAlbum ? "" : "pointer",
          backgroundColor: !isPhotoAlreadyOnAlbum ? "whitesmoke" : "",
        }}
        borderRadius={"md"}
        width={"100%"}
        opacity={isPhotoAlreadyOnAlbum && "75%"}
        backgroundColor={isPhotoAlreadyOnAlbum ? "whitesmoke" : ""}
      >
        <Box
          width={"80px"}
          height={"80px"}
          backgroundColor={"lightgray"}
          rounded={"md"}
          as="figure"
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          {album.cover ? (
            <Image
              src={album.cover}
              width={"100%"}
              height={"100%"}
              objectFit={"cover"}
              rounded={"md"}
              alt="Album cover"
            />
          ) : (
            <Icon as={MdOutlinePhotoAlbum} boxSize={4}></Icon>
          )}
        </Box>
        <VStack>
          <Text width={"100%"}>{album.name}</Text>
          {currentPhoto.albums.includes(album.id) || isPhotoAlreadyOnAlbum ? (
            <Text fontStyle={"italic"}>Already on this album</Text>
          ) : (
            ""
          )}
        </VStack>
      </HStack>
    </>
  );
}
