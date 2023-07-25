import { Box, HStack, Icon, Image, Text, VStack } from "@chakra-ui/react";
import { MdOutlinePhotoAlbum } from "react-icons/md";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { MasonryGridContext } from "@/contexts/MasonryGridContext";
import { useContext } from "react";
import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";

export default function AvailableAlbumCard({ album }) {
  const {
    currentVisorPhoto,
    setCurrentVisorPhoto,
    setShowAvailableAlbums,
    setAvailableAlbums,
  } = useContext(PhotoVisorContext);

  const isPhotoAlreadyOnAlbum =
    currentVisorPhoto.albums.includes(album.id) ||
    album.photos.find((albumPhoto) => albumPhoto.id === currentVisorPhoto.id)
      ? true
      : false;

  const toast = useToast();

  const handleAddToAlbum = async (albumId) => {
    const data = {
      photoId: currentVisorPhoto.id,
    };

    const res = axios.post(`/api/album/${albumId}/photos/`, data);

    toast.promise(res, {
      loading: { title: "Adding photo to album..." },
      success: { title: "Photo added to album succesfully" },
      error: { title: "Error while trying to add photo to album" },
    });

    const updatedCurrentVisorPhoto = {
      ...currentVisorPhoto,
      albums: [...currentVisorPhoto.albums, { id: albumId }],
    };

    setCurrentVisorPhoto(updatedCurrentVisorPhoto);

    setShowAvailableAlbums(false);
    setAvailableAlbums([]);
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
          {currentVisorPhoto.albums.includes(album.id) ||
          isPhotoAlreadyOnAlbum ? (
            <Text fontStyle={"italic"}>Already on this album</Text>
          ) : (
            ""
          )}
        </VStack>
      </HStack>
    </>
  );
}
