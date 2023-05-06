import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";
import {
  ButtonGroup,
  Flex,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { BsInfoCircle, BsThreeDots, BsTrash, BsX } from "react-icons/bs";

export default function PhotoVisorHeader({ onClose }) {
  const router = useRouter();
  const { pathname, query } = router;

  const { photo, setShowAvailableAlbums, setAvailableAlbums } = useContext(PhotoVisorContext);
  const toast = useToast();

  const handleDeletePhoto = async () => {
    try {
      const res = await axios.delete(`/api/photo/${photo.id}`);
      toast({
        status: "success",
        title: "Photo deleted successfully.",
        duration: 5000,
      });
      onClose()
    } catch (error) {
      toast({
        status: "error",
        title: "Error",
        description: "An error occurred while attempting to delete photo.",
        duration: 5000,
      });
    }
  };

  const handleRemoveFromAlbum = async () => {
    try {
      const data = {
        albums: photo.albums.filter((id) => id !== query.albumId),
      };
      const res = await axios.put(`/api/photo/${photo.id}`, data);
      toast({
        status: "success",
        title: "Photo removed from album successfully.",
        duration: 5000,
      });
    } catch (error) {
      toast({
        status: "error",
        title: "Error",
        description:
          "An error occurred while attempting to remove photo from album.",
        duration: 5000,
      });
    }
  };

  const handleClickAddToAlbum = async ()=>{
    try {
      const res = await axios.get(`/api/albums`);
      setShowAvailableAlbums(true);
      setAvailableAlbums(res.data.albums)
      console.log("success")

    } catch (error) {
      console.log("error add album")
    }


  }

  return (
    <>
      <Flex
        as="header"
        position="fixed"
        justifyContent={"space-between"}
        zIndex={3}
        top={0}
        left={0}
        right={0}
        paddingTop={4}
        className="photoVisor__header"
      >
        <ButtonGroup variant={"link"}>
          <IconButton
            icon={<BsX />}
            fontSize={"24px"}
            color="white"
            borderRadius={"full"}
            onClick={onClose}
          />
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
          {pathname === "/album/[albumId]" ? (
            ""
          ) : (
            <IconButton
              icon={<BsTrash />}
              fontSize={"24px"}
              color="white"
              borderRadius={"full"}
              title="Delete this photo permanently"
              onClick={handleDeletePhoto}
            />
          )}

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
              <MenuItem onClick={()=>window.open(photo.url)} >Download</MenuItem>
              <MenuItem onClick={handleClickAddToAlbum} >Add to album</MenuItem>
              {pathname === "/album/[albumId]" ? (
                <MenuItem onClick={handleRemoveFromAlbum}>Remove from this album</MenuItem>
              ) : (
                ""
              )}
              {pathname === "/album/[albumId]" ? (
                <MenuItem onClick={handleDeletePhoto}>Delete permanently</MenuItem>
              ) : (
                ""
              )}
            </MenuList>
          </Menu>
        </ButtonGroup>
      </Flex>
    </>
  );
}
