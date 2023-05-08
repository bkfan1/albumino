import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";
import { Box, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { useContext } from "react";
import { MdOutlinePhotoAlbum } from "react-icons/md";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

export default function AvailableAlbumCard({ album }) {
  const {
    currentPhoto,
    setShowAvailableAlbums,
    setAvailableAlbums,
  } = useContext(PhotoVisorContext);

  const isPhotoAlreadyOnAlbum =
    currentPhoto.albums.includes(album.id) ||
    album.photos.find((albumPhoto) => albumPhoto.id === currentPhoto.id)
      ? true
      : false;

  const toast = useToast();

  const handleAddToAlbum = async (albumId) => {
    try {
      const data = { albums: [...currentPhoto.albums, { _id: albumId }] };
      const res = await axios.put(`/api/photo/${currentPhoto.id}`, data);
      toast({
        status: "success",
        title: "Added Photo to album.",
        duration: 5000,
        isClosable: false,
      });
      setShowAvailableAlbums(false);
      setAvailableAlbums([]);
    } catch (error) {
      console.log(error)
      toast({
        status: "error",
        title: "Error",
        description:
          "An error occurred while attempting to add photo to album.",
        duration: 5000,
        isClosable: false,
      });
    }
  };

  return (
    <>
      <HStack
        key={album.id}
        onClick={() =>
          isPhotoAlreadyOnAlbum ? null : handleAddToAlbum(album.id)
        }
        _hover={{
          cursor: isPhotoAlreadyOnAlbum ? "" : "pointer",
          backgroundColor: !isPhotoAlreadyOnAlbum && "whitesmoke",
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
          borderRadius={"md"}
          as="figure"
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <MdOutlinePhotoAlbum />
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
