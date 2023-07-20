import {
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import MasonryGrid from "../../masonry/MasonryGrid";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import { MasonryGridContext } from "@/contexts/MasonryGridContext";
import { BsX } from "react-icons/bs";
import { useRouter } from "next/router";

export default function AddExistentPhotosToAlbumForm({ albumId }) {
  const { showAddPhotosForm, setShowAddPhotosForm } =
    useContext(AlbumPageContext);

  const { selectedPhotos, setSelectedPhotos } = useContext(MasonryGridContext);

  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!showAddPhotosForm) {
      setSelectedPhotos([]);
    }
  }, [showAddPhotosForm, setSelectedPhotos]);

  const handleOnClickDone = async () => {
    const promises = selectedPhotos.map(async (selectedPhoto) => {
      const data = {
        photoId: selectedPhoto,
      };
      return axios.post(`/api/album/${albumId}/photos`, data);
    });

    toast({
      status: "loading",
      title: "Adding photos to album...",
    });

    await Promise.all(promises)
      .then((res) => {
        toast({
          status: "success",
          title: "Photos added succesfully",
        });
        setShowAddPhotosForm(false);
        router.reload();
      })
      .catch((error) => {
        toast({
          status: "error",
          title: "An error ocurred while trying to add photos",
        });
      });
  };

  return (
    <>
      <Modal
        isOpen={showAddPhotosForm}
        onClose={() => {
          setShowAddPhotosForm(false);
        }}
        size={"8xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton
            onClick={() => setShowAddPhotosForm(false)}
            position={"absolute"}
            left={0}
            ml={4}
            rounded={"full"}
          />
          <ModalHeader>
            <Flex alignItems={"center"} justifyContent={"space-between"} mt={6}>
              <HStack>
                <Heading size={"md"}>Add photos to album</Heading>
              </HStack>

              <Button onClick={handleOnClickDone} colorScheme="blue">
                Done
              </Button>
            </Flex>
          </ModalHeader>

          <ModalBody>
            <MasonryGrid masonryType={"form"} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
